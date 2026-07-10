const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

// Fix 1: Fallback to createMachine
code = code.replace(
  const mod = await import(machineEntry.importPath);\n    createFn = mod[machineEntry.importName];,
  const mod = await import(machineEntry.importPath);\n    createFn = mod.createMachine || mod[machineEntry.importName];
);

// Fix 2: Auto-detect category from URL path if not explicitly provided
code = code.replace(
  const filterCat = params.get('category');,
  let filterCat = params.get('category');\n  if (!filterCat) {\n    const path = window.location.pathname.split('/').pop().replace('.html', '');\n    if (path && path !== 'index' && path !== 'simulator' && path !== '') {\n      filterCat = path;\n    }\n  }
);

fs.writeFileSync('app.js', code);
console.log('Fixed app.js');
