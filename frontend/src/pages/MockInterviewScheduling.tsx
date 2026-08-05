import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';



interface MockInterview {
    id: string;
    interviewerName: string;
    interviewerRole: string;
    topic: string;
    scheduledAt: string;
    status: string;
    feedbackScore?: number;
    feedbackText?: string;
    feedbackTags?: string[];
}

const MockInterviewScheduling: React.FC = () => {
    const [interviews, setInterviews] = useState<MockInterview[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
    const [currentDate, setCurrentDate] = useState(new Date());
    
    // Form state
    const [interviewerName, setInterviewerName] = useState('');
    const [interviewerRole, setInterviewerRole] = useState('');
    const [topic, setTopic] = useState('');
    const [scheduledAt, setScheduledAt] = useState('');
    const fetchInterviews = async () => {
        const res = await fetch('https://placementstudytracker.onrender.com:8080/api/interviews', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
        if (res.ok) { setInterviews(await res.json()); }
    };
    
    useEffect(() => {
        fetchInterviews();
    }, []);

    const handleSchedule = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('https://placementstudytracker.onrender.com:8080/api/interviews', {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                interviewerName,
                interviewerRole,
                topic,
                scheduledAt: new Date(scheduledAt).toISOString(),
                status: 'Upcoming'
            })
        });
        if (res.ok) {
            setShowForm(false);
            setInterviewerName('');
            setInterviewerRole('');
            setTopic('');
            setScheduledAt('');
            fetchInterviews();
        }
    };

    const upcomingInterviews = interviews.filter(i => i.status === 'Upcoming').sort((a,b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
    const pastInterviews = interviews.filter(i => i.status === 'Completed').sort((a,b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());

    // Calendar logic
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const prevMonthDays = getDaysInMonth(year, month - 1);

    const prevMonthDaysArray = Array.from({length: firstDay}, (_, i) => prevMonthDays - firstDay + i + 1);
    const currentMonthDaysArray = Array.from({length: daysInMonth}, (_, i) => i + 1);
    
    const totalDaysRendered = firstDay + daysInMonth;
    const nextMonthDaysCount = totalDaysRendered % 7 === 0 ? 0 : 7 - (totalDaysRendered % 7);
    const nextMonthDaysArray = Array.from({length: nextMonthDaysCount}, (_, i) => i + 1);

    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const getSessionsForDay = (day: number) => {
        return interviews.filter(i => {
            const d = new Date(i.scheduledAt);
            return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
        });
    };

    
    return (
        <Layout>
            <div className="h-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
<div>
<h2 className="font-display text-display font-bold text-on-surface mb-2 tracking-tight">Mock Interviews</h2>
<p className="font-body-lg text-body-lg text-on-surface-variant">Schedule sessions with industry experts to perfect your technique.</p>
</div>
<button onClick={() => setShowForm(!showForm)} className="px-6 py-3 rounded-lg gradient-btn font-body-md font-bold flex items-center gap-2 hover:scale-105 transition-transform">
<span className="material-symbols-outlined">{showForm ? 'close' : 'add'}</span>
                    {showForm ? 'Cancel' : 'Schedule New Mock'}
                </button>
</div>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

<div className="lg:col-span-8 flex flex-col gap-6">

{showForm && (
    <div className="glass-card rounded-2xl p-6 mb-4 border border-primary-fixed-dim/30">
        <h3 className="font-headline-md text-headline-md font-semibold text-on-surface mb-4">Schedule Mock Interview</h3>
        <form onSubmit={handleSchedule} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-on-surface-variant mb-1">Interviewer Name</label>
                    <input type="text" required value={interviewerName} onChange={e => setInterviewerName(e.target.value)} className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-4 py-2 text-on-surface" placeholder="e.g. Alex R." />
                </div>
                <div>
                    <label className="block text-sm text-on-surface-variant mb-1">Interviewer Role</label>
                    <input type="text" required value={interviewerRole} onChange={e => setInterviewerRole(e.target.value)} className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-4 py-2 text-on-surface" placeholder="e.g. SDE II @ Amazon" />
                </div>
                <div>
                    <label className="block text-sm text-on-surface-variant mb-1">Topic</label>
                    <input type="text" required value={topic} onChange={e => setTopic(e.target.value)} className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-4 py-2 text-on-surface" placeholder="e.g. System Design" />
                </div>
                <div>
                    <label className="block text-sm text-on-surface-variant mb-1">Date & Time</label>
                    <input type="datetime-local" required value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-4 py-2 text-on-surface [color-scheme:dark]" />
                </div>
            </div>
            <button type="submit" className="self-end px-6 py-2 rounded-lg bg-primary-fixed text-on-primary-fixed font-medium hover:bg-primary-fixed-dim transition-colors mt-2">Confirm Schedule</button>
        </form>
    </div>
)}

<div className="flex items-center justify-between border-b border-outline-variant pb-2">
<h3 className="font-headline-md text-headline-md font-semibold text-on-surface">Upcoming Sessions</h3>
<div className="flex items-center gap-2 bg-surface-container-high p-1 rounded-lg">
    <button 
        onClick={() => setViewMode('list')}
        className={`px-3 py-1 rounded-md text-label-caps transition-colors ${viewMode === 'list' ? 'bg-primary-fixed-dim text-on-primary-fixed font-bold' : 'text-on-surface-variant hover:text-on-surface'}`}
    >
        List
    </button>
    <button 
        onClick={() => setViewMode('calendar')}
        className={`px-3 py-1 rounded-md text-label-caps transition-colors ${viewMode === 'calendar' ? 'bg-primary-fixed-dim text-on-primary-fixed font-bold' : 'text-on-surface-variant hover:text-on-surface'}`}
    >
        Calendar
    </button>
</div>
</div>



{viewMode === 'list' ? (
    <div className="flex flex-col gap-4 mt-4">
    {upcomingInterviews.length === 0 ? <p className="text-on-surface-variant">No upcoming sessions.</p> : upcomingInterviews.map(interview => (
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
    <p className="text-primary-fixed-dim font-bold font-stats-numeric text-stats-numeric">{new Date(interview.scheduledAt).toLocaleDateString([], { month: 'short', day: '2-digit', year: 'numeric' })}</p>
    <p className="text-on-surface-variant text-sm">{new Date(interview.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
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
    </div>
) : (
    <div className="glass-card rounded-2xl p-6 flex flex-col gap-6 mt-4">
        <div className="flex items-center justify-between mb-2">
            <h4 className="font-headline-md text-on-surface">{currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}</h4>
            <div className="flex gap-2">
                <button onClick={handlePrevMonth} className="p-2 rounded-lg hover:bg-surface-variant text-on-surface-variant"><span className="material-symbols-outlined">chevron_left</span></button>
                <button onClick={handleNextMonth} className="p-2 rounded-lg hover:bg-surface-variant text-on-surface-variant"><span className="material-symbols-outlined">chevron_right</span></button>
            </div>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center border-b border-outline-variant/30 pb-2">
            <div className="text-label-caps text-on-surface-variant">Sun</div>
            <div className="text-label-caps text-on-surface-variant">Mon</div>
            <div className="text-label-caps text-on-surface-variant">Tue</div>
            <div className="text-label-caps text-on-surface-variant">Wed</div>
            <div className="text-label-caps text-on-surface-variant">Thu</div>
            <div className="text-label-caps text-on-surface-variant">Fri</div>
            <div className="text-label-caps text-on-surface-variant">Sat</div>
        </div>
        <div className="grid grid-cols-7 gap-2">
            {prevMonthDaysArray.map(day => (
                <div key={`prev-${day}`} className="h-24 p-2 rounded-lg text-on-surface-variant/30">{day}</div>
            ))}
            {currentMonthDaysArray.map(day => {
                const sessions = getSessionsForDay(day);
                return (
                    <div key={`curr-${day}`} className="h-24 p-2 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface hover:bg-surface-variant/50 transition-all cursor-pointer hover:scale-105 relative overflow-hidden">
                        <span className="font-bold relative z-10">{day}</span>
                        {sessions.map((session, idx) => {
                            if (session.status === 'Completed') {
                                return (
                                    <div key={idx} className="mt-1 flex items-center gap-1 text-secondary-fixed-dim/70 relative z-10">
                                        <span className="material-symbols-outlined text-xs">check_circle</span>
                                        <span className="text-[9px] font-label-caps uppercase tracking-wider">Joined</span>
                                    </div>
                                );
                            } else {
                                return (
                                    <div key={idx} className="absolute inset-0 bg-primary-fixed-dim/20 border-2 border-primary-fixed-dim text-primary-fixed-dim flex flex-col justify-end p-1 pb-2">
                                        <div className="bg-primary-fixed-dim text-on-primary-fixed text-[10px] p-0.5 rounded truncate font-bold mb-0.5">Mock: {session.interviewerName}</div>
                                        <div className="bg-primary-fixed-dim/30 text-primary-fixed-dim text-[9px] px-0.5 rounded truncate font-medium uppercase tracking-wider">{session.interviewerRole}</div>
                                    </div>
                                );
                            }
                        })}
                    </div>
                );
            })}
            {nextMonthDaysArray.map(day => (
                <div key={`next-${day}`} className="h-24 p-2 rounded-lg text-on-surface-variant/30">{day}</div>
            ))}
        </div>
    </div>
)}
</div>

<div className="lg:col-span-4 flex flex-col gap-6">

<div className="flex items-center justify-between border-b border-outline-variant pb-2">
<h3 className="font-headline-md text-headline-md font-semibold text-on-surface">Past Feedback</h3>
<span className="material-symbols-outlined text-on-surface-variant">history</span>
</div>

{pastInterviews.length === 0 ? (
    <p className="text-on-surface-variant text-sm">No past feedback yet.</p>
) : pastInterviews.map(interview => (
    <div key={interview.id} className="glass-card rounded-2xl p-5 flex flex-col gap-3 hover:scale-[1.02] transition-all glass-card-hover">
        <div className="flex justify-between items-start">
            <div>
                <h5 className="font-bold text-on-surface">{interview.topic}</h5>
                <p className="text-xs text-on-surface-variant">{new Date(interview.scheduledAt).toLocaleDateString([], { month: 'short', day: '2-digit' })} • w/ {interview.interviewerName} ({interview.interviewerRole})</p>
            </div>
            
            <div className={`font-stats-numeric font-bold px-3 py-1 rounded-lg border flex items-center gap-1 ${
                (interview.feedbackScore || 0) >= 8 ? 'bg-[#1a2e25] text-green-400 border-green-900/50' :
                (interview.feedbackScore || 0) >= 6 ? 'bg-[#2e261a] text-yellow-400 border-yellow-900/50' :
                'bg-[#3a1a1a] text-red-400 border-red-900/50'
            }`}>
                {interview.feedbackScore?.toFixed(1) || '--'} <span className="text-xs opacity-70 font-normal">/10</span>
            </div>
        </div>
        <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30 text-sm text-on-surface-variant italic relative">
            <span className="material-symbols-outlined absolute -top-2 -left-2 text-surface-variant rotate-180 bg-surface-container-lowest rounded-full text-sm">format_quote</span>
            "{interview.feedbackText || 'No detailed feedback provided.'}"
        </div>
        <div className="flex flex-wrap gap-2 mt-1">
            {interview.feedbackTags?.map((tag, idx) => (
                <span key={idx} className="px-2 py-1 rounded-md bg-surface-variant text-xs font-label-caps text-on-surface-variant">{tag}</span>
            ))}
        </div>
    </div>
))}
</div>
</div>
            </div>
        </Layout>
    );
};

export default MockInterviewScheduling;
