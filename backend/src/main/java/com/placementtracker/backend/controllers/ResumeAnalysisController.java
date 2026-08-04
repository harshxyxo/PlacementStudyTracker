package com.placementtracker.backend.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.placementtracker.backend.models.ResumeAnalysis;
import com.placementtracker.backend.repositories.ResumeAnalysisRepository;
import com.placementtracker.backend.models.User;
import com.placementtracker.backend.services.AiService;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.placementtracker.backend.security.CustomUserDetails;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/resume")
public class ResumeAnalysisController {
    
    @Autowired
    private ResumeAnalysisRepository repo;
    
    @Autowired
    private AiService aiService;
    
    @Autowired
    private com.placementtracker.backend.services.ActivityLogService activityLogService;
    
    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping("/latest")
    public ResumeAnalysis getLatest(@AuthenticationPrincipal CustomUserDetails user) {
        return repo.findTopByUserIdOrderByAnalyzedAtDesc(user.getId());
    }

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeResume(@AuthenticationPrincipal CustomUserDetails user, @RequestParam("file") MultipartFile file) {
        if(user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
        
        try {
            String text = extractText(file);
            String jsonResult = aiService.analyzeResume(text);
            
            ResumeAnalysis analysis = objectMapper.readValue(jsonResult, ResumeAnalysis.class);
            analysis.setUserId(user.getId());
            analysis.setAnalyzedAt(LocalDateTime.now());
            analysis.setRawText(text);
            
            ResumeAnalysis saved = repo.save(analysis);
            activityLogService.logActivity(user.getId(), "RESUME_ANALYZED", "Analyzed a resume. Score: " + analysis.getAtsScore());
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body("Analysis temporarily unavailable, please try again");
        }
    }

    @GetMapping("/{id}/download-enhanced")
    public ResponseEntity<byte[]> downloadEnhanced(@AuthenticationPrincipal CustomUserDetails user, @PathVariable String id) {
        ResumeAnalysis analysis = repo.findById(id).orElse(null);
        if (analysis == null || !analysis.getUserId().equals(user.getId())) return ResponseEntity.notFound().build();
        
        ResumeAnalysis.StructuredResume structuredResume = analysis.getStructuredResume();
        if (structuredResume == null) {
            return ResponseEntity.badRequest().body("Structured resume data not available for this analysis. Please re-analyze the resume.".getBytes());
        }
        
        try (PDDocument document = new PDDocument()) {
            org.apache.pdfbox.pdmodel.PDPage page = new org.apache.pdfbox.pdmodel.PDPage();
            document.addPage(page);
            
            float margin = 50;
            float yStart = page.getMediaBox().getHeight() - margin;
            float width = page.getMediaBox().getWidth() - 2 * margin;
            
            org.apache.pdfbox.pdmodel.font.PDFont fontRegular = org.apache.pdfbox.pdmodel.font.PDType1Font.HELVETICA;
            org.apache.pdfbox.pdmodel.font.PDFont fontBold = org.apache.pdfbox.pdmodel.font.PDType1Font.HELVETICA_BOLD;
            org.apache.pdfbox.pdmodel.font.PDFont fontItalic = org.apache.pdfbox.pdmodel.font.PDType1Font.HELVETICA_OBLIQUE;
            
            org.apache.pdfbox.pdmodel.PDPageContentStream[] contentStreamHolder = new org.apache.pdfbox.pdmodel.PDPageContentStream[1];
            contentStreamHolder[0] = new org.apache.pdfbox.pdmodel.PDPageContentStream(document, page);
            
            float[] currentY = {yStart};
            org.apache.pdfbox.pdmodel.PDPage[] currentPage = {page};

            // Helper for page breaks
            Runnable checkPageBreak = () -> {
                if (currentY[0] < margin) {
                    try {
                        contentStreamHolder[0].close();
                        currentPage[0] = new org.apache.pdfbox.pdmodel.PDPage();
                        document.addPage(currentPage[0]);
                        contentStreamHolder[0] = new org.apache.pdfbox.pdmodel.PDPageContentStream(document, currentPage[0]);
                        currentY[0] = yStart;
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            };

            // 1. Name
            if (structuredResume.getName() != null) {
                checkPageBreak.run();
                String name = cleanText(structuredResume.getName());
                float nameFontSize = 20;
                float nameWidth = nameFontSize * fontBold.getStringWidth(name) / 1000;
                float nameIndent = Math.max(0, (width - nameWidth) / 2);
                
                contentStreamHolder[0].beginText();
                contentStreamHolder[0].setFont(fontBold, nameFontSize);
                contentStreamHolder[0].newLineAtOffset(margin + nameIndent, currentY[0]);
                contentStreamHolder[0].showText(name);
                contentStreamHolder[0].endText();
                currentY[0] -= (nameFontSize * 1.2f);
            }

            // 2. Contact
            if (structuredResume.getContact() != null) {
                checkPageBreak.run();
                String contact = cleanText(structuredResume.getContact());
                float contactFontSize = 9;
                float contactWidth = contactFontSize * fontRegular.getStringWidth(contact) / 1000;
                float contactIndent = Math.max(0, (width - contactWidth) / 2);
                
                contentStreamHolder[0].beginText();
                contentStreamHolder[0].setFont(fontRegular, contactFontSize);
                contentStreamHolder[0].newLineAtOffset(margin + contactIndent, currentY[0]);
                contentStreamHolder[0].showText(contact);
                contentStreamHolder[0].endText();
                
                currentY[0] -= 8; // 8pt spacing after
                
                // Horizontal line
                contentStreamHolder[0].setLineWidth(1f);
                contentStreamHolder[0].setStrokingColor(200, 200, 200); // Light gray
                contentStreamHolder[0].moveTo(margin, currentY[0]);
                contentStreamHolder[0].lineTo(margin + width, currentY[0]);
                contentStreamHolder[0].stroke();
                
                currentY[0] -= 10; // 10pt spacing after line
            }

            // 3. Sections
            if (structuredResume.getSections() != null) {
                boolean firstSection = true;
                for (ResumeAnalysis.Section section : structuredResume.getSections()) {
                    if (section.getHeading() == null) continue;
                    
                    if (!firstSection) {
                        currentY[0] -= 6; // 6pt spacing above (except first)
                    }
                    firstSection = false;
                    
                    checkPageBreak.run();
                    
                    // Section Heading
                    String heading = cleanText(section.getHeading().toUpperCase());
                    contentStreamHolder[0].beginText();
                    contentStreamHolder[0].setFont(fontBold, 12);
                    contentStreamHolder[0].newLineAtOffset(margin, currentY[0]);
                    contentStreamHolder[0].showText(heading);
                    contentStreamHolder[0].endText();
                    
                    currentY[0] -= 4; // Spacing below heading before rule
                    
                    // Horizontal rule
                    contentStreamHolder[0].setLineWidth(0.5f);
                    contentStreamHolder[0].setStrokingColor(0, 0, 0); // Black
                    contentStreamHolder[0].moveTo(margin, currentY[0]);
                    contentStreamHolder[0].lineTo(margin + width, currentY[0]);
                    contentStreamHolder[0].stroke();
                    
                    currentY[0] -= (12 + 4); // Move down past rule and spacing
                    
                    if (section.getEntries() != null) {
                        for (ResumeAnalysis.Entry entry : section.getEntries()) {
                            checkPageBreak.run();
                            
                            boolean hasTitle = entry.getTitle() != null && !entry.getTitle().trim().isEmpty();
                            boolean hasDate = entry.getDateRange() != null && !entry.getDateRange().trim().isEmpty();
                            
                            if (hasTitle || hasDate) {
                                contentStreamHolder[0].beginText();
                                if (hasTitle) {
                                    String titleText = cleanText(entry.getTitle());
                                    contentStreamHolder[0].setFont(fontBold, 10.5f);
                                    contentStreamHolder[0].newLineAtOffset(margin, currentY[0]);
                                    contentStreamHolder[0].showText(titleText);
                                }
                                if (hasDate) {
                                    String dateText = cleanText(entry.getDateRange());
                                    float dateWidth = 9.5f * fontRegular.getStringWidth(dateText) / 1000;
                                    if (!hasTitle) {
                                        contentStreamHolder[0].newLineAtOffset(margin + width - dateWidth, currentY[0]);
                                    } else {
                                        String titleText = cleanText(entry.getTitle());
                                        float titleWidth = 10.5f * fontBold.getStringWidth(titleText) / 1000;
                                        contentStreamHolder[0].newLineAtOffset(width - dateWidth - titleWidth, 0);
                                    }
                                    contentStreamHolder[0].setFont(fontRegular, 9.5f);
                                    contentStreamHolder[0].showText(dateText);
                                }
                                contentStreamHolder[0].endText();
                                currentY[0] -= (10.5f * 1.2f);
                            }
                            
                            if (entry.getSubtitle() != null && !entry.getSubtitle().trim().isEmpty()) {
                                checkPageBreak.run();
                                String subtitle = cleanText(entry.getSubtitle());
                                
                                // Check if it's TECHNICAL SKILLS (bold category label)
                                if (section.getHeading().equalsIgnoreCase("TECHNICAL SKILLS") && subtitle.contains(":")) {
                                    int colonIndex = subtitle.indexOf(":");
                                    String category = subtitle.substring(0, colonIndex + 1);
                                    String rest = subtitle.substring(colonIndex + 1);
                                    
                                    contentStreamHolder[0].beginText();
                                    contentStreamHolder[0].newLineAtOffset(margin, currentY[0]);
                                    contentStreamHolder[0].setFont(fontBold, 9.5f);
                                    contentStreamHolder[0].showText(category);
                                    contentStreamHolder[0].setFont(fontRegular, 9.5f);
                                    contentStreamHolder[0].showText(rest);
                                    contentStreamHolder[0].endText();
                                } else {
                                    contentStreamHolder[0].beginText();
                                    contentStreamHolder[0].setFont(fontItalic, 9.5f);
                                    contentStreamHolder[0].newLineAtOffset(margin, currentY[0]);
                                    contentStreamHolder[0].showText(subtitle);
                                    contentStreamHolder[0].endText();
                                }
                                currentY[0] -= (9.5f * 1.2f + 2); // 2pt spacing after
                            }
                            
                            if (entry.getBullets() != null) {
                                for (String bullet : entry.getBullets()) {
                                    if (bullet == null || bullet.trim().isEmpty()) continue;
                                    String bulletText = cleanText(bullet);
                                    if (bulletText.startsWith("-") || bulletText.startsWith("*")) {
                                        bulletText = bulletText.substring(1).trim();
                                    } else if (bulletText.startsWith("\u2022")) {
                                        bulletText = bulletText.substring(1).trim();
                                    }
                                    
                                    float indent = 12;
                                    float fontSize = 9.5f;
                                    float leading = fontSize * 1.15f;
                                    
                                    String[] words = bulletText.split(" ");
                                    StringBuilder currentLineStr = new StringBuilder();
                                    
                                    boolean firstBulletLine = true;
                                    
                                    for (String word : words) {
                                        String possibleLine = currentLineStr.length() == 0 ? word : currentLineStr + " " + word;
                                        float size = 0;
                                        try {
                                            size = fontSize * fontRegular.getStringWidth(possibleLine) / 1000;
                                        } catch (Exception e) {
                                            possibleLine = possibleLine.replaceAll("[^a-zA-Z0-9 \\p{Punct}]", "");
                                            size = fontSize * fontRegular.getStringWidth(possibleLine) / 1000;
                                        }
                                        
                                        if (size > (width - indent) && currentLineStr.length() > 0) {
                                            checkPageBreak.run();
                                            contentStreamHolder[0].beginText();
                                            contentStreamHolder[0].setFont(fontRegular, fontSize);
                                            contentStreamHolder[0].newLineAtOffset(margin + indent, currentY[0]);
                                            if (firstBulletLine) {
                                                contentStreamHolder[0].newLineAtOffset(-indent, 0);
                                                contentStreamHolder[0].showText("\u2022 ");
                                                contentStreamHolder[0].newLineAtOffset(indent, 0);
                                            }
                                            contentStreamHolder[0].showText(currentLineStr.toString());
                                            contentStreamHolder[0].endText();
                                            currentY[0] -= leading;
                                            currentLineStr = new StringBuilder(word);
                                            firstBulletLine = false;
                                        } else {
                                            currentLineStr.append(currentLineStr.length() == 0 ? "" : " ").append(word);
                                        }
                                    }
                                    
                                    if (currentLineStr.length() > 0) {
                                        checkPageBreak.run();
                                        contentStreamHolder[0].beginText();
                                        contentStreamHolder[0].setFont(fontRegular, fontSize);
                                        contentStreamHolder[0].newLineAtOffset(margin + indent, currentY[0]);
                                        if (firstBulletLine) {
                                            contentStreamHolder[0].newLineAtOffset(-indent, 0);
                                            contentStreamHolder[0].showText("\u2022 ");
                                            contentStreamHolder[0].newLineAtOffset(indent, 0);
                                        }
                                        contentStreamHolder[0].showText(currentLineStr.toString());
                                        contentStreamHolder[0].endText();
                                        currentY[0] -= leading;
                                    }
                                    currentY[0] -= 3; // 3pt spacing between bullets
                                }
                            }
                            currentY[0] -= 8; // 8pt spacing after entry
                        }
                    }
                }
            }

            contentStreamHolder[0].close();
            
            java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream();
            document.save(baos);
            
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.setContentType(org.springframework.http.MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "Enhanced_Resume.pdf");
            
            return new ResponseEntity<>(baos.toByteArray(), headers, HttpStatus.OK);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private String cleanText(String text) {
        if (text == null) return "";
        return text.replace("‘", "'").replace("’", "'").replace("“", "\"").replace("”", "\"")
                   .replace("–", "-").replace("—", "-")
                   .replaceAll("[^\\x20-\\x7E\\n\\r\\t]", "");
    }

    private boolean isSectionHeader(String line) {
        if (line.length() > 40) return false;
        // Contains letters, and all letters are uppercase
        return line.matches(".*[a-zA-Z].*") && line.toUpperCase().equals(line);
    }

    @PatchMapping("/{id}/acknowledge-keyword")
    public ResponseEntity<?> acknowledgeKeyword(@AuthenticationPrincipal CustomUserDetails user, @PathVariable String id, @RequestBody java.util.Map<String, String> payload) {
        String keyword = payload.get("keyword");
        if (keyword == null) return ResponseEntity.badRequest().body("Keyword required");
        ResumeAnalysis analysis = repo.findById(id).orElse(null);
        if (analysis == null || !analysis.getUserId().equals(user.getId())) return ResponseEntity.notFound().build();
        
        if (analysis.getAcknowledgedKeywords() == null) {
            analysis.setAcknowledgedKeywords(new java.util.ArrayList<>());
        }
        if (!analysis.getAcknowledgedKeywords().contains(keyword)) {
            analysis.getAcknowledgedKeywords().add(keyword);
            repo.save(analysis);
        }
        return ResponseEntity.ok(analysis);
    }
    
    private String extractText(MultipartFile file) throws Exception {
        String filename = file.getOriginalFilename().toLowerCase();
        if (filename.endsWith(".pdf")) {
            try (PDDocument document = PDDocument.load(file.getInputStream())) {
                PDFTextStripper stripper = new PDFTextStripper();
                return stripper.getText(document);
            }
        } else if (filename.endsWith(".docx")) {
            try (XWPFDocument document = new XWPFDocument(file.getInputStream())) {
                XWPFWordExtractor extractor = new XWPFWordExtractor(document);
                return extractor.getText();
            }
        }
        return new String(file.getBytes());
    }
}
