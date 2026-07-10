const fs = require('fs');
['simulator.html', 'index.html'].forEach(file => {
  if (fs.existsSync(file)) {
    let html = fs.readFileSync(file, 'utf8');
    html = html.replace(/src="app\.js(\?v=[0-9]+)?"/g, 'src="app.js?v=' + Date.now() + '"');
    fs.writeFileSync(file, html);
    console.log('Cache busted ' + file);
  }
});
