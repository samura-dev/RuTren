const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const mapping = {
    // User explicitly defined:
    '26px': '22px',
    '20px': '18px',
    '16px': '14px',
    '14px': '13px',
    '13px': '11px',

    // Proportional downscaling for other sizes:
    '64px': '54px',
    '48px': '40px',
    '36px': '30px',
    '32px': '28px',
    '28px': '24px',
    '25px': '21px',
    '24px': '20px',
    '22px': '18px',
    '18px': '16px',
    '15px': '13px',
    '12px': '10px',
    '11px': '10px',
    '10px': '9px',
    '8px': '7px'
};

const numMapping = {
    // User explicitly defined:
    '26': '22',
    '20': '18',
    '16': '14',
    '14': '13',
    '13': '11',
    // Proportional downscaling for other sizes:
    '64': '54',
    '48': '40',
    '36': '30',
    '32': '28',
    '28': '24',
    '25': '21',
    '24': '20',
    '22': '18',
    '18': '16',
    '15': '13',
    '12': '10',
    '11': '10',
    '10': '9',
    '8': '7'
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

    // Also handle inline styles in JSX: fontSize: '16px' or fontSize: "16px"
    content = content.replace(/fontSize:\s*['"]?(\d+px)['"]?/g, (match, p1) => {
        if (mapping[p1]) {
            return match.replace(p1, mapping[p1]);
        }
        return match;
    });

    // Also handle fontSize: 16 in JSX
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
