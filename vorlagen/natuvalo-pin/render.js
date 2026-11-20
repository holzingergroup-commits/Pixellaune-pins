// Rendert Natuvalo-Pins (1000×1500 JPG) aus einer JSON-Datei mit vorlage.html.
// Aufruf: node render.js <pins.json> <fotoordner> <ausgabeordner>
// Beispiel: node render.js beispiel-pins.json fotos out
const {chromium} = require('playwright');
const fs = require('fs'), path = require('path');
const [pinsFile, fotoDir, outDir] = process.argv.slice(2);
if (!pinsFile || !fotoDir || !outDir) { console.error('Aufruf: node render.js <pins.json> <fotoordner> <ausgabeordner>'); process.exit(2); }
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
(async () => {
  const pins = JSON.parse(fs.readFileSync(pinsFile, 'utf8'));
  const tpl = fs.readFileSync(path.join(__dirname, 'vorlage.html'), 'utf8');
  fs.mkdirSync(outDir, {recursive: true});
  const b = await chromium.launch();
  const pg = await b.newPage({viewport: {width: 1000, height: 1500}});
  let fehler = 0;
  for (const x of pins) {
    const foto = path.join(fotoDir, x.photo + '.jpg');
    if (!fs.existsSync(foto)) { console.log('FOTO FEHLT', x.file, foto); fehler++; continue; }
    const img = 'data:image/jpeg;base64,' + fs.readFileSync(foto).toString('base64');
    const items = x.items.map(([a, c], i) => `<li><span class="n">${i+1}</span><span><b>${esc(a)}</b> ${esc(c)}</span></li>`).join('');
    const h = tpl.replace('{IMG}', img).replace('{KICKER}', esc(x.kicker)).replace('{TITLE}', esc(x.title))
      .replace('{SUB}', esc(x.sub)).replace('{ITEMS}', items).replace('{DENSE}', x.items.length > 6 ? 'dense' : '');
    await pg.setContent(h, {waitUntil: 'networkidle'});
    await pg.evaluate(() => document.fonts.ready);
    const st = await pg.evaluate(() => {
      const c = document.querySelector('.card');
      return {ov: c.scrollHeight > c.clientHeight,
              fonts: document.fonts.check('76px "DM Serif Display"') && document.fonts.check('30px Inter')};
    });
    if (st.ov) { console.log('ÜBERLAUF (Text zu lang)', x.file); fehler++; }
    if (!st.fonts) { console.log('SCHRIFT NICHT GELADEN', x.file); fehler++; }
    await pg.screenshot({path: path.join(outDir, x.file + '.jpg'), type: 'jpeg', quality: 88});
    console.log('ok', x.file);
  }
  await b.close();
  if (fehler) { console.log(fehler + ' Problem(e) – Pins nicht verwenden, bis behoben.'); process.exit(1); }
})();
