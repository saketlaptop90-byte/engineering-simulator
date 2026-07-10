const fs = require('fs');
let html = fs.readFileSync('simulator.html', 'utf8');
let lines = html.split('\n');
let corrupted = lines.find(l => l.includes('ENGINE VARIANTS'));
console.log("Original: " + corrupted.trim());
let fixed = Buffer.from(corrupted, 'binary').toString('utf8');
console.log("Fixed: " + fixed.trim());