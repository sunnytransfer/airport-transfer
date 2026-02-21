import fs from 'fs';
import zlib from 'zlib';
const p = 'c:/Users/Samsung/.gemini/antigravity/scratch/transport-booking-app/client/dist/assets';
const js = fs.readdirSync(p).filter(x => x.endsWith('.js'));
function brotli(buf) { return zlib.brotliCompressSync(buf, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 } }); }
const rows = [];
for (const f of js) {
    const b = fs.readFileSync(p + '/' + f);
    const gz = zlib.gzipSync(b);
    const br = brotli(b);
    rows.push({ f, raw: b.length, gzip: gz.length, brotli: br.length });
}
rows.sort((a, b) => b.brotli - a.brotli);
for (const r of rows) {
    const kb = x => (x / 1024).toFixed(1);
    console.log(`${r.f}\traw ${kb(r.raw)} KB\tgzip ${kb(r.gzip)} KB\tbrotli ${kb(r.brotli)} KB`);
}
