import os
import re

pages_dir = r'c:\Users\harsh_isu7tmt\OneDrive\Desktop\PlacementStudyTracker\frontend\src\pages'

route_map = {
    'Dashboard': '/dashboard',
    'DSA Tracker': '/dsa-tracker',
    'Resume': '/resume',
    'Companies': '/companies',
    'Analytics': '/analytics',
    'Mock Interviews': '/mock-interviews',
    'Settings': '#'
}

for filename in os.listdir(pages_dir):
    if not filename.endswith('.tsx'):
        continue
    
    file_path = os.path.join(pages_dir, filename)
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Replace scroll issue
    content = content.replace('overflow-hidden flex h-screen', 'flex min-h-screen')
    
    # Replace a tags with Link
    # We will look for <a ... href="#"> ... <span>Text</span> ... </a> pattern
    # It's safer to use regex that finds href="#" and the inner text
    
    def replacer(match):
        a_start = match.group(1) # <a className="..."
        inner_content = match.group(2) # ... <span>Dashboard</span> ...
        
        # Find which route it matches based on text
        to_url = '#'
        for key, url in route_map.items():
            if key in inner_content:
                to_url = url
                break
        
        link_start = a_start.replace('<a ', '<Link ').replace('href="#"', f'to="{to_url}"')
        return f"{link_start}>{inner_content}</Link>"
    
    # Regex to match <a ... href="#">...</a>
    # Note: re.DOTALL is needed if the a tag spans multiple lines
    content = re.sub(r'(<a\b[^>]*?href="#".*?)>(.*?)</a\s*>', replacer, content, flags=re.DOTALL)
    
    # Add Link import if we replaced something and it's not imported
    if '<Link ' in content and 'import { Link }' not in content:
        content = content.replace("import React", "import { Link } from 'react-router-dom';\nimport React", 1)
        
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filename}")
