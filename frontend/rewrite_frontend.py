import os
import re

BASE_DIR = r"c:\Users\harsh_isu7tmt\OneDrive\Desktop\PlacementStudyTracker\frontend\src\pages"

def rewrite_mock_interviews():
    path = os.path.join(BASE_DIR, "MockInterviewScheduling.tsx")
    with open(path, "r") as f:
        content = f.read()

    # Add imports
    content = content.replace("import React from 'react';", "import React, { useState, useEffect } from 'react';")
    
    # Add interface and state
    interface_def = """
interface MockInterview {
    id: string;
    interviewerName: string;
    interviewerRole: string;
    topic: string;
    scheduledAt: string;
    status: string;
}
"""
    content = content.replace("const MockInterviewScheduling: React.FC = () => {", interface_def + "\nconst MockInterviewScheduling: React.FC = () => {\n    const [interviews, setInterviews] = useState<MockInterview[]>([]);\n    useEffect(() => {\n        const fetchInterviews = async () => {\n            const res = await fetch('http://localhost:8080/api/interviews', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });\n            if (res.ok) { setInterviews(await res.json()); }\n        };\n        fetchInterviews();\n    }, []);\n")

    # Replace the two static cards with a map.
    # The first card starts with <div className="glass-card rounded-2xl p-6 glass-card-hover transition-all relative overflow-hidden group hover:scale-[1.02]">
    # The second card starts with <div className="glass-card rounded-2xl p-6 glass-card-hover transition-all hover:scale-[1.02]">
    
    # Regex to find the whole flex col containing the cards
    # It's inside <div className="flex flex-col gap-4"> ... </div>
    
    map_code = """
{interviews.length === 0 ? <p className="text-on-surface-variant">No upcoming sessions.</p> : interviews.map(interview => (
<div key={interview.id} className="glass-card rounded-2xl p-6 glass-card-hover transition-all relative overflow-hidden group hover:scale-[1.02]">
<div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-fixed-dim"></div>
<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

<div className="flex gap-4 items-center hover:scale-[1.02]">
<div className="w-14 h-14 rounded-full overflow-hidden border border-outline-variant shrink-0 bg-surface-container-high">
<span className="material-symbols-outlined text-4xl m-2 text-on-surface-variant">person</span>
</div>
<div>
<div className="flex items-center gap-2 mb-1">
<h4 className="font-stats-numeric text-stats-numeric font-semibold text-on-surface">{interview.interviewerName}</h4>
<span className="px-2 py-0.5 rounded text-[10px] uppercase font-label-caps tracking-wider bg-surface-variant text-on-surface-variant">{interview.interviewerRole}</span>
</div>
<p className="text-on-surface-variant font-body-md flex items-center gap-1">
<span className="material-symbols-outlined text-[16px]">topic</span> {interview.topic}
                                        </p>
</div>
</div>

<div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 md:gap-2 hover:scale-[1.02]">
<div className="text-right">
<p className="text-primary-fixed-dim font-bold font-stats-numeric text-stats-numeric">{new Date(interview.scheduledAt).toLocaleDateString()}</p>
<p className="text-on-surface-variant text-sm">{new Date(interview.scheduledAt).toLocaleTimeString()}</p>
</div>
<div className="flex gap-2">
<button className="p-2 rounded-lg border border-outline-variant hover:border-primary-fixed-dim hover:text-primary-fixed-dim transition-colors text-on-surface-variant" title="Reschedule">
<span className="material-symbols-outlined text-[20px]">edit_calendar</span>
</button>
<button className="px-4 py-2 rounded-lg bg-surface-variant hover:bg-surface-bright text-on-surface transition-colors font-medium text-sm">
                                            Join Link
                                        </button>
</div>
</div>
</div>
</div>
))}
"""
    # Replace the contents of <div className="flex flex-col gap-4">
    pattern = r'(<div className="flex flex-col gap-4">)(.*?)(</div>\s*<div className="lg:col-span-4 flex flex-col gap-6">)'
    content = re.sub(pattern, r'\1' + map_code + r'\3', content, flags=re.DOTALL)
    
    with open(path, "w") as f:
        f.write(content)
    print("Rewrote MockInterviewScheduling.tsx")

def rewrite_resume_analyzer():
    path = os.path.join(BASE_DIR, "ResumeAnalyzer.tsx")
    with open(path, "r") as f:
        content = f.read()

    content = content.replace("import React from 'react';", "import React, { useState, useEffect } from 'react';")
    
    interface_def = """
interface ResumeAnalysis {
    id: string;
    overallScore: number;
    impactScore: number;
    brevityScore: number;
    skillsMatchScore: number;
    criticalIssues: string[];
    suggestions: string[];
    analyzedAt: string;
}
"""
    state_code = """
    const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchLatest = async () => {
            const res = await fetch('http://localhost:8080/api/resume/latest', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
            if (res.ok) {
                const data = await res.json();
                if (data) setAnalysis(data);
            }
        };
        fetchLatest();
    }, []);

    const triggerAnalysis = async () => {
        setLoading(true);
        const res = await fetch('http://localhost:8080/api/resume/analyze', { method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
        if (res.ok) {
            setAnalysis(await res.json());
        }
        setLoading(false);
    };
"""
    content = content.replace("const ResumeAnalyzer: React.FC = () => {", interface_def + "\nconst ResumeAnalyzer: React.FC = () => {\n" + state_code)

    # Attach triggerAnalysis to the button
    content = content.replace('<button className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#00dce5] to-[#14d1ff]', '<button onClick={triggerAnalysis} className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#00dce5] to-[#14d1ff]')

    # Replace static scores
    content = re.sub(r'<span className="font-display text-display text-on-surface">85', r'<span className="font-display text-display text-on-surface">{analysis?.overallScore || "--"}', content)
    
    with open(path, "w") as f:
        f.write(content)
    print("Rewrote ResumeAnalyzer.tsx")

rewrite_mock_interviews()
rewrite_resume_analyzer()
