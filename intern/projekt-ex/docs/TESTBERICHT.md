# Testbericht

Stand: 7. November 2026, lokal auf diesem Arbeitsstand. Kein Deploy, keine öffentliche Vorschau-URL.

## Automatisch

Befehl: `npm test` in `intern/projekt-ex`  
Laufzeit: Node.js 22.23.4, `node:sqlite`, ohne zusätzliche Laufzeitpakete.

Ergebnis: 15 Tests, 0 Fehler. Abgedeckt sind:

- Ablehnung eines schwachen `SESSION_SECRET` und von `NODE_ENV=production` ohne `COOKIE_SECURE=1`
- Ersteinrichtung, Anmeldung, Abmeldung, CSRF, geschützte Seiten
- Ablehnung einer fremden Herkunft (`Sec-Fetch-Site: cross-site`)
- Beispieldatensatz gegen die freigegebene Rechnung: 420 versendet, 41 %, 6,2 %, 186 / 92 Kontakte, Themen 64 / 41 und 28 / 19, 134 Gespräche, 27 Leads, Aufträge 5 / 8 / 6 / 14, 48.600 €
- Echtbetrieb bleibt 0, solange nur Beispieldaten existieren; Umsatz lässt unbestätigte Aufträge weg
- Zusammenführen derselben E-Mail im selben Datensatz, nicht über die Datensatzgrenze
- Telefon-Webhook: fehlende Signatur 401, gültige Signatur 202, Wiederholung 200 ohne zweite Zeile, Schreiben nur nach `dataset=real`
- E-Mail-Webhook ohne Geheimnis: 503
- Meta: Verify-Token, Signatur, Status bleibt `disconnected` / „Konfiguriert, nicht verbunden“
- Freigabe setzt `approved_not_dispatched`, `recorded_sent_at` bleibt leer, `decideApproval` enthält keinen Versandaufruf
- CMS lehnt `status=published` ab, Vorschau ist nur nach Anmeldung erreichbar
- `intern/` ist in `_config.yml` und in `tools/launch_build.py` ausgeschlossen

Zusätzlich geprüft: `launch_build.public('intern/projekt-ex/...')` ist falsch, `index.html` bleibt öffentlich.

## Im Browser

Headless Chrome über Playwright, gegen einen lokalen Prozess auf `127.0.0.1` mit frischer Datenbank und `npm run seed:example`. Kein öffentlicher Host.

Gesehene Wege: Einrichtung, Dashboard Beispieldaten (Desktop und 390 px Breite), Verbindungen, Kundenverlauf, Entwurf, interne Vorschau, Freigabe, Wechsel in den leeren Echtbetrieb, Anmeldung.

Die Bilddateien liegen bei den Prüfartefakten dieses Laufs, nicht im Website-Paket.

## Nicht geprüft

- Ein echter Anbieter, ein echtes Telefon, Meta, ein Postfach oder der öffentliche Chat. Dafür gibt es keine Zugangsdaten, und diese Fassung verbindet sie nicht.
- Betrieb hinter HTTPS, Backup, mehrere gleichzeitige Prozesse.
- Darstellung der nativen Datumsfelder hängt an der Sprache des Rechners. Die gespeicherte Zeit ist unabhängig davon.
