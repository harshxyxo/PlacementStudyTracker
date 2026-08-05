import React from 'react';
import Layout from '../components/Layout';
import { useState } from 'react';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
export interface ProblemDTO {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  leetcodeLink: string;
  status: string;
}

export interface CategoryStatsDTO {
  category: string;
  totalProblems: number;
  solvedProblems: number;
}

const DSATracker: React.FC = () => {
    const [problems, setProblems] = useState<ProblemDTO[]>([]);
  const [stats, setStats] = useState<CategoryStatsDTO[]>([]);
  const [insight, setInsight] = useState<{category: string, tip: string} | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [categoryFilter, setCategoryFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [difficultyOpen, setDifficultyOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  // Custom Problem Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProblem, setNewProblem] = useState({ title: '', category: 'Arrays & Hashing', difficulty: 'Medium', leetcodeLink: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
          const token = localStorage.getItem('token');
          const response = await fetch('https://placementstudytracker.onrender.com:8080/api/problems/custom', {
              method: 'POST',
              headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({...newProblem, status: 'Unsolved'})
          });
          if (response.ok) {
              setIsAddModalOpen(false);
              setNewProblem({ title: '', category: 'Arrays & Hashing', difficulty: 'Medium', leetcodeLink: '' });
              toast.success('Problem added successfully!');
              fetchProblems();
              fetchStats();
          } else {
              toast.error('Failed to add problem');
          }
      } catch (error) {
          toast.error('Network error');
      } finally {
          setIsSubmitting(false);
      }
  };

  const selectCategory = (cat: string) => {
    setCategoryFilter(cat === 'All' ? '' : cat);
    setCategoryOpen(false);
    setPage(0);
  };

  const selectDifficulty = (diff: string) => {
    setDifficultyFilter(diff === 'All' ? '' : diff);
    setDifficultyOpen(false);
    setPage(0);
  };

  const selectStatus = (status: string) => {
    setStatusFilter(status === 'All' ? '' : status);
    setStatusOpen(false);
    setPage(0);
  };

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({ page: page.toString(), size: '10' });
      if (categoryFilter) params.append('category', categoryFilter);
      if (difficultyFilter) params.append('difficulty', difficultyFilter);
      if (statusFilter) params.append('status', statusFilter);

      const res = await fetch(`https://placementstudytracker.onrender.com:8080/api/problems?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProblems(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://placementstudytracker.onrender.com:8080/api/problems/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchInsight = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://placementstudytracker.onrender.com:8080/api/problems/insights`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.tip) {
          setInsight(data);
        } else {
          setInsight(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProblems();
    fetchStats();
    fetchInsight();
  }, [page, categoryFilter, difficultyFilter, statusFilter]);

  const handleStatusChange = async (id: string, currentStatus: string) => {
    let newStatus = 'Solved';
    if (currentStatus === 'Solved') newStatus = 'Needs Review';
    else if (currentStatus === 'Needs Review') newStatus = 'Unsolved';
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://placementstudytracker.onrender.com:8080/api/problems/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        toast.success(`Problem marked as ${newStatus}`);
        fetchProblems();
        fetchStats();
      } else {
        toast.error('Failed to update problem status');
      }
    } catch (err) {
      toast.error('Network error');
      console.error(err);
    }
  };

  const getDifficultyStyles = (diff: string) => {
    if (diff === 'Easy') return 'bg-primary-fixed-dim/10 text-primary-fixed-dim border-primary-fixed-dim/20';
    if (diff === 'Medium') return 'bg-tertiary-fixed-dim/10 text-tertiary-fixed-dim border-tertiary-fixed-dim/20';
    return 'bg-error/10 text-error border-error/20';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Solved') return <span className="material-symbols-outlined text-[20px] text-primary-fixed-dim" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>;
    if (status === 'Needs Review') return <span className="material-symbols-outlined text-[20px] text-tertiary-fixed-dim" style={{fontVariationSettings: "'FILL' 1"}}>pending</span>;
    return <span className="material-symbols-outlined text-[20px] text-outline-variant">radio_button_unchecked</span>;
  };

  const getActionButtonStyles = (status: string) => {
    if (status === 'Unsolved') return 'text-primary-fixed-dim hover:text-primary-fixed hover:bg-primary-fixed-dim/10 border border-transparent';
    if (status === 'Solved') return 'text-primary-fixed-dim glow-solved border border-transparent hover:bg-primary-fixed-dim/10';
    return 'text-primary-fixed-dim hover:text-primary-fixed hover:bg-primary-fixed-dim/10 border border-transparent';
  };

  const getActionButtonLabel = (status: string) => {
    if (status === 'Unsolved') return 'Solve';
    if (status === 'Solved') return 'Review';
    return 'Retry';
  };

  const totalSolved = stats.reduce((acc, curr) => acc + curr.solvedProblems, 0);
    return (
        <Layout>
          <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background mb-1">DSA Mastery Tracker</h2>
              <p className="text-on-surface-variant font-body-md">Monitor your problem-solving progress across key algorithmic paradigms.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-stats-numeric text-stats-numeric text-primary-fixed-dim">{totalSolved}</span>
              <span className="text-on-surface-variant text-label-caps uppercase tracking-wider">Total Solved</span>
            </div>
          </header>

          {/* Topic Progress Bento Grid */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {stats.slice(0, 3).map((stat, i) => {
              const colors = [
                { text: 'text-primary-fixed-dim', bg: 'from-secondary-fixed-dim to-primary-fixed-dim', icon: 'view_array', shadow: 'hover:shadow-[0_0_20px_rgba(0,220,229,0.15)]' },
                { text: 'text-tertiary-fixed-dim', bg: 'from-tertiary-container to-tertiary-fixed-dim', icon: 'account_tree', shadow: 'hover:shadow-[0_0_20px_rgba(231,196,39,0.15)]' },
                { text: 'text-error', bg: 'from-error-container to-error', icon: 'dynamic_form', shadow: 'hover:shadow-[0_0_20px_rgba(255,180,171,0.15)]' }
              ];
              const c = colors[i % colors.length];
              const pct = stat.totalProblems === 0 ? 0 : Math.round((stat.solvedProblems / stat.totalProblems) * 100);
              
              return (
                <div key={stat.category} className={`bg-surface-container rounded-2xl border border-outline-variant p-6 relative overflow-hidden group hover:border-outline transition-colors hover:scale-[1.02] ${c.shadow} transition-transform`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-surface-variant rounded-lg text-on-surface">
                        <span className="material-symbols-outlined text-[20px]">{c.icon}</span>
                      </div>
                      <h3 className="font-headline-md text-[18px] text-on-surface font-semibold">{stat.category}</h3>
                    </div>
                    <span className={`font-stats-numeric text-body-lg ${c.text} font-bold`}>{pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden mt-4 relative">
                    <div className={`h-full bg-gradient-to-r ${c.bg} rounded-full relative`} style={{ width: `${pct}%` }}>
                      {i === 0 && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary-fixed-dim blur-sm opacity-50 rounded-full"></div>}
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between text-label-caps text-on-surface-variant">
                    <span className="">{stat.solvedProblems} Solved</span>
                    <span className="">{stat.totalProblems} Total</span>
                  </div>
                </div>
              );
            })}
          </section>

          {/* AI Insight Card */}
          {insight && (
            <div className="bg-primary-fixed-dim/10 border border-primary-fixed-dim/30 rounded-xl p-4 mb-8 flex items-start gap-4">
              <div className="p-2 bg-primary-fixed-dim/20 rounded-lg text-primary-fixed-dim shrink-0">
                <span className="material-symbols-outlined">lightbulb</span>
              </div>
              <div>
                <h4 className="text-primary-fixed-dim font-semibold font-headline-md text-[16px] mb-1">
                  AI Insight: Focus on {insight.category}
                </h4>
                <p className="text-on-surface-variant text-body-md">
                  {insight.tip}
                </p>
              </div>
            </div>
          )}

          {/* Table Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-visible pb-2 sm:pb-0 hide-scrollbar">
              
              {/* Category Filter */}
              <div className="relative">
                <button onClick={() => {setCategoryOpen(!categoryOpen); setDifficultyOpen(false); setStatusOpen(false);}} className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-outline-variant rounded-lg text-on-surface text-body-md hover:border-primary-fixed-dim/50 hover:bg-surface-variant transition-colors whitespace-nowrap">
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant">filter_list</span>
                  Category: {categoryFilter || 'All'}
                </button>
                {categoryOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-surface-container-high border border-outline-variant rounded-lg shadow-xl z-50 overflow-hidden">
                    {['All', 'Arrays & Hashing', 'Trees & Graphs', 'Dynamic Programming', 'Sliding Window', 'Binary Search'].map(c => (
                      <button key={c} onClick={() => selectCategory(c)} className="w-full text-left px-4 py-2 text-on-surface hover:bg-surface-variant hover:text-primary-fixed transition-colors">
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Difficulty Filter */}
              <div className="relative">
                <button onClick={() => {setDifficultyOpen(!difficultyOpen); setCategoryOpen(false); setStatusOpen(false);}} className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-outline-variant rounded-lg text-on-surface text-body-md hover:border-primary-fixed-dim/50 hover:bg-surface-variant transition-colors whitespace-nowrap">
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant">signal_cellular_alt</span>
                  Difficulty{difficultyFilter ? `: ${difficultyFilter}` : ''}
                </button>
                {difficultyOpen && (
                  <div className="absolute top-full left-0 mt-1 w-32 bg-surface-container-high border border-outline-variant rounded-lg shadow-xl z-50 overflow-hidden">
                    {['All', 'Easy', 'Medium', 'Hard'].map(d => (
                      <button key={d} onClick={() => selectDifficulty(d)} className="w-full text-left px-4 py-2 text-on-surface hover:bg-surface-variant hover:text-primary-fixed transition-colors">
                        {d}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Filter */}
              <div className="relative">
                <button onClick={() => {setStatusOpen(!statusOpen); setCategoryOpen(false); setDifficultyOpen(false);}} className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-outline-variant rounded-lg text-on-surface text-body-md hover:border-primary-fixed-dim/50 hover:bg-surface-variant transition-colors whitespace-nowrap">
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant">task_alt</span>
                  Status{statusFilter ? `: ${statusFilter}` : ''}
                </button>
                {statusOpen && (
                  <div className="absolute top-full left-0 mt-1 w-40 bg-surface-container-high border border-outline-variant rounded-lg shadow-xl z-50 overflow-hidden">
                    {['All', 'Solved', 'Unsolved', 'Needs Review'].map(s => (
                      <button key={s} onClick={() => selectStatus(s)} className="w-full text-left px-4 py-2 text-on-surface hover:bg-surface-variant hover:text-primary-fixed transition-colors">
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>
            <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-4 py-1.5 bg-transparent border border-outline-variant rounded-lg text-primary-fixed-dim text-body-md font-medium hover:border-primary-fixed-dim hover:bg-primary-fixed-dim/5 transition-colors w-full sm:w-auto justify-center">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Custom Problem
            </button>
          </div>

          {/* Notion-like Table Container */}
          <div className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden w-full overflow-x-auto shadow-sm">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-surface-container-highest/30 border-b border-outline-variant/60">
                  <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant uppercase w-10 text-center">Status</th>
                  <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant uppercase">Problem Title</th>
                  <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant uppercase w-32">Difficulty</th>
                  <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant uppercase w-48">Topic</th>
                  <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant uppercase w-24 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-body-md font-body-md text-on-surface divide-y divide-outline-variant/30">
                {loading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-3 px-4"><div className="w-6 h-6 bg-surface-variant rounded-full mx-auto"></div></td>
                      <td className="py-3 px-4"><div className="h-4 bg-surface-variant rounded w-3/4"></div></td>
                      <td className="py-3 px-4"><div className="h-4 bg-surface-variant rounded w-16"></div></td>
                      <td className="py-3 px-4"><div className="h-4 bg-surface-variant rounded w-24"></div></td>
                      <td className="py-3 px-4"><div className="h-4 bg-surface-variant rounded w-12 ml-auto"></div></td>
                    </tr>
                  ))
                ) : problems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-on-surface-variant">No problems found</td>
                  </tr>
                ) : problems.map(p => (
                  <tr key={p.id} className="hover:bg-surface-container/50 transition-colors group cursor-default hover:bg-surface-variant/20 hover:scale-[1.005] transition-all duration-200">
                    <td className="py-3 px-4 text-center">
                      {getStatusIcon(p.status)}
                    </td>
                    <td className="py-3 px-4 font-medium text-inverse-surface group-hover:text-primary-fixed transition-colors">
                      <a href={p.leetcodeLink} target="_blank" rel="noopener noreferrer">{p.title}</a>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-label-caps font-semibold uppercase tracking-wider border ${getDifficultyStyles(p.difficulty)}`}>{p.difficulty}</span>
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant">{p.category}</td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => handleStatusChange(p.id, p.status)} className={`px-3 py-1 rounded transition-colors text-[13px] font-medium ${getActionButtonStyles(p.status)}`}>
                        {getActionButtonLabel(p.status)}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Table Footer / Pagination */}
            <div className="px-4 py-3 border-t border-outline-variant/30 flex justify-between items-center text-on-surface-variant text-[13px]">
              <span className="">Showing {page * 10 + (totalElements > 0 ? 1 : 0)}-{Math.min((page + 1) * 10, totalElements)} of {totalElements} problems</span>
              <div className="flex gap-1">
                <button disabled={page === 0} onClick={() => setPage(page - 1)} className="p-1 rounded hover:bg-surface-variant hover:text-on-surface transition-colors disabled:opacity-50"><span className="material-symbols-outlined text-[18px]">chevron_left</span></button>
                <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)} className="p-1 rounded hover:bg-surface-variant hover:text-on-surface transition-colors disabled:opacity-50"><span className="material-symbols-outlined text-[18px]">chevron_right</span></button>
              </div>
            </div>
          </div>

          {/* Add Problem Modal */}
          {isAddModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                  <div className="bg-surface-container rounded-2xl border border-outline-variant p-6 w-full max-w-md shadow-2xl animate-fade-in-up">
                      <div className="flex justify-between items-center mb-6">
                          <h3 className="font-headline-md text-headline-md text-on-surface">Add Custom Problem</h3>
                          <button onClick={() => setIsAddModalOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                              <span className="material-symbols-outlined">close</span>
                          </button>
                      </div>
                      <form onSubmit={handleAddSubmit} className="flex flex-col gap-4">
                          <div>
                              <label className="block text-sm font-medium text-on-surface-variant mb-1">Problem Title</label>
                              <input required type="text" className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary-fixed-dim" placeholder="e.g. Two Sum" value={newProblem.title} onChange={e => setNewProblem({...newProblem, title: e.target.value})} />
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-on-surface-variant mb-1">LeetCode Link</label>
                              <input required type="url" className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary-fixed-dim" placeholder="https://leetcode.com/problems/..." value={newProblem.leetcodeLink} onChange={e => setNewProblem({...newProblem, leetcodeLink: e.target.value})} />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="block text-sm font-medium text-on-surface-variant mb-1">Category</label>
                                  <select className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary-fixed-dim" value={newProblem.category} onChange={e => setNewProblem({...newProblem, category: e.target.value})}>
                                      <option>Arrays & Hashing</option>
                                      <option>Trees & Graphs</option>
                                      <option>Dynamic Programming</option>
                                      <option>Sliding Window</option>
                                      <option>Binary Search</option>
                                  </select>
                              </div>
                              <div>
                                  <label className="block text-sm font-medium text-on-surface-variant mb-1">Difficulty</label>
                                  <select className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary-fixed-dim" value={newProblem.difficulty} onChange={e => setNewProblem({...newProblem, difficulty: e.target.value})}>
                                      <option>Easy</option>
                                      <option>Medium</option>
                                      <option>Hard</option>
                                  </select>
                              </div>
                          </div>
                          <div className="flex justify-end gap-3 mt-4">
                              <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-on-surface-variant font-medium hover:bg-surface-variant rounded-lg transition-colors">
                                  Cancel
                              </button>
                              <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary-container text-on-primary-container rounded-lg font-medium hover:bg-primary-fixed disabled:opacity-50 transition-colors">
                                  {isSubmitting ? 'Adding...' : 'Add Problem'}
                              </button>
                          </div>
                      </form>
                  </div>
              </div>
          )}
        </Layout>
    );
};

export default DSATracker;
