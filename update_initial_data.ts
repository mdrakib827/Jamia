import fs from 'fs';

const data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
let serverCode = fs.readFileSync('server.ts', 'utf-8');

const initialDataRegex = /const initialData = \{[\s\S]*?\n\};\n/m;
const newInitialData = `const initialData = ${JSON.stringify(data, null, 2)};\n`;

serverCode = serverCode.replace(initialDataRegex, newInitialData);
fs.writeFileSync('server.ts', serverCode);
console.log("Updated initialData in server.ts");
