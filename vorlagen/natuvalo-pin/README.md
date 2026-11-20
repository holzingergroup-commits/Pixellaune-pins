# Natuvalo-Pin-Vorlage

Mit dieser Vorlage entstanden die Natuvalo-Pins C14–C20 (17.–23.11.2026). Sie erzeugt Pinterest-Pins als JPG im Format 1000 × 1500 px (2:3).

| Datei | Zweck |
|---|---|
| `vorlage.html` | HTML/CSS-Layout mit Platzhaltern `{IMG}`, `{KICKER}`, `{TITLE}`, `{SUB}`, `{ITEMS}`, `{DENSE}` |
| `render.js` | Rendert alle Pins einer JSON-Datei mit Playwright (Chromium) und prüft dabei Überlauf und Schriften |
| `foto-holen.js` | Sucht CC0-Fotos von StockSnap über Openverse und lädt sie herunter |
| `beispiel-pins.json` | Zwei echte Beispiele (C14, C15) als Muster für das Eingabeformat |
| `beispiel-c14.jpg` | Referenzbild: so muss C14 aus `beispiel-pins.json` aussehen |

## Layout

- **Foto:** Es liegt oben, 1000 × 760 px, Zuschnitt `cover`, und läuft nach unten weich in den Hintergrund aus.
- **Karte:** Sie reicht von 570 px oben bis 110 px unten, mit 50 px Seitenrand. Die Karte ist `#fcf8f3`, der Hintergrund `#f4ede4`.
- **Kicker:** Inter Bold, 22 px, Großbuchstaben, Rot `#a3342c`.
- **Titel:** DM Serif Display, 76 px, Dunkelgrün `#1f3a2c`.
- **Untertitel:** Inter, 27 px.
- **Liste:** Nummerierte Punkte in grünen Kreisen, Inter 30 px. Der fett gesetzte Anfang ist der Stichpunkt, danach folgt die Ergänzung. Ab 7 Punkten wird die Liste automatisch enger gesetzt (`dense`).
- **Footer:** `NATUVALO · pinterest.de/natuvalo`, zentriert, 20 px.

## Eingabeformat (pins.json)

```json
[{"file": "p21-beispiel", "photo": "FPKEVOM0F8",
  "kicker": "Weihnachtsdeko DIY",
  "title": "Adventskranz natürlich selber binden",
  "sub": "In 6 Schritten mit Zweigen aus Garten & Wald",
  "items": [["Strohrömer oder Weidenring", "als Basis"], ["…", "…"]]}]
```

- `file` ist der Dateiname ohne `.jpg`.
- `photo` ist der Dateiname des Fotos ohne `.jpg` im Fotoordner, bei StockSnap die StockSnap-ID.
- Die Texte werden HTML-escaped, `&` und `<` sind also unproblematisch.

**Richtwerte für die Textlänge, sonst läuft die Karte über:**

- Titel: höchstens etwa 36 Zeichen (2 Zeilen)
- Untertitel: höchstens etwa 50 Zeichen
- Liste: 6 bis 8 Punkte, je Punkt (Stichpunkt und Ergänzung zusammen) höchstens etwa 48 Zeichen

`render.js` meldet einen Überlauf in jedem Fall.

## Rendern

Voraussetzungen: Node.js, das npm-Paket `playwright` mit Chromium, `curl` und Internetzugang. Die Schriften kommen von Google Fonts.

```bash
cd vorlagen/natuvalo-pin
# 1. Fotos suchen und laden (siehe unten), landen in fotos/
node foto-holen.js suche "christmas wreath"
node foto-holen.js laden 83bf2f61-942b-44f1-a18c-a4b4db4f0ac6 FPKEVOM0F8 fotos
# 2. Rendern
node render.js beispiel-pins.json fotos out
```

`render.js` beendet sich mit Exit-Code 1 und nennt den Pin, wenn ein Foto fehlt, der Text überläuft oder eine Schrift nicht geladen wurde. Solche Pins nicht verwenden. Die Ordner `fotos/` und `out/` sind in `.gitignore`. Fertige Pins werden wie bisher unter `2026-11/natuvalo/` (bzw. im passenden Monatsordner) abgelegt.

Für ChatGPT/Codex gilt: Die Vorlage ist eine reine HTML-Datei. Wer kein Playwright hat, kann sie mit einem anderen Headless-Chromium rendern (Viewport 1000 × 1500, Screenshot als JPG mit Qualität 88). Die Platzhalter werden wie in `render.js` ersetzt.

## Fotoquellen und Rechte

Regel: Drive „01 – Vorgehen“ §4, Rechte-Gate. Ohne belegte Rechte für Pinterest, Bearbeitung und kommerzielle/Affiliate-Nutzung wird ein Medium verworfen. Öffentlich zugänglich zu sein ist keine Freigabe.

