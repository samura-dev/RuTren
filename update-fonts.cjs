const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const mapping = {
    '26px': '22px',
    '20px': '18px',
    '16px': '14px',
    '14px': '13px',
    '13px': '11px',
};

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(file));
        } else if (file.endsWith('.css') || file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const files = walkDir(srcDir);
let changedFiles = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Replace based on regex: font-size:\s*(\d+px)
    content = content.replace(/font-size:\s*(\d+px)/g, (match, p1) => {
        if (mapping[p1]) {
            return match.replace(p1, mapping[p1]);
        }
        return match;
    });
    
    // Also handle inline styles in JSX: fontSize: '16px' or fontSize: 16
    content = content.replace(/fontSize:\s*['"]?(\d+px)['"]?/g, (match, p1) => {
        if (mapping[p1]) {
            return match.replace(p1, mapping[p1]);
        }
        return match;
    });
    
    // Also handle fontSize: 16 in JSX
    const numMapping = {
        '26': '22',
        '20': '18',
        '16': '14',
        '14': '13',
        '13': '11',
    };
    content = content.replace(/fontSize:\s*(\d+)(?!\w)/g, (match, p1) => {
        if (numMapping[p1]) {
            return match.replace(p1, numMapping[p1]);
        }
        return match;
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changedFiles++;
        console.log('Updated:', file);
    }
});

console.log(`Done. Updated ${changedFiles} files.`);
