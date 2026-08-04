import re

file_path = r'c:\Users\harsh_isu7tmt\OneDrive\Desktop\PlacementStudyTracker\frontend\src\pages\MainDashboardAnimated.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix font-bold on logo
content = content.replace('font-headline-md text-headline-md font-bold', 'font-headline-md text-headline-md')

# 2. Fix Search bar styling
# Old: w-96 bg-surface-container-low rounded-lg border border-outline-variant px-3 py-2
# New: w-[280px] bg-surface-variant/30 rounded-full border border-outline-variant px-4 py-2
content = content.replace('w-96 bg-surface-container-low rounded-lg border border-outline-variant px-3 py-2', 'w-[280px] bg-surface-variant/30 rounded-full border border-outline-variant px-4 py-2')

# 3. Fix SVG Chart
# Replace circle-bg path
bg_path_old = 'className="circle-bg" d="M18 2.0845'
bg_path_new = 'className="circle-bg stroke-surface-variant" fill="none" strokeWidth="2.5" d="M18 2.0845'
content = content.replace(bg_path_old, bg_path_new)

# Replace circle path
# Also fix stroke-dasharray to strokeDasharray for React
circle_path_old = 'className="circle stroke-primary-container glow-effect" d="M18 2.0845'
circle_path_new = 'className="circle stroke-primary-container glow-effect" fill="none" strokeWidth="2.5" strokeLinecap="round" d="M18 2.0845'
content = content.replace(circle_path_old, circle_path_new)
content = content.replace('stroke-dasharray="65, 100"', 'strokeDasharray="65, 100"')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated MainDashboardAnimated.tsx with fixes.")
