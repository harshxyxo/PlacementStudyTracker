import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import API_BASE_URL from '../config';

interface CategoryStats {
    category: string;
    total: number;
    solved: number;
}

const DetailedAnalytics: React.FC = () => {
    const [stats, setStats] = useState<CategoryStats[]>([]);
    const [totalSolved, setTotalSolved] = useState(0);
    const [filter, setFilter] = useState('Last 7 Days');
    
    const [heatmapData, setHeatmapData] = useState<Record<string, number>>({});
    const [activities, setActivities] = useState<any[]>([]);

    useEffect(() => {
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
        fetch(`${API_BASE_URL}:8080/api/problems/stats?userId=testUser123`, { headers })
            .then(res => res.json())
            .then((data: CategoryStats[]) => {
                setStats(data);
                const sum = data.reduce((acc, curr) => acc + curr.solved, 0);
                setTotalSolved(sum);
            })
            .catch(err => console.error("Failed to fetch stats", err));
            
        fetch(`${API_BASE_URL}:8080/api/analytics/heatmap`, { headers })
            .then(res => res.json())
            .then(data => setHeatmapData(data))
            .catch(err => console.error(err));
            
        fetch(`${API_BASE_URL}:8080/api/analytics/activities`, { headers })
            .then(res => res.json())
            .then(data => setActivities(data))
            .catch(err => console.error(err));
    }, []);

    // Helper for rendering heatmap cells (dummy data since backend doesn't have timestamps yet)
    const renderHeatmap = () => {
        const weeks = 52;
        const days = 7;
        const columns = [];
        
        // Let's start from 52 weeks ago
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - (weeks * days));
        
        for(let w = 0; w < weeks; w++) {
            const cells = [];
            for(let d = 0; d < days; d++) {
                const current = new Date(startDate);
                current.setDate(current.getDate() + (w * days + d));
                const dateString = current.toISOString().split('T')[0];
                const count = heatmapData[dateString] || 0;
                
                let heatClass = 'bg-surface-container-high'; // 0
                if (count >= 4) heatClass = 'bg-primary-fixed';
                else if (count === 3) heatClass = 'bg-[#00dce5]';
                else if (count === 2) heatClass = 'bg-[#006c71]';
                else if (count === 1) heatClass = 'bg-[#004f53]';
                
                cells.push(
                    <div 
                        key={`${w}-${d}`}
                        className={`w-[14px] h-[14px] rounded-[2px] ${heatClass} hover:ring-1 hover:ring-primary-fixed cursor-pointer transition-all`}
                        title={`${count} activities on ${dateString}`}
                    />
                );
            }
            columns.push(
                <div key={w} className="flex flex-col gap-1">
                    {cells}
                </div>
            );
        }
        return columns;
    };

    return (
        <Layout>
            <div className="h-full">
                {/* Header */}
                <div className="flex flex-wrap justify-between items-end gap-3 mb-8">
                    <div className="flex min-w-72 flex-col gap-1">
                        <p className="text-on-surface text-headline-lg m-0">Analytics</p>
                        <p className="text-on-surface-variant text-body-md m-0">Track your placement preparation progress and identify weak areas.</p>
                    </div>
                    <div className="flex gap-3">
                        <select 
                            className="bg-surface-container border border-outline-variant text-on-surface text-sm rounded-lg focus:ring-primary-fixed focus:border-primary-fixed block w-full p-2.5"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                            <option>This Year</option>
                            <option>All Time</option>
                        </select>
                    </div>
                </div>

                {/* Weekly Progress Chart */}
                <div className="w-full bg-surface-container rounded-xl border border-outline-variant p-6 mb-gutter">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-headline-md text-on-surface">Weekly Progress</h2>
                            <p className="text-body-md text-on-surface-variant">Problems solved over time</p>
                        </div>
                        <div className="text-right">
                            <p className="text-display text-primary-fixed-dim leading-none">{totalSolved}</p>
                            <p className="text-body-md text-on-surface-variant">Total Solved</p>
                        </div>
                    </div>
                    <div className="relative h-64 w-full flex items-end">
                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 200">
                            {/* Grid lines */}
                            <line className="text-outline-variant opacity-50" stroke="currentColor" strokeWidth="1" x1="0" x2="1000" y1="200" y2="200" />
                            <line className="text-outline-variant opacity-30" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="1000" y1="150" y2="150" />
                            <line className="text-outline-variant opacity-30" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="1000" y1="100" y2="100" />
                            <line className="text-outline-variant opacity-30" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="1000" y1="50" y2="50" />
                            
                            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#00dce5" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#00dce5" stopOpacity="0" />
                            </linearGradient>
                            
                            <path d="M0 150 L142 120 L285 140 L428 80 L571 110 L714 60 L857 90 L1000 40 L1000 200 L0 200 Z" fill="url(#chartGradient)" />
                            
                            <path d="M0 150 L142 120 L285 140 L428 80 L571 110 L714 60 L857 90 L1000 40" fill="none" stroke="#00dce5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                            
                            <circle cx="0" cy="150" fill="#10131a" r="4" stroke="#00dce5" strokeWidth="2" />
                            <circle cx="142" cy="120" fill="#10131a" r="4" stroke="#00dce5" strokeWidth="2" />
                            <circle cx="285" cy="140" fill="#10131a" r="4" stroke="#00dce5" strokeWidth="2" />
                            <circle cx="428" cy="80" fill="#10131a" r="4" stroke="#00dce5" strokeWidth="2" />
                            <circle cx="571" cy="110" fill="#10131a" r="4" stroke="#00dce5" strokeWidth="2" />
                            <circle cx="714" cy="60" fill="#10131a" r="4" stroke="#00dce5" strokeWidth="2" />
                            <circle cx="857" cy="90" fill="#10131a" r="4" stroke="#00dce5" strokeWidth="2" />
                            <circle cx="1000" cy="40" fill="#00dce5" r="6" />
                        </svg>
                        {/* X-axis labels */}
                        <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-label-caps text-on-surface-variant">
                            <span>Mon</span>
                            <span>Tue</span>
                            <span>Wed</span>
                            <span>Thu</span>
                            <span>Fri</span>
                            <span>Sat</span>
                            <span>Sun</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter mb-gutter">
                    {/* Topic Strength Radar Chart */}
                    <div className="bg-surface-container rounded-xl border border-outline-variant p-6 flex flex-col items-center">
                        <div className="w-full mb-4">
                            <h2 className="text-headline-md text-on-surface">Topic Strength</h2>
                            <p className="text-body-md text-on-surface-variant">Proficiency across domains</p>
                        </div>
                        <div className="w-full mt-4 flex flex-col gap-3">
                            {stats.length > 0 ? (
                                stats.map((stat, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-sm">
                                        <span className="text-on-surface-variant">{stat.category}</span>
                                        <span className="text-primary-fixed">{stat.solved} / {stat.total}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-on-surface-variant">No data available.</p>
                            )}
                        </div>
                    </div>

                    {/* Recent Activity Log */}
                    <div className="bg-surface-container rounded-xl border border-outline-variant p-6 flex flex-col">
                        <h2 className="text-headline-md text-on-surface mb-2">Recent Activity</h2>
                        <p className="text-body-md text-on-surface-variant mb-6">Your latest actions</p>
                        <div className="flex flex-col gap-4 flex-1 max-h-[300px] overflow-y-auto pr-2">
                            {activities.length === 0 ? (
                                <p className="text-on-surface-variant text-sm">No activity recorded yet.</p>
                            ) : activities.slice(0, 10).map((activity, idx) => (
                                <div key={idx} className="flex items-center gap-4 bg-surface-container-high p-4 rounded-lg border border-outline-variant">
                                    <div className="bg-primary-container p-3 rounded-full flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-on-primary-container">
                                            {activity.actionType === 'PROBLEM_SOLVED' ? 'code' : 
                                             activity.actionType === 'RESUME_ANALYZED' ? 'description' : 
                                             activity.actionType === 'MOCK_SCHEDULED' ? 'calendar_month' : 'check_circle'}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-on-surface font-medium">{activity.details}</p>
                                        <p className="text-on-surface-variant text-xs">{new Date(activity.timestamp).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Activity Heatmap */}
                <div className="w-full bg-surface-container rounded-xl border border-outline-variant p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-headline-md text-on-surface">Activity Map</h2>
                            <p className="text-body-md text-on-surface-variant">Daily problem solving activity</p>
                        </div>
                        <div className="flex items-center gap-2 text-label-caps text-on-surface-variant">
                            <span>Less</span>
                            <div className="w-[14px] h-[14px] rounded-[2px] bg-surface-container-high" />
                            <div className="w-[14px] h-[14px] rounded-[2px] bg-[#004f53]" />
                            <div className="w-[14px] h-[14px] rounded-[2px] bg-[#006c71]" />
                            <div className="w-[14px] h-[14px] rounded-[2px] bg-[#00dce5]" />
                            <div className="w-[14px] h-[14px] rounded-[2px] bg-primary-fixed" />
                            <span>More</span>
                        </div>
                    </div>
                    <div className="overflow-x-auto pb-4">
                        <div className="inline-flex gap-1">
                            {renderHeatmap()}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default DetailedAnalytics;
