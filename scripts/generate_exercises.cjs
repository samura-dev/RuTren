const fs = require('fs');
const path = require('path');

const CSV_PATH = path.join(__dirname, '../exercises.csv');
const OUTPUT_PATH = path.join(__dirname, '../src/data/exercises_large.ts');

const MUSCLE_MAP = {
    'chest': 'Грудь',
    'back': 'Спина',
    'lats': 'Спина',
    'upper back': 'Спина',
    'legs': 'Ноги',
    'upper legs': 'Ноги',
    'lower legs': 'Ноги',
    'waist': 'Пресс',
    'shoulders': 'Плечи',
    'upper arms': 'Руки',
    'lower arms': 'Руки',
    'cardio': 'Кардио',
    'neck': 'Другое'
};

const EQUIPMENT_MAP = {
    'body weight': 'Свой вес',
    'barbell': 'Штанга',
    'dumbbell': 'Гантели',
    'cable': 'Тренажёр',
    'machine': 'Тренажёр',
    'kettlebell': 'Гиря',
    'band': 'Резинка',
    'medicine ball': 'Медбол',
    'exercise ball': 'Фитбол',
    'foam roller': 'МФР',
    'e-z curl bar': 'EZ-гриф',
    'sled machine': 'Тренажёр',
    'rope': 'Канат',
    'roller': 'Ролик',
    'assist mch': 'Тренажёр',
    'olympic barbell': 'Штанга',
    'weighted': 'С отягощением',
    'smith machine': 'Тренажёр Смита',
    'tire': 'Покрышка',
    'trap bar': 'Трэп-гриф',
    'elliptical machine': 'Эллипсоид',
    'stepmill machine': 'Степпер',
    'stationary bike': 'Велотренажёр',
    'leverage machine': 'Тренажёр',
    'stability ball': 'Фитбол',
    'assisted': 'Тренажёр',
    'wheel roller': 'Ролик для пресса',
    'upper body ergometer': 'Тренажёр',
    'hammer': 'Молот',
    'bosu ball': 'Босу',
    'resistance band': 'Резинка'
};

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Simple CSV parser that handles quoted fields
function parseCSV(text) {
    const lines = text.split('\n');
    const headers = lines[0].split(',');
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const row = [];
        let inQuotes = false;
        let currentValue = '';

        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                row.push(currentValue);
                currentValue = '';
            } else {
                currentValue += char;
            }
        }
        row.push(currentValue);
        result.push(row);
    }
    return { headers, rows: result };
}

try {
    const data = fs.readFileSync(CSV_PATH, 'utf8');
    const { headers, rows } = parseCSV(data);

    // Valid muscle groups for type checking
    const VALID_MUSCLES = ['Грудь', 'Спина', 'Ноги', 'Плечи', 'Руки', 'Пресс', 'Кардио', 'Другое'];

    const exercises = rows.map(row => {
        // Index mapping:
        // 0: bodyPart
        // 1: equipment
        // 2: id
        // 3: name
        // 4: target

        const bodyPart = row[0];
        const equipment = row[1];
        const id = row[2];
        const name = row[3];
        const target = row[4];

        const mappedMuscle = MUSCLE_MAP[bodyPart] || 'Другое';
        const mappedEquipment = EQUIPMENT_MAP[equipment] || capitalize(equipment);

        return {
            id: id,
            name: capitalize(name),
            muscleGroup: VALID_MUSCLES.includes(mappedMuscle) ? mappedMuscle : 'Другое',
            equipment: mappedEquipment,
            gifUrl: `https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/${id}.gif`,
            // description: `Target: ${capitalize(target)}` // Optional
        };
    }).filter(ex => ex.id && ex.name);

    const fileContent = `import type { Exercise } from '@/types';

export const GENERATED_EXERCISES: Exercise[] = ${JSON.stringify(exercises, null, 4)};
`;

    fs.writeFileSync(OUTPUT_PATH, fileContent);
    console.log(`Successfully generated ${exercises.length} exercises to ${OUTPUT_PATH}`);

} catch (err) {
    console.error('Error generating exercises:', err);
    process.exit(1);
}
