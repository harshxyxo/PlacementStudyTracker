import os
import re

components_dir = r'c:\Users\harsh_isu7tmt\OneDrive\Desktop\PlacementStudyTracker\frontend\src\components'
pages_dir = r'c:\Users\harsh_isu7tmt\OneDrive\Desktop\PlacementStudyTracker\frontend\src\pages'

# Update Layout to ensure it has p-margin-desktop if needed, but actually let's just make it a clean shell
layout_content = """import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();
    
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
                <div className="flex items-center w-[280px] bg-surface-variant/30 rounded-full border border-outline-variant px-4 py-2 focus-within:ring-2 focus-within:ring-primary-fixed-dim/20 transition-all">
                    <span className="material-symbols-outlined text-on-surface-variant mr-2 text-[20px]">search</span>
                    <input className="w-full bg-transparent border-none focus:ring-0 text-body-md text-on-surface placeholder-on-surface-variant outline-none" placeholder="Search resources, goals..." type="text" />
                </div>
                <div className="flex items-center gap-4">
                    <button aria-label="notifications" className="p-2 text-on-surface-variant hover:text-primary-fixed hover:bg-surface-variant rounded-lg transition-all">
                        <span className="material-symbols-outlined text-[20px]">notifications</span>
                    </button>
                    <button aria-label="help" className="p-2 text-on-surface-variant hover:text-primary-fixed hover:bg-surface-variant rounded-lg transition-all">
                        <span className="material-symbols-outlined text-[20px]">help</span>
                    </button>
                    <div className="w-px h-6 bg-outline-variant mx-2"></div>
                    <img className="w-8 h-8 rounded-full border border-outline-variant object-cover cursor-pointer" data-alt="Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUR7WYA-bvt33qcF0BlzeIX9E-gN18BfIrqS34qN3CW-EBloUOHUfElce-W8NxyPwPAJJ-uXGsUs-s-EcXMQehVQjOmv6WkXp1w7cjOm6htz3tpcddamvA_wfZw954-9rghkSwsUvpPfAyLDKxC4audHwTJikVBbWPgs12_UJ7yU0rnnpgbBNno00XIqpDXI0cszOH07hIssxofM-NIgpOi75mua7ZColfvGCeS_8VJOuMa-p7-l9_twn33cGwRC452x8ZmZC2RNtv" />
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
                    <Link className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-on-surface-variant font-medium hover:bg-surface-variant/30 hover:text-primary-fixed-dim transition-colors scale-95 active:scale-90 transition-transform mt-auto mb-4 group" to="#">
                        <span className="material-symbols-outlined text-[20px] transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-translate-y-0.5">settings</span>
                        Settings
                    </Link>
                </nav>
                <div className="mt-auto bg-surface-variant/30 border border-outline-variant rounded-xl p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <img className="w-10 h-10 rounded-full bg-surface" data-alt="Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAY1SJoQUkdpo2gZRicg50TtxANdZzN1IRDhRKpuhFC5ond9oyV7uIaaegW-e8MntRsVPJlMY5Uej8PdfcYfHERCFg5oOoB1N4SUUjdqcCChQ0OnO3l8S8RNKpuG0uDeR1pi6peD1OkPonkXUA7RxhYNDvYJASfpthWcL1eAarqGxg8gdWEgdTjWXorcZzNCRkVRGdKi9g69Vhdl47-bBDzV2A5hy2JNv5ESJqG57D1IG2j7FEff-Q4FCU4cGhoxxpAHlgbAnpTkC0c" />
                        <div>
                            <div className="text-on-surface font-body-md font-semibold">Future Engineer</div>
                            <div className="font-label-caps text-label-caps text-on-surface-variant">Career Roadmap</div>
                        </div>
                    </div>
                    <button className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-inverse-primary to-primary-container text-on-primary-fixed font-semibold font-body-md hover:opacity-90 transition-opacity btn-shimmer relative overflow-hidden">
                        Prepare for Placements
                    </button>
                </div>
            </aside>
            
            <main className="flex-1 ml-[240px] mt-16 min-h-[calc(100vh-64px)] overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

export default Layout;
"""
with open(os.path.join(components_dir, 'Layout.tsx'), 'w', encoding='utf-8') as f:
    f.write(layout_content)

pages = [
    'MainDashboardAnimated.tsx',
    'DSATracker.tsx',
    'ResumeAnalyzer.tsx',
    'CompanyKanbanBoard.tsx',
    'MockInterviewScheduling.tsx',
    'PlacementandStudyTracker.tsx'
]

def extract_main_content(content):
    # Try to find <main ...> ... </main>
    main_match = re.search(r'<main[^>]*>(.*?)</main>', content, re.DOTALL)
    if main_match:
        return main_match.group(1).strip()
    
    # If no <main>, look for <div className="flex-1 md:ml-[240px]...> or similar
    div_match = re.search(r'<div[^>]*ml-\[240px\][^>]*>(.*?)</div>\s*</div>\s*$', content, re.DOTALL)
    if div_match:
        return div_match.group(1).strip()
    
    return None

for page in pages:
    page_path = os.path.join(pages_dir, page)
    if not os.path.exists(page_path):
        continue
        
    with open(page_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    main_content = extract_main_content(content)
    if not main_content:
        print(f"Failed to extract main content for {page}")
        continue
        
    # Build new page
    import_match = re.search(r'import\s+.*?;', content, re.DOTALL)
    imports = "import React from 'react';\nimport Layout from '../components/Layout';\n"
    if 'useState' in content:
        imports += "import { useState } from 'react';\n"
    if 'useEffect' in content:
        imports += "import { useEffect } from 'react';\n"
        
    # Get component name from file
    comp_name = page.replace('.tsx', '')
    
    # Extract any hooks or state from the component body before return
    body_match = re.search(rf'const {comp_name}: React\.FC = \(\) => {{(.*?)\s+return \(', content, re.DOTALL)
    body = body_match.group(1).strip() if body_match else ""
    
    new_content = f"""{imports}

const {comp_name}: React.FC = () => {{
    {body}
    return (
        <Layout>
            <div className="p-margin-desktop max-w-container-max mx-auto">
                {main_content}
            </div>
        </Layout>
    );
}};

export default {comp_name};
"""
    with open(page_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Refactored {page}")
