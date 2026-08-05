import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Layout from '../components/Layout';

interface DailyTask {
    id: string;
    title: string;
    description: string;
    completed: boolean;
}

interface MockInterview {
    id: string;
    interviewerName: string;
    interviewerRole: string;
    topic: string;
    scheduledAt: string;
}

interface DashboardStats {
    dsaSolvedCount: number;
    dsaTotalCount: number;
    atsScore: number;
    weeklyReadiness: number;
    upcomingInterviews: MockInterview[];
}

const MainDashboardAnimated: React.FC = () => {
    
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [tasks, setTasks] = useState<DailyTask[]>([]);
    
    // New Log Modal State
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [logActionType, setLogActionType] = useState('CUSTOM_LOG');
    const [logDetails, setLogDetails] = useState('');
    const [isSubmittingLog, setIsSubmittingLog] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
            try {
                const [statsRes, tasksRes] = await Promise.all([
                    fetch('https://placementstudytracker.onrender.com:8080/api/dashboard/stats', { headers }),
                    fetch('https://placementstudytracker.onrender.com:8080/api/tasks/today', { headers })
                ]);
                
                if (statsRes.ok) {
                    setStats(await statsRes.json());
                }
                if (tasksRes.ok) {
                    setTasks(await tasksRes.json());
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchDashboardData();
    }, []);

    const toggleTask = async (taskId: string, currentStatus: boolean) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !currentStatus } : t));
        
        try {
            await fetch(`https://placementstudytracker.onrender.com:8080/api/tasks/${taskId}/toggle`, {
                method: 'PATCH',
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ completed: !currentStatus })
            });
        } catch (err) {
            console.error(err);
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: currentStatus } : t));
        }
    };

    const handleLogSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmittingLog(true);
        try {
            const response = await fetch('https://placementstudytracker.onrender.com:8080/api/activity-logs', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ actionType: logActionType, details: logDetails })
            });
            if (response.ok) {
                toast.success('Activity log added!');
                setIsLogModalOpen(false);
                setLogDetails('');
            } else {
                toast.error('Failed to add log');
            }
        } catch (error) {
            toast.error('Network error');
        } finally {
            setIsSubmittingLog(false);
        }
    };

    return (
        <Layout>
            <div className="h-full">
                <div className="mb-10 flex justify-between items-end">
<div>
<p className="font-label-caps text-label-caps text-secondary-fixed-dim uppercase tracking-wider mb-2">Command Center</p>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Hello, Future Engineer.</h2>
<p className="font-body-lg text-body-lg text-on-surface-variant mt-1">Your readiness matrix is looking solid today.</p>
</div>
<div className="flex items-center gap-2">
<button 
    onClick={() => setIsLogModalOpen(true)}
    className="px-4 py-2 rounded-lg border border-outline-variant text-primary-fixed-dim font-medium hover:bg-surface-variant/30 hover:border-primary-fixed-dim/50 transition-all flex items-center gap-2 btn-shimmer relative overflow-hidden">
<span className="material-symbols-outlined text-[18px]">add</span>
                    New Log
                </button>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

<div className="bg-surface rounded-2xl border border-outline-variant p-6 flex flex-col justify-between hover:border-primary-fixed-dim/30 transition-colors hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(0,220,229,0.2)] transition-transform animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
<div className="flex justify-between items-start mb-4">
<div className="font-body-lg text-body-lg font-medium text-on-surface-variant">DSA Progress</div>
<span className="material-symbols-outlined text-primary-fixed-dim bg-primary-fixed-dim/10 p-1.5 rounded-md">code</span>
</div>
<div className="flex items-center justify-between">
<div>
<div className="font-display text-display text-on-surface">{Math.round((stats?.dsaSolvedCount || 0) / (stats?.dsaTotalCount || 1) * 100)}<span className="text-headline-md text-on-surface-variant">%</span></div>
<div className="font-label-caps text-label-caps text-secondary mt-1">{stats?.dsaSolvedCount || 0}/{stats?.dsaTotalCount || 368} Patterns</div>
</div>
<div className="w-20 h-20 relative">
<svg className="circular-chart w-full h-full transform -rotate-90" viewBox="0 0 36 36">
<path className="circle-bg stroke-surface-variant" fill="none" strokeWidth="2.5" d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"></path>
<path className="circle stroke-primary-container glow-effect" fill="none" strokeWidth="2.5" strokeLinecap="round" d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831" strokeDasharray={`${Math.round((stats?.dsaSolvedCount || 0) / (stats?.dsaTotalCount || 1) * 100)}, 100`}></path>
</svg>
</div>
</div>
</div>

<div className="bg-surface rounded-2xl border border-outline-variant p-6 flex flex-col justify-between hover:border-primary-fixed-dim/30 transition-colors hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(0,220,229,0.2)] transition-transform animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
<div className="flex justify-between items-start mb-4">
<div className="font-body-lg text-body-lg font-medium text-on-surface-variant">Resume ATS Score</div>
<span className="material-symbols-outlined text-primary-fixed-dim bg-primary-fixed-dim/10 p-1.5 rounded-md">document_scanner</span>
</div>
<div>
<div className="flex items-end gap-2 mb-3">
<div className="font-display text-display text-on-surface">{stats?.atsScore || "--"}</div>
<div className="font-stats-numeric text-stats-numeric text-on-surface-variant pb-2">/100</div>
</div>
<div className="w-full bg-surface-container-high rounded-full h-2 mt-2 border border-outline-variant/30 overflow-hidden">
<div className="bg-gradient-to-r from-inverse-primary to-primary-container h-2 rounded-full glow-effect" style={{ width: `${stats?.atsScore || 0}%` }}></div>
</div>
<div className="font-label-caps text-label-caps text-secondary mt-3">High Probability Match</div>
</div>
</div>

<div className="bg-surface rounded-2xl border border-outline-variant p-6 flex flex-col justify-between hover:border-primary-fixed-dim/30 transition-colors hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(0,220,229,0.2)] transition-transform animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
<div className="flex justify-between items-start mb-4">
<div className="font-body-lg text-body-lg font-medium text-on-surface-variant">Weekly Readiness</div>
<span className="material-symbols-outlined text-primary-fixed-dim bg-primary-fixed-dim/10 p-1.5 rounded-md">trending_up</span>
</div>
<div>
<div className="flex items-end gap-2 mb-1">
<div className="font-display text-display text-on-surface">{stats?.weeklyReadiness || "--"}</div>
<div className="font-stats-numeric text-stats-numeric text-on-surface-variant pb-2">%</div>
</div>
<div className="flex items-center gap-2 mt-2">
<span className="text-secondary-fixed-dim flex items-center text-sm font-medium">
<span className="material-symbols-outlined text-[16px] mr-1">arrow_upward</span>
                            +5.2%
                        </span>
<span className="text-on-surface-variant text-sm">vs last week</span>
</div>

<div className="h-8 mt-4 w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-fixed-dim/20 to-transparent rounded-t-lg border-b border-primary-fixed-dim/40 opacity-70"></div>
</div>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

<div className="lg:col-span-2 bg-surface rounded-2xl border border-outline-variant p-6 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(0,220,229,0.2)] transition-transform hover:scale-[1.01] hover:shadow-[0_0_15px_rgba(0,220,229,0.1)] transition-all animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
<div className="flex justify-between items-center mb-6">
<h3 className="font-headline-md text-headline-md font-semibold text-on-surface">Upcoming Interviews</h3>
<button className="text-primary-fixed-dim font-medium hover:text-primary-fixed transition-colors text-sm btn-shimmer relative overflow-hidden px-2 py-1 rounded-md">View Calendar</button>
</div>
<div className="space-y-4">
    {stats?.upcomingInterviews?.length ? stats.upcomingInterviews.map((interview, i) => (
        <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-outline-variant bg-surface-container-low hover:bg-surface-variant/30 transition-colors group cursor-pointer">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center border border-outline-variant group-hover:border-primary-fixed-dim/50 transition-colors">
                    <span className="font-bold text-lg text-on-surface">{interview.interviewerName.charAt(0)}</span>
                </div>
                <div>
                    <h4 className="font-body-lg text-body-lg font-semibold text-on-surface">{interview.interviewerRole}</h4>
                    <p className="text-on-surface-variant text-sm">{interview.interviewerName}</p>
                </div>
            </div>
            <div className="text-right">
                <div className="font-label-caps text-label-caps text-secondary-fixed-dim bg-secondary-fixed-dim/10 px-2 py-1 rounded mb-1 inline-block">{interview.topic}</div>
                <div className="text-on-surface font-medium text-sm flex items-center justify-end gap-1">
                    <span className="material-symbols-outlined text-[16px]">calendar_today</span> {new Date(interview.scheduledAt).toLocaleString([], {month: 'short', day: '2-digit', hour: '2-digit', minute:'2-digit'})}
                </div>
            </div>
        </div>
    )) : (
        <p className="text-on-surface-variant text-sm mt-4 px-2">No upcoming interviews.</p>
    )}
</div>
</div>

<div className="bg-surface rounded-2xl border border-outline-variant p-6 flex flex-col hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(0,220,229,0.2)] transition-transform transition-all animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
<div className="flex justify-between items-center mb-6">
<h3 className="font-headline-md text-headline-md font-semibold text-on-surface">Daily Protocol</h3>
<span className="font-label-caps text-label-caps text-on-surface-variant">{tasks.filter(t => t.completed).length}/{tasks.length} Done</span>
</div>
<div className="flex-1 space-y-3">
    {tasks.map(task => (
        <label key={task.id} className="flex items-start gap-3 p-3 rounded-lg border border-transparent hover:border-outline-variant hover:bg-surface-variant/20 transition-all cursor-pointer group">
            <div className="relative flex items-start mt-0.5">
                <input 
                    className="peer appearance-none w-5 h-5 border-2 border-outline-variant rounded bg-transparent checked:bg-primary-container checked:border-primary-container transition-all" 
                    type="checkbox" 
                    checked={task.completed}
                    onChange={() => toggleTask(task.id, task.completed)}
                />
                <span className="material-symbols-outlined absolute text-[16px] text-on-primary-fixed opacity-0 peer-checked:opacity-100 pointer-events-none top-0.5 left-0.5" style={{ fontVariationSettings: "\"FILL\" 1" }}>check</span>
            </div>
            <div>
                <p className={`font-medium transition-colors ${task.completed ? 'text-on-surface-variant line-through' : 'text-on-surface group-hover:text-primary-fixed-dim'}`}>{task.title}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">{task.description}</p>
            </div>
        </label>
    ))}
</div>
</div>
</div>
            </div>

            {/* New Log Modal */}
            {isLogModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <div className="bg-surface-container rounded-2xl border border-outline-variant p-6 w-full max-w-md shadow-2xl animate-fade-in-up">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-headline-md text-headline-md text-on-surface">Add Activity Log</h3>
                            <button onClick={() => setIsLogModalOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleLogSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-on-surface-variant mb-1">Action Type</label>
                                <select 
                                    className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary-fixed-dim"
                                    value={logActionType}
                                    onChange={(e) => setLogActionType(e.target.value)}
                                >
                                    <option value="CUSTOM_LOG">Custom Log</option>
                                    <option value="PROBLEM_SOLVED">Problem Solved</option>
                                    <option value="MOCK_INTERVIEW_COMPLETED">Mock Interview Completed</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-on-surface-variant mb-1">Details</label>
                                <textarea 
                                    required
                                    rows={3}
                                    className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary-fixed-dim resize-none"
                                    placeholder="What did you accomplish?"
                                    value={logDetails}
                                    onChange={(e) => setLogDetails(e.target.value)}
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setIsLogModalOpen(false)} className="px-4 py-2 text-on-surface-variant font-medium hover:bg-surface-variant rounded-lg transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isSubmittingLog} className="px-4 py-2 bg-primary-container text-on-primary-container rounded-lg font-medium hover:bg-primary-fixed disabled:opacity-50 transition-colors">
                                    {isSubmittingLog ? 'Saving...' : 'Save Log'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default MainDashboardAnimated;
