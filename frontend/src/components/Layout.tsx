import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { auth } from '../firebase';
import API_BASE_URL from '../config';

interface LayoutProps {
    children: React.ReactNode;
}

interface SearchResult {
    id: string;
    type: string;
    title: string;
    subtitle: string;
    url: string;
}

interface Notification {
    id: string;
    message: string;
    type: string;
    read: boolean;
    timestamp: string;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();
    const [user, setUser] = useState<FirebaseUser | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return unsubscribe;
    }, []);
    const navigate = useNavigate();
    
    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    
    // Notifications State
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);
    
    // Help State
    const [showHelp, setShowHelp] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}:8080/api/notifications`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    setNotifications(await response.json());
                }
            } catch (err) {
                console.error("Failed to fetch notifications", err);
            }
        };
        fetchNotifications();
    }, []);

    const markNotificationAsRead = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_BASE_URL}:8080/api/notifications/${id}/read`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setIsSearching(true);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}:8080/api/search?q=${encodeURIComponent(searchQuery)}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setSearchResults(data);
                    setShowDropdown(true);
                }
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleSearchSelect = (url: string) => {
        setShowDropdown(false);
        setSearchQuery('');
        navigate(url);
    };

    const getLinkClass = (path: string) => {
        const isActive = location.pathname.startsWith(path);
        if (isActive) {
            return "flex items-center gap-3 px-4 py-2.5 rounded-lg text-secondary-fixed-dim font-bold bg-surface-variant/50 border-l-2 border-secondary-fixed-dim scale-95 active:scale-90 transition-transform transition-colors group";
        }
        return "flex items-center gap-3 px-4 py-2.5 rounded-lg text-on-surface-variant font-medium hover:bg-surface-variant/30 hover:text-primary-fixed-dim transition-colors scale-95 active:scale-90 transition-transform group";
    };

    return (
        <div className="font-body-md text-body-md antialiased flex min-h-screen w-full bg-background selection:bg-primary-fixed-dim/30 selection:text-primary">
            
            <header className="fixed top-0 right-0 w-[calc(100%-240px)] z-50 bg-surface-container-lowest/80 dark:bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant flex justify-between items-center px-margin-desktop h-16">
                <div ref={searchRef} className="relative flex items-center w-[280px]">
                    <div className="flex items-center w-full bg-surface-variant/30 rounded-full border border-outline-variant px-4 py-2 focus-within:ring-2 focus-within:ring-primary-fixed-dim/20 transition-all">
                        <span className="material-symbols-outlined text-on-surface-variant mr-2 text-[20px]">search</span>
                        <input 
                            className="w-full bg-transparent border-none focus:ring-0 text-body-md text-on-surface placeholder-on-surface-variant outline-none" 
                            placeholder="Search resources, goals..." 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => { if(searchResults.length > 0) setShowDropdown(true); }}
                        />
                        {isSearching && (
                            <span className="material-symbols-outlined text-on-surface-variant animate-spin text-[16px] ml-2">refresh</span>
                        )}
                    </div>

                    {showDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container border border-outline-variant rounded-xl shadow-lg overflow-hidden max-h-[300px] overflow-y-auto z-50">
                            {searchResults.length === 0 ? (
                                <div className="p-4 text-center text-on-surface-variant">No results found</div>
                            ) : (
                                <ul className="flex flex-col">
                                    {searchResults.map((result) => (
                                        <li key={result.id}>
                                            <button 
                                                onClick={() => handleSearchSelect(result.url)}
                                                className="w-full text-left px-4 py-3 hover:bg-surface-variant/50 transition-colors flex flex-col border-b border-outline-variant/30 last:border-0"
                                            >
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-semibold text-on-surface truncate">{result.title}</span>
                                                    <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container">
                                                        {result.type}
                                                    </span>
                                                </div>
                                                <span className="text-sm text-on-surface-variant truncate">{result.subtitle}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <div ref={notifRef} className="relative">
                        <button 
                            onClick={() => setShowNotifications(!showNotifications)}
                            aria-label="notifications" 
                            className="p-2 text-on-surface-variant hover:text-primary-fixed hover:bg-surface-variant rounded-lg transition-all relative">
                            <span className="material-symbols-outlined text-[20px]">notifications</span>
                            {notifications.some(n => !n.read) && (
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full shadow-[0_0_5px_rgba(255,84,73,0.5)]"></span>
                            )}
                        </button>
                        
                        {showNotifications && (
                            <div className="absolute top-full right-0 mt-2 w-80 bg-surface-container border border-outline-variant rounded-xl shadow-lg overflow-hidden max-h-[400px] overflow-y-auto z-50">
                                <div className="p-3 border-b border-outline-variant/30 font-semibold text-on-surface flex justify-between items-center">
                                    <span>Notifications</span>
                                </div>
                                {notifications.length === 0 ? (
                                    <div className="p-4 text-center text-sm text-on-surface-variant">No new notifications</div>
                                ) : (
                                    <ul className="flex flex-col">
                                        {notifications.map((notif) => (
                                            <li key={notif.id} 
                                                className={`px-4 py-3 border-b border-outline-variant/30 last:border-0 hover:bg-surface-variant/30 cursor-pointer transition-colors ${!notif.read ? 'bg-primary-fixed-dim/5' : ''}`}
                                                onClick={() => {
                                                    if(!notif.read) markNotificationAsRead(notif.id);
                                                }}
                                            >
                                                <p className={`text-sm ${!notif.read ? 'text-on-surface font-medium' : 'text-on-surface-variant'}`}>{notif.message}</p>
                                                <span className="text-xs text-on-surface-variant opacity-70 mt-1 block">{new Date(notif.timestamp).toLocaleString()}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                    <button 
                        onClick={() => setShowHelp(true)}
                        aria-label="help" 
                        className="p-2 text-on-surface-variant hover:text-primary-fixed hover:bg-surface-variant rounded-lg transition-all">
                        <span className="material-symbols-outlined text-[20px]">help</span>
                    </button>
                    <div className="h-8 w-8 ml-2 rounded-full bg-surface-container border border-outline-variant overflow-hidden cursor-pointer flex items-center justify-center">
                        {user?.photoURL ? (
                            <img className="object-cover w-full h-full opacity-80 hover:opacity-100 transition-opacity" data-alt="User Icon" src={user.photoURL} alt="User" />
                        ) : (() => {
                            let initial = '';
                            if (user?.displayName) initial = user.displayName;
                            else if (user?.email) initial = user.email;
                            else {
                                try {
                                    const token = localStorage.getItem('token');
                                    if (token) {
                                        const payload = JSON.parse(atob(token.split('.')[1]));
                                        if (payload.sub) initial = payload.sub;
                                    }
                                } catch (e) {}
                            }
                            
                            if (initial) {
                                return (
                                    <div className="w-full h-full bg-primary-fixed-dim text-on-primary-fixed flex items-center justify-center font-bold text-sm">
                                        {initial.charAt(0).toUpperCase()}
                                    </div>
                                );
                            }
                            
                            return <span className="material-symbols-outlined text-on-surface-variant text-[20px]">person</span>;
                        })()}
                    </div>
                </div>
            </header>
            
            <aside className="w-[240px] h-screen fixed left-0 top-0 bg-surface-container-low dark:bg-surface-container-low border-r border-outline-variant flex flex-col py-gutter px-stack-gap z-40">
                <div className="mb-8 px-4 mt-2">
                    <h1 className="font-headline-md text-headline-md text-primary-fixed-dim tracking-tight">Placement &amp; Study Tracker</h1>
                </div>
                <nav className="flex-1 flex flex-col gap-1">
                    <Link className={getLinkClass('/dashboard')} to="/dashboard">
                        <span className="material-symbols-outlined text-[20px] transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-translate-y-0.5">grid_view</span>
                        Dashboard
                    </Link>
                    <Link className={getLinkClass('/dsa-tracker')} to="/dsa-tracker">
                        <span className="material-symbols-outlined text-[20px] transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-translate-y-0.5">terminal</span>
                        DSA Tracker
                    </Link>
                    <Link className={getLinkClass('/resume')} to="/resume">
                        <span className="material-symbols-outlined text-[20px] transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-translate-y-0.5">article</span>
                        Resume
                    </Link>
                    <Link className={getLinkClass('/companies')} to="/companies">
                        <span className="material-symbols-outlined text-[20px] transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-translate-y-0.5">apartment</span>
                        Companies
                    </Link>
                    <Link className={getLinkClass('/analytics')} to="/analytics">
                        <span className="material-symbols-outlined text-[20px] transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-translate-y-0.5">insights</span>
                        Analytics
                    </Link>
                    <Link className={getLinkClass('/mock-interviews')} to="/mock-interviews">
                        <span className="material-symbols-outlined text-[20px] transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-translate-y-0.5">record_voice_over</span>
                        Mock Interviews
                    </Link>
                    <Link className={`mt-auto mb-4 ${getLinkClass('/settings')}`} to="/settings">
                        <span className="material-symbols-outlined text-[20px] transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-translate-y-0.5">settings</span>
                        Settings
                    </Link>
                </nav>

            </aside>
            
            <main className="flex-1 flex flex-col ml-[240px] relative h-screen bg-background overflow-hidden">
                <div className="flex-1 overflow-y-auto pt-[72px] pb-gutter px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto relative z-0">
                    {children}
                </div>
            </main>

            {/* Help Modal */}
            {showHelp && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <div className="bg-surface-container rounded-2xl border border-outline-variant p-6 w-full max-w-2xl shadow-2xl animate-fade-in-up max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6 border-b border-outline-variant pb-4">
                            <h3 className="font-headline-md text-headline-md text-primary-fixed-dim">How to use Placement & Study Tracker</h3>
                            <button onClick={() => setShowHelp(false)} className="text-on-surface-variant hover:text-on-surface">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="flex flex-col gap-6 text-on-surface">
                            <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2"><span className="material-symbols-outlined text-primary-fixed-dim text-[20px]">grid_view</span> Dashboard</h4>
                                <p className="text-on-surface-variant text-sm">Your command center. View upcoming mock interviews, daily protocol tasks, and high-level stats like your Resume ATS Score. Use the "New Log" button to track custom milestones.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2"><span className="material-symbols-outlined text-primary-fixed-dim text-[20px]">terminal</span> DSA Tracker</h4>
                                <p className="text-on-surface-variant text-sm">Manage your Leetcode progress across data structures. Filter by difficulty, update your status, and aim to conquer all 368 patterns.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2"><span className="material-symbols-outlined text-primary-fixed-dim text-[20px]">article</span> Resume Analyzer</h4>
                                <p className="text-on-surface-variant text-sm">Upload your PDF resume. Our AI agent will parse your resume against top ATS standards and provide a match score, keyword suggestions, and formatting feedback.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2"><span className="material-symbols-outlined text-primary-fixed-dim text-[20px]">apartment</span> Company Kanban</h4>
                                <p className="text-on-surface-variant text-sm">A drag-and-drop board for your job applications. Add companies and move them from Applied to Interviewing, and eventually to Offer.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2"><span className="material-symbols-outlined text-primary-fixed-dim text-[20px]">record_voice_over</span> Mock Interviews</h4>
                                <p className="text-on-surface-variant text-sm">Schedule simulated interviews with AI interviewers across various domains (Frontend, Backend, System Design). We will generate realistic questions and evaluate your responses.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Layout;
