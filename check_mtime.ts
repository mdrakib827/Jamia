import fs from 'fs';
console.log('data.json:', fs.statSync('data.json').mtime);
console.log('server.ts:', fs.statSync('server.ts').mtime);
