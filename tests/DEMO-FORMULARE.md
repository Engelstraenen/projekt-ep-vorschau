# Demo-Formulare: lokaler Datenschutztest

## Umfang

11 Demo-Eingabebereiche wurden von `form` auf `div` umgestellt:
FELD, LUMEN, QUARTIER, HOLM, VOLTA, WÄRMEWERK-Anfrage,
NIVORA-Newsletter (Start und Shop), ORBIT (Referenz und Vorschau)
und Löschservice-Profilvorschau. Zusätzlich ist der lokale
WÄRMEWERK-Konfigurator kein Formular mehr; seine Berechnung bleibt erhalten.

Ohne `form` gibt es auch ohne JavaScript keinen nativen GET-/POST-Submit.
Die Bestätigungsbuttons sind `type="button"`; der gemeinsame Handler zeigt
nur eine lokale Demo-Bestätigung. Es gibt kein neues Backend und keine
Speicherung der Eingaben durch die Seite. Der Löschservice übergibt keine
Profilangaben mehr per URL. NIVORAs statisches HTML, React-Code und
CSS-Selektoren wurden gemeinsam angepasst, damit die Hydrierung keine
Formulare wiederherstellt. Demo-Hinweise und betroffene Datenschutzhinweise
wurden angeglichen.

**Abgrenzung:** Das eigenständige Kontaktformular in `kontakt.html` ist kein
Referenz-Demoformular und bleibt unverändert (bestehendes Mailto-/POST-Konzept).
Sein No-JS-/Produktionsverhalten ist nicht durch diesen Test freigegeben.
Die übrigen rechtlichen und Betreiber-Blocker bleiben offen.

## Reproduzieren

Python mit Playwright und dessen Chromium verwenden:

```sh
python3 -m pip install playwright
python3 -m playwright install chromium
# Aus dem Repository-Verzeichnis:
SITE_ROOT=$(mktemp -d)
ln -s "$PWD" "$SITE_ROOT/projekt-ep-vorschau"
python3 -m http.server 8879 --bind 127.0.0.1 --directory "$SITE_ROOT"
# In einer zweiten Shell im Repository-Verzeichnis:
python3 tests/demo_forms_privacy.py
```

`DEMO_BASE_URL` kann den lokalen Basislink einschließlich abschließendem `/`
überschreiben. `DEMO_FORM_REPORT` setzt den JSON-Ausgabepfad
(Standard `/tmp/demo-form-results.json`).

Getestet werden Chromium Headless mit JavaScript und
`java_script_enabled=False`, ausschließlich mit fiktiven Daten:
Enter je einzeiligem Eingabefeld (auch Konfigurator-Regler), Bestätigungsbutton,
Reload, unveränderte URL, keine Eingaben in Request-URL/-Body/-Headern,
keine Schreibrequests und keine Eingaben in Local-/SessionStorage.
Geschlossene ORBIT-Dialoge werden als Testfixture geöffnet, auch im No-JS-Lauf;
die Erreichbarkeit des Dialogs ohne JavaScript wird dadurch nicht behauptet.

## Lokales Ergebnis am 08.11.2026 (Europe/Berlin)

- **24/24 Fälle bestanden:** 12 Bereiche, jeweils mit und ohne JavaScript.
- **50 Enter-Prüfungen, 22 Buttonklicks, 24 Reloads.**
- URL jeweils unverändert; keine fiktiven Eingaben in Requests oder Seitenspeichern.
- Keine unerwarteten Browserfehler; LUMEN-Livezusammenfassung und
  NIVORA-Hydrierung ebenfalls ohne Fehler.
- Für einen reproduzierbaren Datenschutzlauf ist WebGL deaktiviert:
  softwaregerendertes QUARTIER-WebGL blockierte den ersten Lauf.
  Der dadurch stehenbleibende QUARTIER-Preloader (`.veil`) wird ausschließlich als Testfixture entfernt, damit echte Buttonklicks möglich sind. Die erwartete QUARTIER-WebGL-Kontextmeldung wird dokumentiert,
  aber nicht als Formularfehler gewertet. Dies ist kein visueller WebGL-Abnahmetest.
- Normale Ressourcenabrufe einschließlich Reload/Medien bleiben erlaubt;
  es wird nicht behauptet, dass die Seite keine Netzwerkanfragen ausführt.
- JavaScript-Syntaxprüfungen und `git diff --check` bestanden.

Nur lokal geprüft und committet; nicht gepusht und nicht produktiv freigegeben.
