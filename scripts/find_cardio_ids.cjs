const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, '../src/data/exercises_large.ts');

try {
    const content = fs.readFileSync(FILE_PATH, 'utf8');
    const lines = content.split('\n');

    // Targeted searches for cardio
    const keywords = [
        'treadmill',
        'elliptical',
        'stationary bike',
        'cycling', // bike
        'rowing machine',
        'rower',
        'stepper',
        'jump rope',
        'skipping rope'
    ];

    let currentId = '';

    console.log('Searching for cardio keywords...');

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
                    }
                }
            }
        }
    }

} catch (err) {
    console.error(err);
}
