/* Unterseiten je Haltepunkt. Daten: allgemeine Fachwerte zur Orientierung (konzepte/branchendaten.md). */
(() => {
  const S = {
    abgas: { nr: '01', vor: 'Schicht 01 · Abgasstutzen', titel: 'Sauber verbunden.', bild: 'rohr', anker: 'schichten',
      lead: 'Der Abgasstutzen verbindet den Ofen über das Rauchrohr mit dem Schornstein. Hier entscheidet sich, ob der Ofen gut zieht – und ob er sicher ist.',
      fakten: [['120–150 mm', 'übliche Rauchrohr-Durchmesser bei Kaminöfen'], ['ca. 12 Pa', 'typischer Förderdruck, den ein Kaminofen braucht'], ['1 Prüföffnung', 'für die Messung durch den Schornsteinfeger']],
      text: [['Oben oder hinten', 'Ob das Rohr oben oder hinten aus dem Ofen kommt, hängt vom Raum ab. Wir planen die Leitung so kurz und gerade wie möglich – jeder Bogen kostet Zug.'],
        ['Die Wanddurchführung', 'Ein Wandfutter und eine Rosette sorgen für einen dichten, sauberen Anschluss am Schornstein. Bei brennbaren Wänden gelten zusätzliche Abstände und Dämmungen.'],
        ['Schornstein zuerst prüfen', 'Querschnitt, Höhe und Zustand des Schornsteins bestimmen, welcher Ofen überhaupt passt. Darum prüfen wir den Schornstein, bevor Sie sich in ein Modell verlieben.']],
      dia: { titel: 'Was den Zug beeinflusst', zeilen: [['Schornsteinhöhe', .9, 'groß'], ['Querschnitt', .75, 'groß'], ['Bögen im Rohr', .45, 'mittel'], ['Außentemperatur', .35, 'gering']] },
      faq: [['Kann ich einen bestehenden Schornstein nutzen?', 'Oft ja. Ob er geeignet ist und ob ein weiterer Ofen angeschlossen werden darf, klären wir vorab mit dem bevollmächtigten Bezirksschornsteinfeger.'], ['Was, wenn kein Schornstein da ist?', 'Dann ist meist ein Edelstahlschornstein an der Außenwand die Lösung. Wir planen Lage, Höhe und Durchführungen mit.']] },
    konvektion: { nr: '02', vor: 'Schicht 02 · Konvektionskanäle', titel: 'Wärme, die sich verteilt.', bild: 'explode', anker: 'schichten',
      lead: 'Zwischen Brennraum und Verkleidung strömt Raumluft nach oben, erwärmt sich und verteilt sich im Zimmer. So wird es schnell warm – auch in den Ecken.',
      fakten: [['2 Wege', 'Wärme als warme Luft (Konvektion) und als Strahlung'], ['schnell', 'Konvektion erwärmt den Raum in kurzer Zeit'], ['angenehm', 'Strahlung wärmt wie die Sonne – direkt auf der Haut']],
      text: [['Konvektion oder Strahlung?', 'Stahlöfen geben viel Wärme über die Luft ab und heizen schnell. Speichersteine und Kacheln setzen stärker auf Strahlung. Diese Wärme fühlt sich milder an und wirbelt weniger Staub auf.'],
        ['Der richtige Mix für Ihren Raum', 'Offene Wohnbereiche profitieren von Konvektion. In kleineren Räumen oder bei langen Abenden ist mehr Strahlung und Speicherung angenehmer.']],
      dia: { titel: 'Typischer Wärmeanteil je Bauart', zeilen: [['Stahl-Kaminofen', .7, 'viel Konvektion'], ['Mit Speichersteinen', .5, 'ausgewogen'], ['Kachel- / Grundofen', .25, 'viel Strahlung']] },
      faq: [['Wird es mit Konvektion staubig?', 'Ein gut eingestellter Ofen mit sauberer Verbrennung verursacht kaum Staubaufwirbelung. Wer empfindlich ist, wählt einen Ofen mit hohem Strahlungsanteil.']] },
    speicher: { nr: '03', vor: 'Schicht 03 · Wärmespeichersteine', titel: 'Stein speichert Zeit.', bild: 'speicher', anker: 'speicher',
      lead: 'Speichersteine aus Speckstein oder Schamotte nehmen die Wärme des Feuers auf und geben sie über Stunden wieder ab – lange nachdem die letzten Flammen erloschen sind.',
      fakten: [['4–12 h', 'Wärmeabgabe je nach Speichermasse'], ['50–200 kg', 'übliche Speichermasse bei Kaminöfen'], ['bis 24 h', 'bei gemauerten Grundöfen mit großer Masse']],
      text: [['Warum Speckstein?', 'Speckstein ist dicht, schwer und leitet Wärme gleichmäßig. Er wird beim Heizen warm, aber nicht glühend heiß, und gibt die Energie langsam ab.'],
        ['Weniger nachlegen', 'Mit Speicher reicht oft ein Abbrand am Abend für einen warmen Raum bis in die Nacht. Das spart Holz und Zeit.'],
        ['Nachrüsten?', 'Bei vielen Modellen lassen sich Speichermodule nachträglich einsetzen. Wir prüfen, ob Ihr Ofen dafür ausgelegt ist.']],
      dia: { titel: 'Wie lange es warm bleibt (typisch)', zeilen: [['Stahl-Kaminofen', .1, '1–2 h'], ['Kaminofen mit Speicher', .35, '4–8 h'], ['Kachelofen', .45, '6–10 h'], ['Grundofen', 1, '12–24 h']] },
      faq: [['Wird der Raum mit Speicher langsamer warm?', 'Etwas, ja. Die erste Wärme kommt über die Luft, die Speichersteine laden sich parallel auf und übernehmen später.'], ['Ist Speckstein empfindlich?', 'Speckstein ist weich, aber robust. Kleine Kratzer lassen sich mit feinem Schleifpapier wieder entfernen.']] },
    verkleidung: { nr: '04', vor: 'Schicht 04 · Verkleidung', titel: 'Ein Ofen. Ihr Stil.', bild: 'stil', anker: 'stil',
      lead: 'Die Verkleidung gibt dem Ofen seinen Charakter – und beeinflusst, wie er wärmt. Speckstein, Keramik oder Stahl: gleiche Technik, verschiedene Persönlichkeiten.',
      fakten: [['Speckstein', 'natürlich, speichert nach'], ['Keramik', 'glatt, hell, leicht zu pflegen'], ['Stahl', 'klar, reduziert, schnell warm']],
      text: [['Speckstein', 'Jede Platte ist ein Unikat mit eigener Maserung. Wärmt spürbar nach und passt in moderne wie klassische Räume.'],
        ['Keramik', 'Glasierte Ofenkeramik in Weiß, Creme oder Farbe. Pflegeleicht und mit milder Strahlungswärme.'],
        ['Stahl', 'Pulverbeschichtet, meist in Schwarz oder Grau. Wird schnell warm und wirkt besonders klar.'],
        ['Gemauert und verputzt', 'Bei gebauten Öfen sind fast alle Oberflächen möglich: Kalkputz, Lehm, Naturstein oder Kacheln nach Ihrem Entwurf.']],
      dia: { titel: 'Eigenschaften im Vergleich', zeilen: [['Speicherwirkung Speckstein', .85, 'hoch'], ['Speicherwirkung Keramik', .6, 'mittel'], ['Speicherwirkung Stahl', .2, 'gering'], ['Aufheizen Stahl', .95, 'sehr schnell']] },
      material: [
        { key: 'speckstein', name: 'Speckstein', satz: 'Natürlich. Zeitlos.', text: 'Naturstein mit eigener Maserung. Wird warm, aber nicht heiß, und gibt die Wärme über Stunden ab.', gut: 'Lange Abende, wenig Nachlegen', werte: [5, 2, 4, 2] },
        { key: 'keramik', name: 'Keramik', satz: 'Klar. Elegant.', text: 'Glasierte Ofenkeramik mit seidigem Glanz. Milde Strahlungswärme, sehr leicht zu reinigen.', gut: 'Helle Räume, pflegeleicht', werte: [4, 3, 5, 4] },
        { key: 'stahl', name: 'Stahl', satz: 'Pur. Charakterstark.', text: 'Pulverbeschichteter Stahl mit klarer Kante. Wird schnell warm und bringt die Wärme sofort in den Raum.', gut: 'Schnelle Wärme, klare Architektur', werte: [1, 5, 4, 2] },
        { key: 'putz', ofen: 'kachel', name: 'Kachel & Putz', satz: 'Gebaut. Einzigartig.', text: 'Für gebaute Öfen: Kalkputz, Lehm oder Kacheln nach Ihrem Entwurf, mit Sitzbank, Nische oder Holzlager.', gut: 'Grundofen, Kachelofen, Unikate', werte: [5, 1, 3, 5] }],
      faq: [['Kann ich die Verkleidung später tauschen?', 'Bei manchen Modellen ja. Wir sagen Ihnen vorher, welche Varianten es für Ihr Modell gibt.']] },
    brennraum: { nr: '05', vor: 'Schicht 05 · Brennraum', titel: 'Feuer, gut geführt.', bild: 'feuer', anker: 'feuer',
      lead: 'Der Brennraum ist das Herz des Ofens. Eine Auskleidung aus Schamotte oder Vermiculite hält die Temperatur hoch – die Voraussetzung für saubere Verbrennung.',
      fakten: [['600–900 °C', 'typische Temperaturen im Brennraum'], ['über 80 %', 'Wirkungsgrad moderner Kaminöfen'], ['0,04 g/m³', 'Staub-Grenzwert 1. BImSchV Stufe 2']],
      text: [['Primär-, Sekundär-, Tertiärluft', 'Primärluft von unten bringt das Feuer in Gang. Sekundärluft strömt über die Scheibe und verbrennt die Holzgase ein zweites Mal. Manche Öfen haben zusätzlich Tertiärluft für einen sauberen Ausbrand.'],
        ['Richtig anheizen', 'Von oben anzünden, kleines trockenes Holz, Luft ganz auf. Erst wenn das Feuer kräftig brennt, die Luft reduzieren. Holz mit weniger als 20 % Restfeuchte verwenden – gesetzlich gilt unter 25 %.'],
        ['Alte Öfen', 'Für ältere Öfen gelten Fristen zur Nachrüstung oder Stilllegung. Wir prüfen das Typenschild und sagen Ihnen, was für Ihren Ofen gilt.']],
      dia: { titel: 'Grenzwerte 1. BImSchV Stufe 2', zeilen: [['Kaminofen · Staub', .4, '0,04 g/m³'], ['Pelletofen · Staub', .3, '0,03 g/m³'], ['Kaminofen · CO', .62, '1,25 g/m³'], ['Pelletofen · CO', .13, '0,25 g/m³']] },
      faq: [['Was ist Schamotte?', 'Ein feuerfester, gebrannter Ton. Er speichert Wärme im Brennraum und schützt den Stahlkorpus. Schamottesteine nutzen sich ab und werden bei Bedarf getauscht.'], ['Woran erkenne ich gute Verbrennung?', 'Helle, lebendige Flammen, kaum sichtbarer Rauch am Schornstein und eine klare Scheibe.']] },
    glas: { nr: '06', vor: 'Schicht 06 · Glasfront', titel: 'Klare Sicht aufs Wesentliche.', bild: 'glas', anker: 'schichten',
      lead: 'Die Sichtscheibe aus Glaskeramik hält extreme Temperaturen aus. Eine Luftspülung sorgt dafür, dass sie lange klar bleibt.',
      fakten: [['ca. 750 °C', 'Temperaturbeständigkeit von Glaskeramik'], ['Scheibenspülung', 'Luftschleier hält Ruß von der Scheibe fern'], ['1 Griff', 'selbstschließende Türen sind bei vielen Öfen Pflicht']],
      text: [['Warum die Scheibe verrußt', 'Zu feuchtes Holz, zu wenig Luft oder zu kleine Feuer. Mit trockenem Holz und offener Luftzufuhr in der Anheizphase bleibt die Scheibe meist klar.'],
        ['Reinigen', 'Kalt reinigen, mit feuchtem Küchenpapier und etwas weißer Asche. Keine scharfen Reiniger auf Dichtungen.']],
      dia: { titel: 'Was die Scheibe klar hält', zeilen: [['Trockenes Holz', 1, 'wichtigster Punkt'], ['Luft beim Anheizen', .8, 'ganz auf'], ['Passende Ofengröße', .6, 'kein Drosselbetrieb']] },
      faq: [['Kann die Scheibe springen?', 'Glaskeramik ist sehr robust. Risse entstehen meist durch mechanische Spannung, z. B. ein Holzscheit, das gegen die Scheibe drückt.']] },
    sockel: { nr: '07', vor: 'Schicht 07 · Sockel', titel: 'Stabil und langlebig.', bild: 'hero', anker: 'schichten',
      lead: 'Der Sockel trägt das Gewicht – bei Öfen mit Speichersteinen schnell mehrere Hundert Kilo. Er kann drehbar sein, ein Holzfach haben oder die Verbrennungsluft von außen holen.',
      fakten: [['100–400 kg', 'Gewicht vieler Kaminöfen mit Speicher'], ['Außenluft', 'Anschluss für raumluftunabhängigen Betrieb'], ['Bodenplatte', 'Funkenschutz vor der Feuerraumöffnung']],
      text: [['Tragfähigkeit', 'Bei schweren Öfen prüfen wir die Tragfähigkeit der Decke – vor allem in Obergeschossen und Holzbalkendecken.'],
        ['Luft von außen', 'In dichten Häusern oder mit Lüftungsanlage holt sich der Ofen seine Verbrennungsluft über eine Leitung von außen. Dafür braucht es geeignete, zugelassene Geräte.'],
        ['Der Boden davor', 'Vor der Feuerraumöffnung muss ein nicht brennbarer Belag liegen: mindestens 50 cm nach vorn, 30 cm seitlich. Glas, Stein oder Stahl – passend zum Raum.']],
      dia: { titel: 'Häufige Sockel-Optionen', zeilen: [['Holzfach', .8, 'beliebt'], ['Drehfuß', .5, 'je Modell'], ['Außenluftanschluss', .9, 'oft nötig']] },
      faq: [['Brauche ich eine Bodenplatte?', 'Bei brennbaren Böden wie Parkett oder Teppich: ja. Bei Fliesen oder Stein meist nicht.']] },
    planung: { nr: '', vor: 'Planung', titel: 'Passt er rein?', bild: 'raum', anker: 'platz',
      lead: 'Leistung, Abstände, Schornstein, Boden: Eine gute Planung macht den Ofen sicher und den Raum schöner. Wir beginnen mit Ihren Fotos und kommen danach zum Aufmaß.',
      fakten: [['80 cm', 'Strahlungsbereich vor der Scheibe frei halten'], ['50 / 30 cm', 'nicht brennbarer Boden nach vorn / seitlich'], ['W pro m²', 'Heizlast bestimmt die richtige Leistung']],
      text: [['Leistung nach Raum', 'Faustwerte: Neubau rund 40–60 W pro m², sanierter Altbau rund 80 W, unsanierter Altbau 100–150 W. Ein Ofen sollte zum Raum passen, nicht zur größten Zahl im Prospekt.'],
        ['Abstände', 'Die genauen Abstände zu brennbaren Bauteilen stehen auf dem Typenschild. Wir zeichnen sie Ihnen im Raum ein, bevor bestellt wird.'],
        ['Was wir von Ihnen brauchen', 'Zwei, drei Fotos vom Raum und vom Schornstein, die Raumgröße und das Baujahr des Hauses. Mehr nicht.']],
      dia: { titel: 'Heizlast je m² (Faustwerte)', zeilen: [['Passivhaus', .1, '10–15 W'], ['Neubau', .35, '40–60 W'], ['Saniert', .55, 'ca. 80 W'], ['Altbau', 1, '100–150 W']] },
      faq: [['Brauche ich eine Genehmigung?', 'Neue Feuerstätten werden vor der Inbetriebnahme vom Schornsteinfeger abgenommen. Wir stimmen das vorher ab.'], ['Wie lange dauert es?', 'Vom ersten Gespräch bis zum ersten Feuer meist einige Wochen – je nach Modell, Schornstein und Jahreszeit. Im Herbst früh planen.']] },
    ofenbau: { nr: '', vor: 'Ofenbau', titel: 'Gebaut, nicht geliefert.', bild: 'grundofen-bau', bild2: 'kachelofen', anker: 'wege',
      lead: 'Kachelöfen, Grundöfen und Heizkamine entstehen bei Ihnen vor Ort – geplant für Ihren Raum, gesetzt von unseren Ofenbauern, Schicht für Schicht.',
      fakten: [['1–2 t', 'Speichermasse eines Grundofens'], ['12–24 h', 'Wärme nach einem Abbrand'], ['Unikat', 'Form, Oberfläche und Sitzbank nach Ihrem Entwurf']],
      text: [['Grundofen', 'Ein massiver Speicherofen aus Schamotte und Stein. Ein- bis zweimal am Tag heizen, den Rest erledigt die Masse – mit milder Strahlungswärme.'],
        ['Kachelofen', 'Mit Heizeinsatz und Kachelmantel, als Warmluft- oder Speicherofen. Kacheln in vielen Formen und Farben, auch großformatig und modern.'],
        ['Heizkamin', 'Ein Heizeinsatz mit großer Scheibe, verkleidet nach Wunsch. Viel Feuerbild, schnell warm.'],
        ['So bauen wir', 'Planung mit Zeichnung und Heizlast, Abstimmung mit dem Schornsteinfeger, Aufbau vor Ort in einigen Tagen bis zwei Wochen, Trocknung, erstes Feuer gemeinsam.']],
      dia: { titel: 'Wärmedauer nach dem Feuer (typisch)', zeilen: [['Heizkamin', .15, '1–3 h'], ['Kachelofen', .45, '6–10 h'], ['Grundofen', 1, '12–24 h']] },
      faq: [['Geht das auch im Bestand?', 'Ja, wenn Statik und Schornstein passen. Wir prüfen beides beim Aufmaß.'], ['Was kostet ein gebauter Ofen?', 'Das hängt von Größe, Material und Technik ab. Nach dem Aufmaß bekommen Sie ein festes Angebot.']] },
    ausstellung: { nr: '', vor: 'Ausstellung', titel: 'Feuer erleben, bevor Sie entscheiden.', bild: 'ausstellung', anker: 'ausstellung',
      lead: 'In unserer Ausstellung brennen die Öfen. Sie sehen das Flammenbild, spüren die Wärme und vergleichen Holz, Pellet und Gas direkt nebeneinander.',
      fakten: [['live', 'Öfen im Feuerbetrieb'], ['3 Brennstoffe', 'Holz, Pellet und Gas zum Vergleich'], ['1 Termin', 'mit Zeit für Ihre Fragen']],
      text: [['Was Sie mitbringen sollten', 'Fotos vom Raum und vom Schornstein, die ungefähre Raumgröße und Ihre Wünsche. Den Rest finden wir zusammen heraus.'],
        ['Von der Ausstellung ins Wohnzimmer', 'Lieferung, Anschluss, Abnahme durch den Schornsteinfeger und Einweisung beim ersten Feuer – alles aus einer Hand.']],
      dia: { titel: 'Brennstoffe im Vergleich (Heizwert)', zeilen: [['Buche, luftgetrocknet', .42, 'ca. 4,2 kWh/kg'], ['Holzpellets', .5, 'ca. 4,9 kWh/kg'], ['Erdgas', 1, 'ca. 10 kWh/m³']] },
      faq: [['Brauche ich einen Termin?', 'Nein, aber mit Termin haben wir Zeit nur für Sie und heizen die Öfen vor, die Sie sehen möchten.']] },
    ausbildung: { nr: '', vor: 'Karriere', titel: 'Wir bauen ihn wieder zusammen. Mit dir?', bild: 'werkstatt', anker: 'handwerk',
      lead: 'Ofen- und Luftheizungsbauer sind gefragt wie selten. Du arbeitest mit Stein, Stahl, Kachel und Feuer – und siehst am Abend, was du geschaffen hast.',
      fakten: [['3 Jahre', 'duale Ausbildung in Betrieb und Berufsschule'], ['Meister', 'Weiterbildung und eigener Betrieb möglich'], ['krisenfest', 'Handwerk, das nicht ins Ausland wandert']],
      text: [['Was du lernst', 'Öfen planen, Grundöfen setzen, Kacheln verarbeiten, Heizeinsätze und Rauchrohre anschließen, Abgaswerte verstehen und Kunden beraten.'],
        ['Wen wir suchen', 'Schüler mit Freude am Bauen, Gesellen aus dem Ofenbau, Fliesen- oder Metallhandwerk und Quereinsteiger, die anpacken wollen.'],
        ['Was wir bieten', 'Feste Crew, moderne Werkstatt und Werkzeuge, Firmenwagen für Montage, Weiterbildung bis zum Meister.']],
      dia: { titel: 'Dein Weg', zeilen: [['Ausbildung', .33, '3 Jahre'], ['Geselle', .55, 'ab Jahr 4'], ['Meister', .8, 'berufsbegleitend'], ['Eigene Projekte', 1, 'Leitung']] },
      faq: [['Brauche ich einen bestimmten Abschluss?', 'Nein. Freude am Handwerk und Zuverlässigkeit zählen mehr als Noten.'], ['Kann ich vorher ein Praktikum machen?', 'Ja, gern. Schreib uns einfach über die Bewerbung in 60 Sekunden.']] },
    impressum: { vor: 'Rechtliches', titel: 'Impressum', anker: 'start', lead: 'Demo-Webseite. Hier stehen auf der echten Seite Name, Anschrift, Vertretung, Kontakt, Registereintrag, Handwerkskammer und Umsatzsteuer-ID des Betriebs.' },
    datenschutz: { vor: 'Rechtliches', titel: 'Datenschutz', anker: 'start', lead: 'Diese Demo setzt keine Cookies, lädt keine Schriften oder Skripte von fremden Servern und speichert keine Formulareingaben. Fotos im Planer „Passt er rein?“ bleiben auf Ihrem Gerät.' }
  };
  const REIHE = ['abgas', 'konvektion', 'speicher', 'verkleidung', 'brennraum', 'glas', 'sockel'];
  const Q = new URLSearchParams(location.search); const key = S[Q.get('s')] ? Q.get('s') : 'abgas'; const d = S[key];
  const firma = (Q.get('firma') || '').trim().slice(0, 40);
  const keep = new URLSearchParams(); Q.forEach((v, k) => { if (k !== 's') keep.set(k, v); });
  const ks = keep.toString(), q = ks ? '?' + ks : '';
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  document.title = d.titel + ' – ' + (firma || 'FEUERRAUM');
  const z = document.getElementById('zurueck'); z.href = 'index.html' + q + '#' + d.anker;
  document.querySelectorAll('a.logo').forEach(a => a.href = 'index.html' + q);
  let h = '';
  h += d.bild ? `<section class="u-held"><img src="assets/img/${d.bild}.webp" srcset="assets/img/${d.bild}-m.webp 1280w, assets/img/${d.bild}.webp 2560w" sizes="100vw" alt="" onerror="this.remove()">` : '<section class="u-held ohne">';
  h += `<div class="u-titel"><p class="vorzeile">${esc(d.vor)}</p><h1 class="h2">${esc(d.titel)}</h1><p class="u-lead">${esc(d.lead)}</p></div></section>`;
  if (d.fakten) h += '<section class="u-fakten">' + d.fakten.map(([a, b]) => `<div><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join('') + '</section>';
  if (d.material) {
    const K = ['Speicherwärme', 'Schnell warm', 'Pflegeleicht', 'Gestaltung'];
    const pkt = n => '<span class="pkt" aria-hidden="true">' + [1, 2, 3, 4, 5].map(i => `<i class="${i <= n ? 'an' : ''}"></i>`).join('') + '</span>';
    h += '<section class="mat"><div class="mat-kopf"><p class="vorzeile">Vier Oberflächen</p><h2 class="h2">Fühlen Sie den Unterschied.</h2><p>Antippen zeigt den Ofen im jeweiligen Material.</p></div><div class="mat-reihe">' + d.material.map((m, i) => `
      <article class="mat-karte" tabindex="0" aria-label="${esc(m.name)}">
        <div class="mat-bild"><img class="mat-nah" src="assets/img/mat-${m.key}-m.webp" alt="Nahaufnahme ${esc(m.name)}" loading="lazy" onerror="this.closest('.mat-karte').classList.add('ohne-nah');this.remove()"><img class="mat-ofen" src="assets/img/ofen-${m.ofen || m.key}.webp" alt="Ofen mit Verkleidung aus ${esc(m.name)}" loading="lazy"><span class="mat-nr">0${i + 1}</span><span class="mat-tipp">Am Ofen ansehen</span></div>
        <h3>${esc(m.name)}</h3><p class="mat-satz">${esc(m.satz)}</p><p class="mat-text">${esc(m.text)}</p>
        <dl>${K.map((k, j) => `<div><dt>${k}</dt><dd>${pkt(m.werte[j])}<span class="sr">${m.werte[j]} von 5</span></dd></div>`).join('')}</dl>
        <p class="mat-gut"><b>Gut für</b> ${esc(m.gut)}</p>
      </article>`).join('') + '</div></section>';
  }
  if (d.text) {
    h += '<section class="u-inhalt"><div>' + d.text.map(([t, p]) => `<h2>${esc(t)}</h2><p>${esc(p)}</p>`).join('');
    if (d.bild2) h += `<img src="assets/img/${d.bild2}-m.webp" alt="" style="border-radius:16px;margin-top:28px;aspect-ratio:16/9;object-fit:cover;width:100%" onerror="this.remove()">`;
    h += '</div><aside class="u-seite">';
    if (d.dia) h += `<div class="u-dia" id="dia"><h3>${esc(d.dia.titel)}</h3><p class="mini leise">Allgemeine Orientierung</p>` + d.dia.zeilen.map(([a, v, t]) => `<div class="zeile"><span>${esc(a)}</span><i style="--v:${v}"></i><em>${esc(t)}</em></div>`).join('') + '</div>';
    h += `<div class="u-cta"><h3>Lieber persönlich?</h3><p>Wir beraten Sie in der Ausstellung oder bei Ihnen zu Hause.</p><a class="knopf" href="index.html${q}#termin">Termin anfragen →</a></div></aside></section>`;
  }
  if (d.faq) h += '<section class="u-faq"><h2 class="h2" style="font-size:clamp(28px,3vw,40px);margin-bottom:12px">Häufige Fragen</h2>' + d.faq.map(([f, a]) => `<details><summary>${esc(f)}</summary><p>${esc(a)}</p></details>`).join('') + '</section>';
  const i = REIHE.indexOf(key);
  if (i >= 0) { const p = REIHE[(i + 6) % 7], n = REIHE[(i + 1) % 7]; h += `<nav class="u-weiter" aria-label="Weitere Schichten"><a href="schicht.html?s=${p}${ks ? '&' + ks : ''}"><span>← Schicht ${S[p].nr}</span><b>${esc(S[p].vor.split('· ')[1])}</b></a><a href="schicht.html?s=${n}${ks ? '&' + ks : ''}"><span>Schicht ${S[n].nr} →</span><b>${esc(S[n].vor.split('· ')[1])}</b></a></nav>`; }
  document.getElementById('u').innerHTML = h;
  if (firma) document.querySelectorAll('[data-firma]').forEach(e => e.textContent = firma);
  document.querySelectorAll('.mat-karte').forEach(k => { const f = () => k.classList.toggle('am-ofen'); k.addEventListener('click', f); k.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); f(); } }); });
  const dia = document.getElementById('dia');
  if (dia) { const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { dia.classList.add('an'); io.disconnect(); } }), { threshold: .3 }); io.observe(dia); }
})();
