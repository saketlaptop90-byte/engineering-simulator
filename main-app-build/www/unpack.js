const fs = require('fs');

const cellContent = fs.readFileSync('machines/cell_phase5.js', 'utf8');
const organicContent = fs.readFileSync('machines/organic.js', 'utf8');
let appJs = fs.readFileSync('app.js', 'utf8');

const newEntries = [];

// Extract from cell_phase5.js
const cellMatch = cellContent.match(/const modelsList = \[([\s\S]*?)\];/);
if (cellMatch) {
    const listStr = cellMatch[1];
    // parse out strings
    const regex = /"([^"]+)"/g;
    let match;
    while ((match = regex.exec(listStr)) !== null) {
        const name = match[1];
        const id = 'cell5_' + name.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
        newEntries.push(`  { id: '${id}', name: '${name}', icon: '🧬', category: 'biology', importPath: './machines/cell_phase5.js', importName: 'createCellPhase5' },`);
    }
}

// Extract from organic.js
const orgMatch = organicContent.match(/const reactionList = \[([\s\S]*?)\];/);
if (orgMatch) {
    const listStr = orgMatch[1];
    
    // For strings
    const strRegex = /"([^"]+)"/g;
    let match;
    while ((match = strRegex.exec(listStr)) !== null) {
        const name = match[1];
        if (name.length > 3) {
           const id = 'organic_' + name.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
           newEntries.push(`  { id: '${id}', name: '${name}', icon: '🧪', category: 'chemistry', importPath: './machines/organic.js', importName: 'createOrganicReactions' },`);
        }
    }
    
    // For objects { name: "..."
    const objRegex = /name:\s*"([^"]+)"/g;
    while ((match = objRegex.exec(listStr)) !== null) {
        const name = match[1];
        if (name.length > 3) {
           const id = 'organic_' + name.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
           // Avoid duplicates if already caught by string regex
           if (!newEntries.find(e => e.includes(`id: '${id}'`))) {
               newEntries.push(`  { id: '${id}', name: '${name}', icon: '🧪', category: 'chemistry', importPath: './machines/organic.js', importName: 'createOrganicReactions' },`);
           }
        }
    }
}

console.log("Found " + newEntries.length + " entries to unpack!");

// Insert into app.js
const insertIndex = appJs.lastIndexOf('];');
if (insertIndex !== -1) {
    const before = appJs.substring(0, insertIndex);
    const after = appJs.substring(insertIndex);
    const updated = before + newEntries.join('\n') + '\n' + after;
    fs.writeFileSync('app.js', updated, 'utf8');
    console.log("Successfully unpacked entries into app.js");
} else {
    console.log("Failed to find insertion point in app.js");
}
