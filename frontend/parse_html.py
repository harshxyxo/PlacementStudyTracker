import re
import os

calendar_html_file = r'C:/Users/harsh_isu7tmt/.gemini/antigravity-ide/brain/794931e9-9535-417c-a009-2a7d49dc5dc1/.system_generated/steps/186/content.md'
analytics_html_file = r'C:/Users/harsh_isu7tmt/.gemini/antigravity-ide/brain/794931e9-9535-417c-a009-2a7d49dc5dc1/.system_generated/steps/165/content.md'
pages_dir = r'c:\Users\harsh_isu7tmt\OneDrive\Desktop\PlacementStudyTracker\frontend\src\pages'

def html_to_jsx(html):
    # class to className
    jsx = html.replace('class="', 'className="')
    # stroke attributes
    jsx = jsx.replace('stroke-width', 'strokeWidth')
    jsx = jsx.replace('stroke-linecap', 'strokeLinecap')
    jsx = jsx.replace('stroke-linejoin', 'strokeLinejoin')
    jsx = jsx.replace('stroke-dasharray', 'strokeDasharray')
    jsx = jsx.replace('fill-opacity', 'fillOpacity')
    jsx = jsx.replace('preserveAspectRatio', 'preserveAspectRatio') # already correct
    
    # SVG inline styles or other styles if any
    # Very simple hack for style="font-variation-settings: 'FILL' 1;"
    jsx = re.sub(r'style="([^"]+)"', r'style={{ \1 }}', jsx)
    jsx = jsx.replace("font-variation-settings: 'FILL' 1;", "'fontVariationSettings': '\"FILL\" 1'")
    jsx = jsx.replace("font-variation-settings: 'FILL' 0;", "'fontVariationSettings': '\"FILL\" 0'")
    jsx = jsx.replace("font-variation-settings: &quot;FILL&quot; 1;", "'fontVariationSettings': '\"FILL\" 1'")
    jsx = jsx.replace("font-variation-settings: &quot;FILL&quot; 0;", "'fontVariationSettings': '\"FILL\" 0'")
    
    # Close empty tags
    jsx = re.sub(r'(<(?:input|img|br|hr|circle|path|line|polygon)[^>]*?)(?<!/)>', r'\1 />', jsx)
    
    return jsx

def extract_and_create(html_file, page_name, start_tag, end_tag):
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Try to extract the main content container
    if '<main ' in content:
        match = re.search(r'(<main[^>]*>.*?</main>)', content, re.DOTALL)
        if match:
            main_html = match.group(1)
        else:
            return False
    elif '<div class="p-margin-desktop' in content:
        match = re.search(r'(<div class="p-margin-desktop.*?)</div>\s*</div>\s*</div>\s*<!--', content, re.DOTALL)
        if match:
            main_html = match.group(1)
        else:
            # try finding another div
            match = re.search(r'(<div class="p-margin-desktop.*?)</body>', content, re.DOTALL)
            if match:
                main_html = match.group(1)
                # close the extra divs
                main_html += "\n</div>\n</div>\n"
            else:
                return False
    else:
        return False
        
    jsx_content = html_to_jsx(main_html)
    
    # For Analytics, the outer wrapper might just be a div, so we ensure it compiles.
    # We will wrap it in our standard Component format
    
    comp = f"""import React from 'react';
import Layout from '../components/Layout';

const {page_name}: React.FC = () => {{
    return (
        <Layout>
            {jsx_content}
        </Layout>
    );
}};

export default {page_name};
"""
    with open(os.path.join(pages_dir, f"{page_name}.tsx"), 'w', encoding='utf-8') as f:
        f.write(comp)
    return True

extract_and_create(calendar_html_file, 'MockInterviewCalendarView', '', '')
extract_and_create(analytics_html_file, 'DetailedAnalytics', '', '')
print("Done parsing HTML to JSX")
