import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';
import API_BASE_URL from '../config';



interface ResumeAnalysis {
    id: string;
    atsScore: number;
    missingKeywords: string[];
    acknowledgedKeywords?: string[];
    suggestions: { type: string; title: string; detail: string }[];
    improvedBullets?: { original: string; improved: string }[];
    rawText?: string;
    analyzedAt: string;
}

const ResumeAnalyzer: React.FC = () => {

    const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
    const [loading, setLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        const fetchLatest = async () => {
            if (!sessionStorage.getItem('resume_session_active')) return;
            const res = await fetch(`${API_BASE_URL}:8080/api/resume/latest`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
            if (res.ok) {
                const data = await res.json();
                if (data) setAnalysis(data);
            }
        };
        fetchLatest();
    }, []);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`${API_BASE_URL}:8080/api/resume/analyze`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: formData
            });
            if (res.ok) {
                setAnalysis(await res.json());
                sessionStorage.setItem('resume_session_active', 'true');
                toast.success('Resume analyzed successfully!');
            } else {
                const text = await res.text();
                toast.error(text || 'Analysis failed');
            }
        } catch (err) {
            console.error(err);
            toast.error('Network error during analysis');
        } finally {
            setLoading(false);
            if (event.target) event.target.value = '';
        }
    };

    const handleAcknowledgeKeyword = async (keyword: string) => {
        if (!analysis) return;
        try {
            const res = await fetch(`${API_BASE_URL}:8080/api/resume/${analysis.id}/acknowledge-keyword`, {
                method: 'PATCH',
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ keyword })
            });
            if (res.ok) {
                const updated = await res.json();
                setAnalysis(updated);
                toast.success(`Added ${keyword} to your skill gaps!`);
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to acknowledge keyword');
        }
    };

    const handleDownloadEnhanced = async () => {
        if (!analysis) return;
        setIsDownloading(true);
        try {
            const toastId = toast.loading('Generating PDF...');
            const res = await fetch(`${API_BASE_URL}:8080/api/resume/${analysis.id}/download-enhanced`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'Enhanced_Resume.pdf';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                toast.success('Downloaded successfully!', { id: toastId });
            } else {
                toast.error('Failed to download PDF', { id: toastId });
            }
        } catch (error) {
            toast.error('Network error downloading PDF');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <Layout>
            

<div className="mb-8">
<h1 className="font-headline-lg text-headline-lg text-on-surface">Resume Analysis</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl">Upload your latest resume to evaluate its ATS compatibility, identify missing key skills, and get actionable insights for your target roles.</p>
</div>

<div className="grid grid-cols-12 gap-6">

<div className="col-span-12 lg:col-span-8 bg-[#161B22] rounded-2xl border border-[#30363D] p-6 flex flex-col justify-center items-center min-h-[320px] relative overflow-hidden group border-2 border-dashed border-outline-variant hover:border-primary-fixed-dim hover:bg-surface-variant/10 transition-all cursor-pointer">
<div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-4 text-primary-fixed-dim group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "\"wght\" 300" }}>cloud_upload</span>
</div>
<h3 className="font-headline-md text-headline-md text-on-surface mb-2">Drag &amp; Drop your Resume</h3>
<p className="font-body-md text-body-md text-on-surface-variant text-center max-w-md mb-6">Supports PDF, DOCX up to 5MB. We'll instantly parse and analyze it against standard software engineering ATS systems.</p>
<label className={`px-6 py-2 rounded-lg bg-gradient-to-r from-[#00dce5] to-[#14d1ff] text-on-primary-fixed font-medium flex items-center gap-2 cursor-pointer hover:opacity-90 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
<span className="material-symbols-outlined text-sm">{loading ? 'hourglass_empty' : 'upload_file'}</span>
                        {loading ? 'Analyzing...' : 'Browse Files'}
<input accept=".pdf,.doc,.docx" className="hidden" type="file" onChange={handleFileUpload} />
</label>
</div>

<div className="col-span-12 lg:col-span-4 bg-[#161B22] rounded-2xl border border-[#30363D] p-6 flex flex-col items-center justify-center relative hover:-translate-y-1 hover:border-primary-fixed-dim/50 hover:shadow-[0_0_20px_rgba(0,220,229,0.15)] transition-all duration-300">
<h3 className="font-body-lg text-body-lg text-on-surface-variant absolute top-6 left-6 font-medium">Overall ATS Match</h3>
<div className="relative w-48 h-48 mt-8">

<svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
<circle cx="50" cy="50" fill="transparent" r="40" stroke="#21262D" stroke-dasharray="251.2" stroke-dashoffset="0" stroke-width="8"></circle>

<circle className="drop-shadow-[0_0_8px_rgba(0,220,229,0.4)]" cx="50" cy="50" fill="transparent" r="40" stroke="url(#gradient-score)" stroke-dasharray="251.2" stroke-dashoffset={analysis ? 251.2 - (251.2 * (analysis.atsScore / 100)) : 251.2} stroke-linecap="round" stroke-width="8" style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}></circle>
<defs>
<linearGradient id="gradient-score" x1="0%" x2="100%" y1="0%" y2="100%">
<stop offset="0%" stop-color="#00dce5"></stop>
<stop offset="100%" stop-color="#4cd6ff"></stop>
</linearGradient>
</defs>
</svg>

<div className="absolute inset-0 flex flex-col items-center justify-center">
<span className="font-display text-display text-on-surface">{analysis?.atsScore || "--"}<span className="text-2xl text-on-surface-variant">/100</span></span>
<span className="font-label-caps text-label-caps text-secondary-fixed-dim mt-1">{analysis ? (analysis.atsScore > 80 ? 'Excellent' : analysis.atsScore > 50 ? 'Average' : 'Needs Work') : 'Pending'}</span>
</div>
</div>
<div className="mt-6 flex items-center gap-2 text-sm text-on-surface-variant bg-surface-container-high px-4 py-2 rounded-full border border-outline-variant">
<span className="material-symbols-outlined text-sm text-tertiary-fixed-dim">trending_up</span>
                        {analysis ? `Top ${100 - analysis.atsScore}% of candidates` : 'Upload to see percentile'}
                    </div>
</div>

<div className="col-span-12 lg:col-span-6 h-fit bg-[#161B22] rounded-2xl border border-[#30363D] p-6 flex flex-col hover:-translate-y-1 hover:border-primary-fixed-dim/50 hover:shadow-[0_0_20px_rgba(0,220,229,0.15)] transition-all duration-300">
<div className="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant">
<div className="w-8 h-8 rounded-lg bg-secondary-container/20 flex items-center justify-center text-secondary-fixed-dim">
<span className="material-symbols-outlined text-sm">troubleshoot</span>
</div>
<h3 className="font-headline-md text-headline-md text-on-surface">Missing Keywords</h3>
</div>
<p className="font-body-md text-body-md text-on-surface-variant mb-6">Based on target roles (Backend Developer, SRE), consider naturally integrating these terms if you have the experience.</p>
<div className="flex flex-wrap gap-2 mt-auto">
{analysis?.missingKeywords ? analysis.missingKeywords.map((kw, i) => {
    const isAcknowledged = analysis.acknowledgedKeywords?.includes(kw);
    return (
<span key={i} onClick={() => !isAcknowledged && handleAcknowledgeKeyword(kw)} className={`font-label-caps text-label-caps px-3 py-1.5 rounded-md border flex items-center gap-1.5 transition-all ${isAcknowledged ? 'bg-surface-container-highest border-outline-variant text-on-surface-variant opacity-70 cursor-default' : 'bg-[#004f53]/30 text-[#00dce5] border-[#00dce5]/20 hover:-translate-y-0.5 hover:border-primary-fixed-dim/50 hover:bg-[#004f53]/50 cursor-pointer'}`}>
<span className="material-symbols-outlined text-[14px]">{isAcknowledged ? 'check' : 'add'}</span> {kw}
</span>
    );
}) : (
  <span className="text-on-surface-variant">Upload a resume to see missing keywords.</span>
)}
</div>
</div>

<div className="col-span-12 lg:col-span-6 bg-[#161B22] rounded-2xl border border-[#30363D] p-6 flex flex-col hover:-translate-y-1 hover:border-primary-fixed-dim/50 hover:shadow-[0_0_20px_rgba(0,220,229,0.15)] transition-all duration-300">
<div className="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant">
<div className="w-8 h-8 rounded-lg bg-tertiary-container/20 flex items-center justify-center text-tertiary-fixed-dim">
<span className="material-symbols-outlined text-sm">lightbulb</span>
</div>
<h3 className="font-headline-md text-headline-md text-on-surface">Actionable Suggestions</h3>
</div>
<ul className="space-y-4">
{analysis?.suggestions ? analysis.suggestions.map((sug, i) => (
<li key={i} className="flex items-start gap-3">
<span className={`material-symbols-outlined mt-0.5 ${sug.type === 'error' ? 'text-error' : sug.type === 'success' ? 'text-primary-fixed-dim' : 'text-tertiary-fixed-dim'}`} style={{ fontVariationSettings: "\"FILL\" 1" }}>
{sug.type === 'error' ? 'error' : sug.type === 'success' ? 'check_circle' : 'warning'}
</span>
<div>
<h4 className="font-body-md text-body-md font-bold text-on-surface">{sug.title}</h4>
<p className="font-body-md text-body-md text-on-surface-variant mt-1">{sug.detail}</p>
</div>
</li>
)) : (
  <span className="text-on-surface-variant">Upload a resume to see actionable suggestions.</span>
)}
</ul>
</div>

{/* Rewrite Suggestions */}
<div className="col-span-12 bg-[#161B22] rounded-2xl border border-[#30363D] p-6 hover:shadow-[0_0_20px_rgba(0,220,229,0.15)] transition-all duration-300">
    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant">
        <div className="w-8 h-8 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary-fixed-dim">
            <span className="material-symbols-outlined text-sm">edit_document</span>
        </div>
        <h3 className="font-headline-md text-headline-md text-on-surface">Resume Rewrite Suggestions</h3>
    </div>
    
    {analysis?.improvedBullets && analysis.improvedBullets.length > 0 ? (
        <div className="space-y-6">
            {analysis.improvedBullets.map((bullet, idx) => (
                <div key={idx} className="flex flex-col md:flex-row gap-4 border border-outline-variant rounded-xl p-4 bg-surface/30">
                    <div className="flex-1">
                        <div className="text-xs font-label-caps text-error mb-2 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">cancel</span> Original</div>
                        <p className="text-sm text-on-surface-variant italic">"{bullet.original}"</p>
                    </div>
                    <div className="hidden md:flex items-center justify-center text-outline-variant">
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </div>
                    <div className="flex-1">
                        <div className="text-xs font-label-caps text-primary-fixed-dim mb-2 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">check_circle</span> ATS-Optimized</div>
                        <p className="text-sm text-on-surface">"{bullet.improved}"</p>
                    </div>
                </div>
            ))}
        </div>
    ) : (
        <p className="text-on-surface-variant">Upload a resume to get AI-powered rewrite suggestions for your weakest bullet points.</p>
    )}
</div>

{/* Raw Text & Download */}
<div className="col-span-12 bg-[#161B22] rounded-2xl border border-[#30363D] p-6 hover:shadow-[0_0_20px_rgba(0,220,229,0.15)] transition-all duration-300">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-outline-variant">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface">
                <span className="material-symbols-outlined text-sm">text_snippet</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface">Original Resume Text</h3>
        </div>
        {analysis?.rawText && (
            <button 
                onClick={handleDownloadEnhanced}
                disabled={isDownloading}
                className="bg-primary-container text-on-primary-container px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-fixed disabled:opacity-50 transition-colors flex items-center gap-2 w-fit"
            >
                <span className="material-symbols-outlined text-sm">{isDownloading ? 'hourglass_empty' : 'download'}</span>
                {isDownloading ? 'Processing...' : 'Download Enhanced (PDF)'}
            </button>
        )}
    </div>
    
    {analysis?.rawText ? (
        <div className="bg-[#0D1117] border border-outline-variant rounded-xl p-4 max-h-96 overflow-y-auto">
            <pre className="text-sm text-on-surface-variant font-mono whitespace-pre-wrap">{analysis.rawText}</pre>
        </div>
    ) : (
        <p className="text-on-surface-variant">Upload a resume to see the extracted text.</p>
    )}
</div>

</div>
        </Layout>
    );
};

export default ResumeAnalyzer;
