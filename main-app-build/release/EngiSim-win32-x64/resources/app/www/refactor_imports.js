const fs = require('fs');
let content = fs.readFileSync('app.js', 'utf8');

// 1. Extract and remove all static imports from ./machines/
const importRegex = /import\s+\{\s*([A-Za-z0-9_]+)(?:\s+as\s+([A-Za-z0-9_]+))?\s*\}\s*from\s*'(\.\/machines\/[^']+)'\s*;\r?\n/g;
const importsMap = {}; // alias -> { importPath, originalName }

content = content.replace(importRegex, (match, originalName, alias, importPath) => {
    const key = alias || originalName;
    importsMap[key] = { importPath, originalName };
    return ''; // remove from file
});

console.log('Extracted', Object.keys(importsMap).length, 'imports.');

// 2. Replace 'create: aliasName' with dynamic import fields in the MACHINES array
let replacedCount = 0;
const machineRegex = /create:\s*([A-Za-z0-9_]+)/g;
content = content.replace(machineRegex, (match, createFn) => {
    if (importsMap[createFn]) {
        replacedCount++;
        const info = importsMap[createFn];
        return \importPath: '\', importName: '\'\;
    }
    return match;
});

console.log('Replaced', replacedCount, 'machine create refs.');

// 3. Make loadMachine async
content = content.replace('function loadMachine(machineEntry)', 'async function loadMachine(machineEntry)');
content = content.replace('const data = machineEntry.create(THREE, machineEntry.id);', 
\let createFn = machineEntry.create;
  if (machineEntry.importPath) {
     const mod = await import(machineEntry.importPath);
     createFn = mod[machineEntry.importName];
  }
  const data = createFn(THREE, machineEntry.id);\);

fs.writeFileSync('app.js', content, 'utf8');
