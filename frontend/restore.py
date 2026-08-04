import sys

top_content = '''import React from 'react';
import { Link } from 'react-router-dom';

const MainDashboardAnimated: React.FC = () => {
    return (
        <div className="font-body-md text-body-md antialiased flex min-h-screen w-screen selection:bg-primary-fixed-dim/30 selection:text-primary">
            

<header className="fixed top-0 right-0 w-[calc(100%-240px)] z-50 bg-surface-container-lowest/80 dark:bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant flex justify-between items-center px-margin-desktop h-16">

<div className="flex items-center w-96 bg-surface-container-low rounded-lg border border-outline-variant px-3 py-2 focus-within:ring-2 focus-within:ring-primary-fixed-dim/20 transition-all">
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
<img className="w-8 h-8 rounded-full border border-outline-variant object-cover cursor-pointer" data-alt="A small circular profile picture of a young professional engineering student, featuring a modern, dark high-tech background, soft studio lighting emphasizing sharp features, evoking a disciplined and ambitious mood." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUR7WYA-bvt33qcF0BlzeIX9E-gN18BfIrqS34qN3CW-EBloUOHUfElce-W8NxyPwPAJJ-uXGsUs-s-EcXMQehVQjOmv6WkXp1w7cjOm6htz3tpcddamvA_wfZw954-9rghkSwsUvpPfAyLDKxC4audHwTJikVBbWPgs12_UJ7yU0rnnpgbBNno00XIqpDXI0cszOH07hIssxofM-NIgpOi75mua7ZColfvGCeS_8VJOuMa-p7-l9_twn33cGwRC452x8ZmZC2RNtv" />
</div>
</header>

<aside className="w-sidebar-width h-screen fixed left-0 top-0 bg-surface-container-low dark:bg-surface-container-low border-r border-outline-variant flex flex-col py-gutter px-stack-gap z-40">

<div className="mb-8 px-4 mt-2">
<h1 className="font-headline-md text-headline-md font-bold text-primary-fixed-dim tracking-tight">Placement &amp; Study Tracker</h1>
</div>

<nav className="flex-1 flex flex-col gap-1">

<Link className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-secondary-fixed-dim font-bold bg-surface-variant/50 border-l-2 border-secondary-fixed-dim scale-95 active:scale-90 transition-transform transition-colors group" to="/dashboard">
<span className="material-symbols-outlined text-[20px] transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-translate-y-0.5" style={{ fontVariationSettings: "&quot" }}>grid_view</span>
                Dashboard
            </Link>

<Link className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-on-surface-variant font-medium hover:bg-surface-variant/30 hover:text-primary-fixed-dim transition-colors scale-95 active:scale-90 transition-transform" to="/dsa-tracker">
<span className="material-symbols-outlined text-[20px] transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-translate-y-0.5">terminal</span>
                DSA Tracker
            </Link>
<Link className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-on-surface-variant font-medium hover:bg-surface-variant/30 hover:text-primary-fixed-dim transition-colors scale-95 active:scale-90 transition-transform" to="/resume">
<span className="material-symbols-outlined text-[20px] transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-translate-y-0.5">article</span>
                Resume
            </Link>
<Link className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-on-surface-variant font-medium hover:bg-surface-variant/30 hover:text-primary-fixed-dim transition-colors scale-95 active:scale-90 transition-transform" to="/companies">
<span className="material-symbols-outlined text-[20px] transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-translate-y-0.5">apartment</span>
                Companies
            </Link>
<Link className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-on-surface-variant font-medium hover:bg-surface-variant/30 hover:text-primary-fixed-dim transition-colors scale-95 active:scale-90 transition-transform" to="/analytics">
<span className="material-symbols-outlined text-[20px] transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-translate-y-0.5">insights</span>
                Analytics
            </Link>
<Link className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-on-surface-variant font-medium hover:bg-surface-variant/30 hover:text-primary-fixed-dim transition-colors scale-95 active:scale-90 transition-transform" to="/mock-interviews">
<span className="material-symbols-outlined text-[20px] transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-translate-y-0.5">record_voice_over</span>
                Mock Interviews
            </Link>
<Link className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-on-surface-variant font-medium hover:bg-surface-variant/30 hover:text-primary-fixed-dim transition-colors scale-95 active:scale-90 transition-transform mt-auto mb-4" to="#">
<span className="material-symbols-outlined text-[20px] transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-translate-y-0.5">settings</span>
                Settings
            </Link>
</nav>

<div className="mt-auto bg-surface-variant/30 border border-outline-variant rounded-xl p-4 flex flex-col gap-3">
<div className="flex items-center gap-3">
<img className="w-10 h-10 rounded-full bg-surface" data-alt="A stylized 3D avatar of a professional engineering student, wearing futuristic smart glasses, set against a dark cybernetic background, illuminated by subtle cyan edge lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAY1SJoQUkdpo2gZRicg50TtxANdZzN1IRDhRKpuhFC5ond9oyV7uIaaegW-e8MntRsVPJlMY5Uej8PdfcYfHERCFg5oOoB1N4SUUjdqcCChQ0OnO3l8S8RNKpuG0uDeR1pi6peD1OkPonkXUA7RxhYNDvYJASfpthWcL1eAarqGxg8gdWEgdTjWXorcZzNCRkVRGdKi9g69Vhdl47-bBDzV2A5hy2JNv5ESJqG57D1IG2j7FEff-Q4FCU4cGhoxxpAHlgbAnpTkC0c" />
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

<main className="ml-sidebar-width mt-16 p-margin-desktop max-w-container-max">
'''

file_path = r'c:\Users\harsh_isu7tmt\OneDrive\Desktop\PlacementStudyTracker\frontend\src\pages\MainDashboardAnimated.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('<div className="mb-10 flex justify-between items-end">')
if idx != -1:
    rest_of_file = content[idx:]
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(top_content + '\n' + rest_of_file)
    print('Successfully restored MainDashboardAnimated.tsx')
else:
    print('Failed to find the marker in the file.')
