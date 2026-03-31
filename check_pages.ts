import fs from 'fs';
const files = fs.readdirSync('src/pages');
files.forEach(f => {
  console.log(f, fs.statSync('src/pages/' + f).mtime);
});
