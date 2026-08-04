package com.placementtracker.backend.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String analyzeResume(String resumeText) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;
        
        String prompt = "Act as a strict ATS resume screening system for a software engineering role. " +
                "Given this resume text, return a JSON object with EXACTLY this structure: " +
                "{\"atsScore\": 85, \"missingKeywords\": [\"Kubernetes\", \"Java\"], \"suggestions\": [{\"type\": \"error|warning|success\", \"title\": \"string\", \"detail\": \"string\"}], \"improvedBullets\": [{\"original\": \"string\", \"improved\": \"string\"}], \"structuredResume\": {\"name\": \"string\", \"contact\": \"string\", \"sections\": [{\"heading\": \"string\", \"entries\": [{\"title\": \"string\", \"subtitle\": \"string\", \"dateRange\": \"string\", \"bullets\": [\"string\"]}]}]} }. " +
                "For improvedBullets, take the top 3 weakest bullet points from the resume and provide an improved, ATS-optimized version. " +
                "Parse this resume into the exact JSON structure above. Group skills lines under TECHNICAL SKILLS as separate entries with empty bullets array. For PROJECTS and any experience sections, use the IMPROVED/rewritten bullet text (not the original) in the bullets array. " +
                "Return ONLY valid JSON without any markdown formatting like ```json. \n\nResume Text:\n" + resumeText;
        
        try {
            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of("parts", List.of(
                        Map.of("text", prompt)
                    ))
                ),
                "generationConfig", Map.of(
                    "responseMimeType", "application/json"
                )
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<String> entity = new HttpEntity<>(objectMapper.writeValueAsString(requestBody), headers);
            
            String response = restTemplate.postForObject(url, entity, String.class);
            
            Map<String, Object> responseMap = objectMapper.readValue(response, Map.class);
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseMap.get("candidates");
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            String jsonOutput = (String) parts.get(0).get("text");
            
            // Clean up any potential markdown formatting if Gemini still included it
            if (jsonOutput.startsWith("```json")) {
                jsonOutput = jsonOutput.substring(7);
            }
            if (jsonOutput.endsWith("```")) {
                jsonOutput = jsonOutput.substring(0, jsonOutput.length() - 3);
            }
            return jsonOutput.trim();
            
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Gemini API call failed", e);
        }
    }

    private final Map<String, CachedInsight> insightCache = new ConcurrentHashMap<>();

    private static class CachedInsight {
        String insight;
        long timestamp;
        CachedInsight(String insight, long timestamp) {
            this.insight = insight;
            this.timestamp = timestamp;
        }
    }

    public String generateDsaInsight(String userId, String category, double solveRate) {
        String cacheKey = userId + "_" + category;
        CachedInsight cached = insightCache.get(cacheKey);
        if (cached != null && System.currentTimeMillis() - cached.timestamp < 10800000) {
            return cached.insight;
        }

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;
        String prompt = "The user has a low solve rate of " + String.format("%.0f", solveRate * 100) + "% in " + category + ". " +
                "Provide ONE short, highly actionable tip (under 30 words) to help them improve in this specific DSA topic. Do not include quotes or conversational filler.";
        
        try {
            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of("parts", List.of(
                        Map.of("text", prompt)
                    ))
                )
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<String> entity = new HttpEntity<>(objectMapper.writeValueAsString(requestBody), headers);
            String response = restTemplate.postForObject(url, entity, String.class);
            
            Map<String, Object> responseMap = objectMapper.readValue(response, Map.class);
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseMap.get("candidates");
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            String tip = (String) parts.get(0).get("text");
            
            tip = tip.replace("\"", "").trim();
            insightCache.put(cacheKey, new CachedInsight(tip, System.currentTimeMillis()));
            return tip;
            
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<String> generatePrepTopics(String role) {
        if (role == null || role.trim().isEmpty()) return List.of("General Behavioral", "Resume Deep Dive", "System Design");
        
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;
        String prompt = "Return a JSON array of 3 short, specific technical interview topics/prep areas for the role: '" + role + "'. " +
                "For example, for 'Backend Developer', return [\"System Design\", \"SQL\", \"REST APIs\"]. " +
                "Return ONLY a valid JSON array of strings without any markdown formatting like ```json.";
        
        try {
            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of("parts", List.of(
                        Map.of("text", prompt)
                    ))
                ),
                "generationConfig", Map.of(
                    "responseMimeType", "application/json"
                )
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<String> entity = new HttpEntity<>(objectMapper.writeValueAsString(requestBody), headers);
            String response = restTemplate.postForObject(url, entity, String.class);
            
            Map<String, Object> responseMap = objectMapper.readValue(response, Map.class);
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseMap.get("candidates");
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            String jsonOutput = (String) parts.get(0).get("text");
            
            if (jsonOutput.startsWith("```json")) {
                jsonOutput = jsonOutput.substring(7);
            }
            if (jsonOutput.endsWith("```")) {
                jsonOutput = jsonOutput.substring(0, jsonOutput.length() - 3);
            }
            
            return objectMapper.readValue(jsonOutput.trim(), List.class);
            
        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
        }
    }
}
