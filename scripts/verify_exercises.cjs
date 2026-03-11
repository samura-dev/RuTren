const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, '../src/data/exercises.ts');

try {
    const content = fs.readFileSync(FILE_PATH, 'utf8');

    // Extract manual exercises block
    const manualBlockMatch = content.match(/export const MANUAL_EXERCISES: Exercise\[\] = \[\s*([\s\S]*?)\];/);

    if (!manualBlockMatch) {
        console.error('Could not find MANUAL_EXERCISES block');
        process.exit(1);
    }

    const manualBlock = manualBlockMatch[1];

    // Split into objects (rough parsing)
    // We assume standard formatting: { ... },
    const exercises = manualBlock.split(/^\s*\{/gm).slice(1); // Skip pre-match

    let missingGifCount = 0;

    exercises.forEach((exStr, index) => {
        // Add back the opening brace
        const fullExStr = '{' + exStr;

        // Extract ID and Name
        const idMatch = fullExStr.match(/id:\s*'([^']+)'/);
        const nameMatch = fullExStr.match(/name:\s*'([^']+)'/);
        const gifMatch = fullExStr.match(/gifUrl:\s*'([^']+)'/);

        const id = idMatch ? idMatch[1] : 'unknown';
        const name = nameMatch ? nameMatch[1] : 'unknown';

        if (!gifMatch) {
            // Check if it's the "Vacuum" exercise which we intentionally skipped
            if (name.includes('Вакуум')) {
                console.log(`[INFO] Skipping known missing GIF: ${name} (${id})`);
            } else {
                console.error(`[ERROR] Missing GIF for: ${name} (${id})`);
                missingGifCount++;
            }
        }
    });

    if (missingGifCount === 0) {
        console.log('SUCCESS: All manual exercises (except exclusions) have GIFs.');
    } else {
        console.error(`FAILURE: Found ${missingGifCount} exercises without GIFs.`);
    }

} catch (err) {
    console.error('Error verifying exercises:', err);
}
