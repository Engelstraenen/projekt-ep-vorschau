# Umzugsplan: projekt-ep.de auf IONOS, danach Repo privat

Stand: 30.10.2026 · Status: ENTWURF, Freigabe durch Eugen nötig. Nichts davon ist bisher live umgestellt.

Ziel: Die Seite läuft unter https://projekt-ep.de bei IONOS (Webhosting, Apache). Der Code liegt danach nur noch in einem privaten GitHub-Repo. Die GitHub-Pages-Vorschau bleibt bis zum erfolgreichen Umzug unverändert online.

## Reihenfolge (jeder Schritt erst, wenn der vorige geprüft ist)

### 1. IONOS vorbereiten (keine Wirkung auf die Live-Vorschau)
- Webhosting-Paket mit PHP für projekt-ep.de prüfen (nur Domain reicht nicht).
- AV-Vertrag nach Art. 28 DSGVO im IONOS-Kundenkonto abschließen (Bereich Datenschutz / Auftragsverarbeitung). Datum notieren.
- Rechenzentrum-Standort und Log-Speicherdauer im Kundenkonto ablesen und in `datenschutz.html` eintragen.
- SSL-Zertifikat für `projekt-ep.de` UND `www.projekt-ep.de` aktivieren.
- DNS bei IONOS: A/AAAA für `@` und `www` auf den Webspace. MX-Einträge für das Postfach `kontakt@projekt-ep.de` nicht anfassen.
- Eigenen SFTP-Benutzer nur für den Deploy anlegen, mit eigenem Zielordner (z. B. `/projekt-ep/`). Domain im Kundenkonto auf diesen Ordner zeigen lassen.
- Host-Key des SFTP-Servers sichern: `ssh-keyscan <sftp-host>` → Secret `IONOS_SFTP_KNOWN_HOSTS`.

### 2. GitHub vorbereiten
- Settings → Environments → `production` anlegen, „Required reviewers“: Eugen.
- Dort die Secrets setzen: `IONOS_SFTP_HOST`, `IONOS_SFTP_USER`, `IONOS_SFTP_PASSWORD`, `IONOS_SFTP_PATH`, `IONOS_SFTP_KNOWN_HOSTS`. Zugangsdaten nie ins Repo schreiben.
- Workflow: `.github/workflows/deploy-ionos.yml` (nur manuell, Standard ist Probelauf `dry_run`).

### 3. Testlauf auf geschützter Test-Adresse
- Subdomain `test.projekt-ep.de` auf einen eigenen Ordner legen, per IONOS-Verzeichnisschutz (Basic Auth) sperren.
- Workflow mit `IONOS_SFTP_PATH` = Testordner laufen lassen (erst `dry_run`, dann echt).
- Prüfen: https://securityheaders.com, https://www.ssllabs.com/ssltest/, Lighthouse, Formular (Testanfrage kommt an), Consent-Banner (Ablehnen setzt nur `cc_cookie`), keine Drittanbieter-Requests, 404-Seite, Weiterleitungen http→https und www→ohne www.
- Wenn die Seite einen 500-Fehler zeigt: meist ein Modul in `.htaccess`. Datei per SFTP umbenennen, Zeile finden, erneut testen.

### 4. Go-live auf projekt-ep.de
- Pflichtdaten im Impressum stehen (Eugen trägt ein), Texte sind anwaltlich bzw. per Generator geprüft, ENTWURF-Hinweise entfernt.
- Vor dem Deploy Tag setzen: `git tag deploy-JJJJMMTT-HHMM && git push --tags` (Rollback-Punkt).
- Branch `audit-fixes` per Pull Request nach `main` mergen. Hinweis: Damit veröffentlicht GitHub Pages denselben Stand. Das ist unkritisch, weil alle Seiten per Canonical auf projekt-ep.de zeigen.
- Workflow mit Produktionsordner ausführen. Danach Checks aus Schritt 3 auf https://projekt-ep.de wiederholen.
- HSTS: am ersten Tag optional mit `max-age=300` starten, nach 1–2 stabilen Tagen auf `31536000` erhöhen. `preload` nur nach bewusster Entscheidung.
- Google Search Console und Bing Webmaster Tools: Domain bestätigen, `sitemap.xml` einreichen.