- **Stockfotos:**
  - Bisher wurden nur **StockSnap-Fotos mit CC0-Lizenz** verwendet. Sie werden über die Openverse-API gesucht (`license=cc0`, `source=stocksnap`).
  - `foto-holen.js laden` bricht ab, wenn Openverse für das Bild nicht CC0/StockSnap meldet.
  - Der StockSnap-CDN blockt Direktdownloads. Darum wird über den Openverse-Thumb-Endpunkt geladen (`/v1/images/<uuid>/thumb/?full_size=true`, etwa 960 px breit), und zwar mit curl.
- **KI-Bilder:**
  - Für neu generierte Bilder ist laut 01 §4 Higgsfield der bevorzugte Weg.
  - Für Natuvalo/Affiliate gilt ein Budget von höchstens 60 Credits im Monat.
  - Ein solches Bild als `<name>.jpg` in den Fotoordner legen und in `photo` eintragen.
  - Der Herkunftsnachweis braucht zusätzlich Tool, Original und Anbieterbedingungen.
- **Schriften:** DM Serif Display und Inter stehen unter der SIL Open Font License und dürfen kommerziell genutzt werden.
- **Herkunftsnachweis je Foto:** StockSnap-ID, Titel, Fotograf, StockSnap-Seite, Lizenz CC0 und Abrufdatum. `foto-holen.js` gibt diese Angaben aus.
  - Im Repo stehen sie in `QUELLEN-<zeitraum>.md` neben den Pins (Beispiel: `2026-11/natuvalo/QUELLEN-17-23.md`).
  - In Drive gehören sie in die Kampagnen-02.
- Keine Motive mit erkennbaren Marken, Logos oder Gesichtern im Vordergrund verwenden. Keine Adventskalender-Motive (VBS-Test).

## Prüfschritte vor der Übergabe

1. `render.js` läuft ohne Meldung durch (kein Überlauf, Schriften geladen, alle Fotos da).
2. Jeden Pin als Bild ansehen: Text gut lesbar, Foto passt zum Thema, nichts abgeschnitten, Footer sichtbar.
3. Inhalt prüfen (01 §5): erst Nutzwert, keine unbelegten Produktaussagen, keine Preise oder Wirkversprechen. Bei Sicherheitsthemen einen Hinweis aufnehmen (z. B. Kerzen).
4. Rechtebeleg je Foto vorhanden (siehe oben).
5. Keine Affiliate-Links und keine Werbekennzeichnung ohne einen im Drive-Dokument „03 – Partner-Pool“ belegten Partner- und Werbeflächenstatus. Derzeit gilt eine Bewerbungspause (Founder, 12.11.).
6. Übergabe als Paket an die Prüfung in 04: Finalbild, Caption, Link/Clickref, Werbe- und KI-Flag, Rechtebelege, Zielkonto, Zeit in Europe/Berlin.
   - Jede Änderung braucht eine neue Prüfung.
   - Fehlen Rechte, gibt es ein Veto oder ist die Übergabe unklar, gilt STOP.
   - Eingeplant wird nur nach Founder-OK. Autonome Veröffentlichung bleibt gesperrt.

## Ablage

Renderdetails, Vorlagen und Produktionsdateien bleiben in diesem Repo, in Drive liegen keine Kopien davon. In Drive (`70 Natuvalo/Kampagnen/<Kampagne>/Medien/`) kommt nur die stabile Finalfassung je Pin, und zwar genau einmal, mit dem Namen `JJJJ-MM-TT – Pinterest natuvalo – <Titel>.jpg`.

## Freigabe und Zuständigkeit (Founder 20.11.2026)

- **Optik der Vorlage** ist freigegeben: „sieht gut aus, kann verwendet werden. zumindest von der optik, rechte unbedingt bitte immer vorher klären.“ Die Rechte werden also für jedes Bild vor dem Rendern geklärt und belegt.
- **Medien/ und 02-Rechtebelege** werden so gepflegt, wie es in Drive steht („drive ist die golden source“). Laut „00“ und „01“ liefert Claude Medien/ und schreibt 02, ChatGPT prüft in 04 und führt das Veröffentlichungsbuch.
- **Von ChatGPT erzeugte Bilder** (z. B. für C21–C47) dürfen nach Founder-Aussage kommerziell genutzt werden, wenn sicher belegt ist, dass sie von ChatGPT erzeugt wurden. Für den Herkunftsnachweis in 02 gilt deshalb:
  - Tool und Modell, Erstellungsdatum und Original-Datei oder Link zum Chat angeben.
  - Auf die OpenAI-Nutzungsbedingungen verweisen.
  - Ein KI-Flag setzen.
  - Ohne diesen Beleg wird das Bild nicht verwendet. C2PA-Metadaten zählen als Hinweis, aber nicht als Lizenz.
