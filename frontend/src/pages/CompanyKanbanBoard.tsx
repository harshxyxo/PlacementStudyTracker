import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Layout from '../components/Layout';

interface CompanyApplication {
    id: string;
    company: string;
    role: string;
    location: string;
    salary: string;
    appliedDate: string;
    matchScore: number;
    status: string;
    prepTopics?: string[];
}

const CompanyKanbanBoard: React.FC = () => {
    const [applications, setApplications] = useState<CompanyApplication[]>([]);
    
    // Add Company Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newCompany, setNewCompany] = useState({ company: '', role: '', location: '', salary: '', status: 'Applied' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    useEffect(() => {
        const fetchApps = async () => {
            const res = await fetch('https://placementstudytracker.onrender.com:8080/api/companies', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
            if (res.ok) setApplications(await res.json());
        };
        fetchApps();
    }, []);

    const applied = applications.filter(a => a.status === 'Applied');
    const interviewing = applications.filter(a => a.status === 'OA/Interview');
    const offers = applications.filter(a => a.status === 'Offer');
    const rejected = applications.filter(a => a.status === 'Rejected');

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://placementstudytracker.onrender.com:8080/api/companies', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newCompany, appliedDate: new Date().toISOString() })
            });
            if (response.ok) {
                const addedApp = await response.json();
                setApplications([...applications, addedApp]);
                setIsAddModalOpen(false);
                setNewCompany({ company: '', role: '', location: '', salary: '', status: 'Applied' });
                toast.success('Company added successfully');
            } else {
                toast.error('Failed to add company');
            }
        } catch (error) {
            toast.error('Network error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <div className="h-full flex flex-col">
                <div className="flex justify-between items-end mb-6 shrink-0">
                    <div>
                        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-1">Company Tracker</h1>
                        <p className="font-body-md text-body-md text-on-surface-variant">Manage your applications and interview pipeline.</p>
                    </div>
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-surface-variant hover:bg-surface-bright text-on-surface px-4 py-2 rounded-lg font-body-md text-body-md font-medium border border-outline-variant flex items-center gap-2 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Add Company
                    </button>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto pb-4">
                    
                    {/* Applied Column */}
                    <div className="flex flex-col bg-surface/30 rounded-xl p-3 border border-outline-variant/30 min-w-[280px]">
                        <div className="flex justify-between items-center mb-4 px-1 shrink-0">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-outline"></span>
                                <h3 className="font-body-md text-body-md font-semibold text-on-surface">Applied</h3>
                            </div>
                            <span className="font-label-caps text-label-caps bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded-full">{applied.length}</span>
                        </div>
                        <div className="flex-1 flex flex-col gap-3 overflow-y-auto kanban-col pr-1">
                            {applied.length === 0 ? <p className="text-on-surface-variant text-sm px-2">No applications yet.</p> : applied.map(app => (
                            <div key={app.id} className="bg-surface-container-low border border-outline-variant rounded-xl p-4 cursor-pointer hover:border-outline transition-colors group hover:scale-[1.02] hover:-translate-y-1 hover:border-primary-fixed-dim/50 hover:shadow-[0_0_15px_rgba(0,220,229,0.15)] transition-all duration-300">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[20px] text-primary-fixed-dim">business</span>
                                    </div>
                                    <button className="text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                                    </button>
                                </div>
                                <h4 className="font-body-lg text-body-lg font-semibold text-on-surface mb-1">{app.company}</h4>
                                <p className="font-body-md text-body-md text-on-surface-variant mb-4">{app.role}</p>
                                <div className="flex justify-between items-center">
                                    <span className="font-label-caps text-label-caps bg-surface-variant/50 text-on-surface px-2 py-1 rounded">{app.salary || "N/A"}</span>
                                    <span className="font-body-md text-body-md text-on-surface-variant text-[12px]">{new Date(app.appliedDate || Date.now()).toLocaleDateString()}</span>
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>

                    {/* Interviewing Column */}
                    <div className="flex flex-col bg-surface/30 rounded-xl p-3 border border-outline-variant/30 min-w-[280px]">
                        <div className="flex justify-between items-center mb-4 px-1 shrink-0">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary-fixed-dim shadow-[0_0_8px_rgba(0,220,229,0.5)]"></span>
                                <h3 className="font-body-md text-body-md font-semibold text-on-surface">Interviewing</h3>
                            </div>
                            <span className="font-label-caps text-label-caps bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded-full">{interviewing.length}</span>
                        </div>
                        <div className="flex-1 flex flex-col gap-3 overflow-y-auto kanban-col pr-1">
                            {interviewing.length === 0 ? <p className="text-on-surface-variant text-sm px-2">No applications yet.</p> : interviewing.map(app => (
                            <div key={app.id} className="bg-surface-container-low border border-primary-fixed-dim/50 rounded-xl p-4 cursor-pointer relative overflow-hidden group shadow-[0_4px_24px_rgba(0,220,229,0.05)] hover:scale-[1.02] hover:-translate-y-1 hover:border-primary-fixed-dim/50 hover:shadow-[0_0_15px_rgba(0,220,229,0.15)] transition-all duration-300">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-fixed-dim to-secondary-fixed"></div>
                                <div className="flex justify-between items-start mb-3 mt-1">
                                    <div className="w-10 h-10 rounded-lg bg-black p-1 flex items-center justify-center shrink-0 border border-outline-variant">
                                        <span className="material-symbols-outlined text-[20px] text-primary-fixed-dim">business</span>
                                    </div>
                                    <button className="text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                                    </button>
                                </div>
                                <h4 className="font-body-lg text-body-lg font-semibold text-on-surface mb-1">{app.company}</h4>
                                <p className="font-body-md text-body-md text-on-surface-variant mb-4">{app.role}</p>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-label-caps text-label-caps bg-primary-fixed-dim/10 text-primary-fixed-dim px-2 py-1 rounded border border-primary-fixed-dim/20">High Priority</span>
                                    <span className="font-body-md text-body-md text-on-surface-variant text-[12px]">{new Date(app.appliedDate || Date.now()).toLocaleDateString()}</span>
                                </div>
                                {app.prepTopics && app.prepTopics.length > 0 && (
                                    <div className="pt-3 border-t border-outline-variant/30 mt-1">
                                        <div className="flex items-center gap-1.5 mb-2 text-on-surface-variant">
                                            <span className="material-symbols-outlined text-[14px]">psychology</span>
                                            <span className="text-[11px] font-medium uppercase tracking-wider">AI Prep Topics</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {app.prepTopics.map((topic, i) => (
                                                <span key={i} className="font-label-caps text-[10px] bg-primary-fixed-dim/10 text-primary-fixed-dim px-2 py-1 rounded-md border border-primary-fixed-dim/30">
                                                    {topic}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            ))}
                        </div>
                    </div>

                    {/* Offers Column */}
                    <div className="flex flex-col bg-surface/30 rounded-xl p-3 border border-outline-variant/30 min-w-[280px]">
                        <div className="flex justify-between items-center mb-4 px-1 shrink-0">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                                <h3 className="font-body-md text-body-md font-semibold text-on-surface">Offers</h3>
                            </div>
                            <span className="font-label-caps text-label-caps bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded-full">{offers.length}</span>
                        </div>
                        <div className="flex-1 flex flex-col gap-3 overflow-y-auto kanban-col pr-1">
                            {offers.length === 0 ? <p className="text-on-surface-variant text-sm px-2">No applications yet.</p> : offers.map(app => (
                            <div key={app.id} className="bg-surface-container-low border border-outline-variant rounded-xl p-4 cursor-pointer hover:border-outline transition-colors group hover:scale-[1.02] hover:-translate-y-1 hover:border-primary-fixed-dim/50 hover:shadow-[0_0_15px_rgba(0,220,229,0.15)] transition-all duration-300">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-[#0052cc] p-1 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[20px] text-white">business</span>
                                    </div>
                                    <button className="text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                                    </button>
                                </div>
                                <h4 className="font-body-lg text-body-lg font-semibold text-on-surface mb-1">{app.company}</h4>
                                <p className="font-body-md text-body-md text-on-surface-variant mb-4">{app.role}</p>
                                <div className="flex justify-between items-center">
                                    <span className="font-label-caps text-label-caps bg-secondary/10 text-secondary px-2 py-1 rounded border border-secondary/20">Accepted</span>
                                    <span className="font-body-md text-body-md text-on-surface-variant text-[12px]">{new Date(app.appliedDate || Date.now()).toLocaleDateString()}</span>
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>

                    {/* Rejected Column */}
                    <div className="flex flex-col bg-surface/30 rounded-xl p-3 border border-outline-variant/30 min-w-[280px]">
                        <div className="flex justify-between items-center mb-4 px-1 shrink-0">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-error"></span>
                                <h3 className="font-body-md text-body-md font-semibold text-on-surface">Rejected</h3>
                            </div>
                            <span className="font-label-caps text-label-caps bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded-full">{rejected.length}</span>
                        </div>
                        <div className="flex-1 flex flex-col gap-3 overflow-y-auto kanban-col pr-1">
                            {rejected.length === 0 ? <p className="text-on-surface-variant text-sm px-2">No applications yet.</p> : rejected.map(app => (
                            <div key={app.id} className="bg-surface-container-low border border-outline-variant/50 rounded-xl p-4 cursor-pointer opacity-70 hover:opacity-100 transition-opacity group hover:scale-[1.02] hover:-translate-y-1 hover:border-primary-fixed-dim/50 hover:shadow-[0_0_15px_rgba(0,220,229,0.15)] transition-all duration-300">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 grayscale">
                                        <span className="material-symbols-outlined text-[20px] text-gray-800">business</span>
                                    </div>
                                    <button className="text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                                    </button>
                                </div>
                                <h4 className="font-body-lg text-body-lg font-semibold text-on-surface mb-1">{app.company}</h4>
                                <p className="font-body-md text-body-md text-on-surface-variant mb-4">{app.role}</p>
                                <div className="flex justify-between items-center">
                                    <span className="font-label-caps text-label-caps bg-surface-variant/50 text-on-surface-variant px-2 py-1 rounded">Archived</span>
                                    <span className="font-body-md text-body-md text-on-surface-variant text-[12px]">{new Date(app.appliedDate || Date.now()).toLocaleDateString()}</span>
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* Add Company Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <div className="bg-surface-container rounded-2xl border border-outline-variant p-6 w-full max-w-md shadow-2xl animate-fade-in-up">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-headline-md text-headline-md text-on-surface">Add New Application</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleAddSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-on-surface-variant mb-1">Company Name</label>
                                <input required type="text" className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary-fixed-dim" placeholder="e.g. Google" value={newCompany.company} onChange={e => setNewCompany({...newCompany, company: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-on-surface-variant mb-1">Role</label>
                                <input required type="text" className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary-fixed-dim" placeholder="e.g. Software Engineer" value={newCompany.role} onChange={e => setNewCompany({...newCompany, role: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-on-surface-variant mb-1">Location</label>
                                    <input type="text" className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary-fixed-dim" placeholder="e.g. Remote" value={newCompany.location} onChange={e => setNewCompany({...newCompany, location: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-on-surface-variant mb-1">Salary</label>
                                    <input type="text" className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary-fixed-dim" placeholder="e.g. $150k" value={newCompany.salary} onChange={e => setNewCompany({...newCompany, salary: e.target.value})} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-on-surface-variant mb-1">Initial Status</label>
                                <select className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary-fixed-dim" value={newCompany.status} onChange={e => setNewCompany({...newCompany, status: e.target.value})}>
                                    <option value="Applied">Applied</option>
                                    <option value="OA/Interview">Interviewing</option>
                                    <option value="Offer">Offer</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-on-surface-variant font-medium hover:bg-surface-variant rounded-lg transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary-container text-on-primary-container rounded-lg font-medium hover:bg-primary-fixed disabled:opacity-50 transition-colors">
                                    {isSubmitting ? 'Adding...' : 'Add Application'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default CompanyKanbanBoard;