### 5. GitHub Pages ablösen
- Für 2–4 Wochen: auf `main` nur noch eine Weiterleitungsseite (Meta-Refresh + Canonical auf https://projekt-ep.de, `noindex`) und `robots.txt` mit `Disallow: /`. Echte 301 kann GitHub Pages nicht.
- Danach: Settings → Pages → „Unpublish site“.

### 6. Andere Vorschauen aus dem öffentlichen Repo
- `steak-seite/` und künftige Kunden-Vorschauen gehören nicht auf projekt-ep.de (der Deploy schließt sie aus, `.htaccess` liefert 404).
- Neuer Ort für Kunden-Vorschauen: privates Repo (z. B. GROKBOT-STEAKSEITE) plus geschützte Vorschau-Adresse, z. B. `vorschau.projekt-ep.de` bei IONOS mit Verzeichnisschutz und `noindex`. Eugen entscheidet.

### 7. Repo privat stellen (erst nach Schritt 4 und 5)
- Settings → General → Danger Zone → Change visibility → Private.
- Achtung: Im kostenlosen GitHub-Plan endet damit GitHub Pages für dieses Repo. Deshalb erst danach.
- Die öffentliche Git-Historie enthält bis dahin auch entfernte Vorschauen (`hq-showcase/`, ältere `steak-seite/`-Stände). Mit dem Privatstellen sind sie nicht mehr abrufbar. Bereits erstellte Forks oder Kopien Dritter lassen sich so nicht zurückholen.

## Übergangslösungen auf GitHub Pages – vor dem Go-live auf projekt-ep.de prüfen bzw. zurücknehmen

Stand 30.10.2026, von Eugen freigegeben. Gilt nur, solange die Seite auf GitHub Pages läuft.

1. **noindex (Commit 4a7bcf9):** `<meta name="robots" content="noindex">` auf den bisherigen Seiten und `robots.txt` mit `Disallow: /`. Vor dem Go-live zurücknehmen: `git revert 4a7bcf9` (danach `python3 tools/csp.py`), sonst ist auch projekt-ep.de gesperrt.
2. **Kontaktformular per E-Mail:** `assets/kontakt.js` öffnet außerhalb von `projekt-ep.de` beim Absenden das E-Mail-Programm (`mailto:kontakt@projekt-ep.de`, Betreff und Text aus den Feldern), statt `kontakt.php` aufzurufen. Auf `projekt-ep.de` und `*.projekt-ep.de` (z. B. `test.projekt-ep.de`) greift automatisch wieder `kontakt.php`, der Button heißt dann wieder „Anfrage senden“. Ganz entfernen: Block „ÜBERGANG bis zum IONOS-Umzug“ samt `MAILTO`-Zeilen in `assets/kontakt.js` löschen (externes Skript, CSP-Hashes unberührt). Beim Testlauf (Schritt 3) prüfen, dass eine Testanfrage über `kontakt.php` ankommt.
3. **kontakt.php auf Pages versteckt:** `.nojekyll` wurde entfernt und `_config.yml` schließt `kontakt.php`, `docs/`, `tools/` und `package*.json` von der Veröffentlichung aus. `kontakt.php` liegt unverändert im Repo-Root und wird vom IONOS-Workflow mit hochgeladen (`_config.yml` ist dort ausgeschlossen). Nach Schritt 5 (Pages abgelöst) kann `_config.yml` gelöscht werden.

## Rollback
- Fehler nach Deploy: Workflow mit dem letzten guten Tag erneut ausführen (Actions → Run workflow → Ref = Tag).
- `.htaccess` verursacht 500: Datei per SFTP umbenennen (`.htaccess.off`), Seite ist sofort wieder erreichbar.
- Bis Schritt 7 bleibt die GitHub-Pages-Vorschau als Ausweich-Adresse bestehen.
- DNS wird nur in Schritt 1 angefasst. Postfach-Einträge (MX, SPF, DKIM) nie ändern.
- IONOS-Backups des Webspace (falls im Paket) vor dem ersten Deploy prüfen.

## Was nach dem Umzug regelmäßig zu tun ist
- Monatlich: `npm audit` bzw. `osv-scanner` für `package.json` (dokumentierte Bibliotheken unter `assets/vendor/`), Bibliotheken bei Sicherheitsupdates ersetzen, `python3 tools/csp.py` laufen lassen.
- Quartalsweise: Header- und TLS-Check, Barrierefreiheit (Lighthouse/pa11y), Datenschutzerklärung mit eingesetzten Diensten abgleichen.
- Uptime-Monitoring einrichten (z. B. kostenloser Dienst mit E-Mail-Alarm an kontakt@projekt-ep.de).
