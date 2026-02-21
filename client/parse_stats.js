const fs = require('fs');

const html = fs.readFileSync('stats.html', 'utf8');
const counts = new Map();
const re = /"name":"([^"]*node_modules\/[^"]+)"/g;

let m;
while ((m = re.exec(html)) !== null) {
    const path = m[1];
    const pkgNameStr = path.split('node_modules/')[1];
    if (!pkgNameStr) continue;

    const pkgParts = pkgNameStr.split('/');
    const pkg = pkgParts[0].startsWith('@') ? pkgParts.slice(0, 2).join('/') : pkgParts[0];

    counts.set(pkg, (counts.get(pkg) || 0) + 1);
}

const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 30);
console.table(top);
