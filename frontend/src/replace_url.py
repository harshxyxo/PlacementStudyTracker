import os
import re

files_to_modify = [
    "pages/Signup.tsx",
    "pages/Settings.tsx",
    "pages/ResumeAnalyzer.tsx",
    "pages/MockInterviewScheduling.tsx",
    "pages/MainDashboardAnimated.tsx",
    "pages/Login.tsx",
    "pages/DSATracker.tsx",
    "pages/DetailedAnalytics.tsx",
    "pages/CompanyKanbanBoard.tsx",
    "components/Layout.tsx",
]

base_dir = r"c:\Users\harsh_isu7tmt\OneDrive\Desktop\PlacementStudyTracker\frontend\src"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'https://placementstudytracker.onrender.com' not in content:
        return

    def replacer(match):
        quote = match.group(1)
        url_rest = match.group(2)
        return f"`${{API_BASE_URL}}{url_rest}`"
        
    new_content = re.sub(
        r"(['`\"])https://placementstudytracker\.onrender\.com(.*?)\1",
        replacer,
        content
    )

    if 'API_BASE_URL' in new_content and 'import API_BASE_URL' not in new_content:
        import_stmt = "import API_BASE_URL from '../config';\n"
        
        lines = new_content.split('\n')
        last_import_idx = -1
        for i, line in enumerate(lines):
            if line.strip().startswith('import '):
                last_import_idx = i
                
        if last_import_idx != -1:
            lines.insert(last_import_idx + 1, import_stmt.strip())
        else:
            lines.insert(0, import_stmt.strip())
            
        new_content = '\n'.join(lines)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
        print(f"Modified {filepath}")
        
for rel_path in files_to_modify:
    filepath = os.path.join(base_dir, rel_path)
    if os.path.exists(filepath):
        process_file(filepath)
    else:
        print(f"File not found: {filepath}")
