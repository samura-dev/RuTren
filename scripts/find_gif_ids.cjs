const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, '../src/data/exercises_large.ts');

try {
    const content = fs.readFileSync(FILE_PATH, 'utf8');
    const lines = content.split('\n');

    const keywords = [
        'incline dumbbell',
        'cable',
        'push-up', 'push up',
        'fly',
        'pec deck',
        'incline barbell',
        'dip',
        'pullover',
        'pull-up', 'pull up',
        'lat pulldown',
        'seated row',
        'back extension',
        'shrug',
        'leg press',
        'lunge',
        'leg extension',
        'leg curl',
        'calf',
        'deadlift',
        'shoulder press',
        'lateral raise',
        'face pull',
        'curl',
        'triceps',
        'crunch',
        'plank',
        'hammer'
    ];

    let currentId = '';
    let foundCount = 0;

    console.log('Searching for keywords...');

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line.includes('"id":')) {
            currentId = line.match(/"id": "(.*)"/)?.[1];
        } else if (line.includes('"name":')) {
            const name = line.match(/"name": "(.*)"/)?.[1]?.toLowerCase();
            if (name && currentId) {
                for (const keyword of keywords) {
                    if (name.includes(keyword)) {
                        console.log(`[${currentId}] ${name}`);
                        foundCount++;
                        break; // Found one keyword, move to next exercise
                    }
                }
            }
        }
    }

    console.log(`Found ${foundCount} matches.`);

} catch (err) {
    console.error(err);
}
