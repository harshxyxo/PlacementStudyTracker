import re
import os

pages = ['DetailedAnalytics.tsx', 'MockInterviewCalendarView.tsx']
pages_dir = r'c:\Users\harsh_isu7tmt\OneDrive\Desktop\PlacementStudyTracker\frontend\src\pages'

for page in pages:
    page_path = os.path.join(pages_dir, page)
    if not os.path.exists(page_path):
        continue
        
    with open(page_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove the invalid closing tags that were created when we self-closed the opening tags
    content = re.sub(r'</(input|img|br|hr|circle|path|line|polygon)>', '', content)
    
    # Fix HTML comments to JSX comments, EXCEPT inside <svg> if they are an issue, but { /* */ } works in JSX.
    content = re.sub(r'<!--(.*?)-->', r'{/*\1*/}', content, flags=re.DOTALL)
    
    # Fix stop-color and stop-opacity
    content = content.replace('stop-color', 'stopColor')
    content = content.replace('stop-opacity', 'stopOpacity')
    
    # Fix <linearGradient ... /> <stop...> </linearGradient>
    # Wait, my regex earlier might have done <linearGradient ... /> which broke it!
    # "Close empty tags" regex didn't include linearGradient, but wait, look at line 43: `<linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1" />`
    # Ah, the original HTML was `<linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">`
    # My regex didn't match linearGradient. Why did it have `/>`?
    # Because my regex didn't touch it. But let's check line 43 of DetailedAnalytics.tsx.
    
    # I will just write a function to fix all remaining known JSX issues.
    # class= -> className= (already done)
    # The build errors say:
    # Expected corresponding JSX closing tag for 'svg'
    
    with open(page_path, 'w', encoding='utf-8') as f:
        f.write(content)
