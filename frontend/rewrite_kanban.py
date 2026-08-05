import os
import re

BASE_DIR = r"c:\Users\harsh_isu7tmt\OneDrive\Desktop\PlacementStudyTracker\frontend\src\pages"
path = os.path.join(BASE_DIR, "CompanyKanbanBoard.tsx")

with open(path, "r") as f:
    content = f.read()

content = content.replace("import React from 'react';", "import React, { useState, useEffect } from 'react';")

interface_def = """
interface CompanyApplication {
    id: string;
    company: string;
    role: string;
    location: string;
    salary: string;
    appliedDate: string;
    matchScore: number;
    status: string;
}
"""

state_code = """
    const [applications, setApplications] = useState<CompanyApplication[]>([]);
    
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
"""

content = content.replace("const CompanyKanbanBoard: React.FC = () => {", interface_def + "\nconst CompanyKanbanBoard: React.FC = () => {\n" + state_code)

card_template = """
{list.length === 0 ? <p className="text-on-surface-variant text-sm px-2">No applications yet.</p> : list.map(app => (
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
"""

# Now replace the inner part of each column.
# Column 1 inner: <div className="flex-1 flex flex-col gap-3 overflow-y-auto kanban-col pr-1"> ... </div>
pattern = r'(<div className="flex-1 flex flex-col gap-3 overflow-y-auto kanban-col pr-1">)(.*?)(</div>\s*</div>)'

# There are 4 matches. We will replace them in order.
matches = list(re.finditer(pattern, content, flags=re.DOTALL))

if len(matches) == 4:
    new_content = content[:matches[0].start(2)] + card_template.replace("list.map", "applied.map").replace("list.length", "applied.length") + content[matches[0].end(2):matches[1].start(2)] + card_template.replace("list.map", "interviewing.map").replace("list.length", "interviewing.length") + content[matches[1].end(2):matches[2].start(2)] + card_template.replace("list.map", "offers.map").replace("list.length", "offers.length") + content[matches[2].end(2):matches[3].start(2)] + card_template.replace("list.map", "rejected.map").replace("list.length", "rejected.length") + content[matches[3].end(2):]
    
    # Update the counts!
    new_content = new_content.replace('rounded-full">2</span>', 'rounded-full">{applied.length}</span>', 1)
    new_content = new_content.replace('rounded-full">1</span>', 'rounded-full">{interviewing.length}</span>', 1)
    new_content = new_content.replace('rounded-full">1</span>', 'rounded-full">{offers.length}</span>', 1) # This replaces the 3rd match (which is 1)
    new_content = new_content.replace('rounded-full">1</span>', 'rounded-full">{rejected.length}</span>', 1) # This replaces the 4th match (which is 1)

    with open(path, "w") as f:
        f.write(new_content)
    print("Rewrote CompanyKanbanBoard.tsx")
else:
    print(f"Error: Found {len(matches)} columns, expected 4.")
