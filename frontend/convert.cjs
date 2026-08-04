const fs = require('fs');
const path = require('path');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'index.html');

for (const file of files) {
    let html = fs.readFileSync(file, 'utf-8');
    // Extract everything inside body
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (!bodyMatch) continue;
    let jsx = bodyMatch[1];
    
    // Convert class to className
    jsx = jsx.replace(/class=/g, 'className=');
    // Convert for to htmlFor
    jsx = jsx.replace(/for=/g, 'htmlFor=');
    // Fix self-closing tags
    jsx = jsx.replace(/<img([^>]*[^\/])>/g, '<img$1 />');
    jsx = jsx.replace(/<input([^>]*[^\/])>/g, '<input$1 />');
    jsx = jsx.replace(/<br([^>]*[^\/])>/g, '<br$1 />');
    jsx = jsx.replace(/<hr([^>]*[^\/])>/g, '<hr$1 />');
    // Inline styles (basic regex)
    jsx = jsx.replace(/style="([^"]*)"/g, (match, styles) => {
        const obj = {};
        styles.split(';').forEach(s => {
            if (!s.trim()) return;
            const [k, v] = s.split(':');
            if (k && v) {
                const camelK = k.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
                obj[camelK] = v.trim().replace(/'/g, '\\"');
            }
        });
        return `style={{ ${Object.entries(obj).map(([k,v]) => `${k}: "${v}"`).join(', ')} }}`;
    });
    // Remove comments
    jsx = jsx.replace(/<!--[\s\S]*?-->/g, '');
    
    // Wrap in component
    let name = file.replace('.html', '').replace(/[^a-zA-Z0-9]/g, '');
    if (name === "DSA_Tracker") continue; // Skip DSA Tracker since we already rebuilt it manually.
    const component = `import React from 'react';\n\nconst ${name}: React.FC = () => {\n    return (\n        <div className="font-body-md text-body-md antialiased overflow-hidden flex h-screen w-screen selection:bg-primary-fixed-dim/30 selection:text-primary">\n            ${jsx}\n        </div>\n    );\n};\nexport default ${name};`;
    
    fs.writeFileSync(path.join('src/pages', name + '.tsx'), component);
    console.log('Generated ' + name + '.tsx');
}
