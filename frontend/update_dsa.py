import os
import re

file_path = r'c:\Users\harsh_isu7tmt\OneDrive\Desktop\PlacementStudyTracker\frontend\src\pages\DSATracker.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix scrolling
content = content.replace('overflow-hidden flex h-screen', 'flex min-h-screen')

# Add Link import if not present
if 'import { Link } from' not in content:
    content = content.replace('import React', "import { Link } from 'react-router-dom';\nimport React")

# Replace <a> with <Link> in the sidebar
content = content.replace('<a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant font-medium hover:bg-surface-variant/30 hover:text-primary-fixed-dim transition-colors scale-95 active:scale-90 group" href="#">\n                <span className="material-symbols-outlined text-[20px] transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-translate-y-0.5">grid_view</span>\n                <span className="">Dashboard</span>\n              </a>',
                          '<Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant font-medium hover:bg-surface-variant/30 hover:text-primary-fixed-dim transition-colors scale-95 active:scale-90 group" to="/dashboard">\n                <span className="material-symbols-outlined text-[20px] transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-translate-y-0.5">grid_view</span>\n                <span className="">Dashboard</span>\n              </Link>')

content = content.replace('<a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-secondary-fixed-dim font-bold bg-surface-variant/50 border-l-2 border-secondary-fixed-dim scale-95 active:scale-90 transition-transform group" href="#">\n                <span className="material-symbols-outlined text-[20px] shadow-[0_0_8px_rgba(76,214,255,0.4)] transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-translate-y-0.5">terminal</span>\n                <span className="">DSA Tracker</span>\n              </a>',
                          '<Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-secondary-fixed-dim font-bold bg-surface-variant/50 border-l-2 border-secondary-fixed-dim scale-95 active:scale-90 transition-transform group" to="/dsa-tracker">\n                <span className="material-symbols-outlined text-[20px] shadow-[0_0_8px_rgba(76,214,255,0.4)] transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-translate-y-0.5">terminal</span>\n                <span className="">DSA Tracker</span>\n              </Link>')

content = content.replace('<a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant font-medium hover:bg-surface-variant/30 hover:text-primary-fixed-dim transition-colors scale-95 active:scale-90 group" href="#">\n                <span className="material-symbols-outlined text-[20px] transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-translate-y-0.5">article</span>\n                <span className="">Resume</span>\n              </a>',
                          '<Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant font-medium hover:bg-surface-variant/30 hover:text-primary-fixed-dim transition-colors scale-95 active:scale-90 group" to="/resume">\n                <span className="material-symbols-outlined text-[20px] transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-translate-y-0.5">article</span>\n                <span className="">Resume</span>\n              </Link>')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated DSATracker.tsx successfully')
