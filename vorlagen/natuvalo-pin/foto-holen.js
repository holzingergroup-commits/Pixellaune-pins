// Sucht CC0-Fotos von StockSnap über Openverse und lädt sie in Pin-Auflösung.
// Suche:  node foto-holen.js suche "christmas wreath"
//         -> Liste: StockSnap-ID | Openverse-UUID | Titel | Fotograf | Seite
// Laden:  node foto-holen.js laden <Openverse-UUID> <StockSnap-ID> [fotoordner]
//         -> speichert <fotoordner>/<StockSnap-ID>.jpg (ca. 960 px breit)
// Nutzt curl (der StockSnap-CDN blockt Direktdownloads, der Openverse-Thumb-Endpunkt nicht).
const {execFileSync} = require('child_process');
const fs = require('fs'), path = require('path');
const curl = u => execFileSync('curl', ['-sSfL', u], {maxBuffer: 50e6});
const [cmd, a, b, c] = process.argv.slice(2);
if (cmd === 'suche' && a) {
  const u = 'https://api.openverse.org/v1/images/?' + new URLSearchParams({q: a, license: 'cc0', source: 'stocksnap', page_size: '20'});
  const d = JSON.parse(curl(u));
  for (const r of d.results) {
    const sid = r.url.split('/').pop().split('.')[0];
    console.log([sid, r.id, r.title, r.creator || '', r.foreign_landing_url].join(' | '));
  }
} else if (cmd === 'laden' && a && b) {
  const dir = c || 'fotos';
  fs.mkdirSync(dir, {recursive: true});
  const meta = JSON.parse(curl('https://api.openverse.org/v1/images/' + a + '/'));
  if (meta.license !== 'cc0' || meta.source !== 'stocksnap') { console.error('Abbruch: nicht CC0/StockSnap:', meta.license, meta.source); process.exit(1); }
  fs.writeFileSync(path.join(dir, b + '.jpg'), curl('https://api.openverse.org/v1/images/' + a + '/thumb/?full_size=true'));
  console.log('gespeichert', path.join(dir, b + '.jpg'), '|', meta.title, '|', meta.foreign_landing_url);
} else {
  console.error('Aufruf: node foto-holen.js suche "<begriff>"  |  node foto-holen.js laden <uuid> <stocksnap-id> [ordner]');
  process.exit(2);
}
