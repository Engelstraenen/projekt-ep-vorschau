# Tracking einschalten (GA4, Google Ads, Meta-Pixel, TikTok-Pixel)

Stand 02.11.2026. Zum Go-live ist alles **aus**: In `assets/consent.js` sind keine IDs eingetragen, deshalb lädt auch nach „Alle akzeptieren“ kein Dienst. Der Banner bleibt trotzdem aktiv (Entscheidung Eugen 02.11.).

## So funktioniert es
- `assets/consent.js` lädt Dienste **nur nach Einwilligung** und nur, wenn eine ID eingetragen ist:
  - Kategorie **Statistik**: Google Analytics 4
  - Kategorie **Marketing**: Google Ads Conversion, Meta-Pixel, TikTok-Pixel
- Google Consent Mode v2 (Basic): Standard `denied` für `ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage`. `gtag.js` wird erst nach Einwilligung geladen, dann `consent update` nur für die erlaubten Kategorien.
- Widerruf über „Cookie-Einstellungen“ im Footer: Cookies (`_ga*`, `_gcl*`, `_fbp`, `_ttp`) werden gelöscht, die Seite lädt neu, danach läuft nichts mehr.
- Getestet am 02.11. mit Test-IDs: vor Einwilligung 0 fremde Anfragen; nach „Alle akzeptieren“ nur googletagmanager.com, connect.facebook.net, analytics.tiktok.com; 0 CSP-Fehler; nach Widerruf wieder 0.

## Schritte (ca. 15 Minuten, danach Deploy)
1. IDs besorgen: GA4-Mess-ID (`G-…`), Google-Ads-Conversion-ID (`AW-…`), Meta-Pixel-ID, TikTok-Pixel-ID.
2. In `assets/consent.js` bei `TRACKING` eintragen. Nur Dienste eintragen, die wirklich genutzt werden.
3. Vorher: AV-Vertrag bzw. Datenverarbeitungsbedingungen bei Google (Konto-Einstellungen), Meta (Geschäftsbedingungen für Business Tools) und TikTok akzeptieren; in GA4 Datenaufbewahrung (2 oder 14 Monate) wählen, Google-Signale aus, sofern nicht gebraucht.
4. Paket bauen, z. B. nur GA4 und Meta:
   `python3 tools/launch_build.py --tracking ga4,meta`
   Das Skript
   - bricht ab, wenn für einen Dienst keine ID eingetragen ist,
   - erweitert die CSP (Header in `.htaccess` und Meta-Tag jeder Seite) nur um die Domains der gewählten Dienste,
   - blendet in `datenschutz.html` die Abschnitte der gewählten Dienste ein (andere bleiben ausgeblendet),
   - erhöht die Banner-`revision`, damit alle Besucher neu gefragt werden.
5. Datenschutz-Platzhalter in den eingeblendeten Abschnitten füllen (z. B. GA4-Speicherdauer) und von VERTRIEB & MARKETING gegenlesen lassen.
6. Nach dem Deploy prüfen: Seite im privaten Fenster öffnen → keine Anfragen an Google/Meta/TikTok vor Klick; „Alle akzeptieren“ → GA4 „Echtzeit“ zeigt den Besuch; „Alle ablehnen“ über Footer → keine Anfragen mehr.

## Wieder ausschalten
ID in `assets/consent.js` leeren und Paket ohne den Dienst in `--tracking` neu bauen.

## Auswertung UTM-Links in GA4
Die Links aus `ep-launch/utm-links.csv` tragen `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`. In GA4:
- **Berichte → Akquisition → Traffic-Akquisition**: Spalte auf „Sitzung – Quelle/Medium“ stellen (z. B. `instagram / social`).
- Weitere Dimension „Sitzung – Kampagne“ bzw. „Sitzung – manueller Anzeigeninhalt“ (= `utm_content`, z. B. `reel`, `bio`).
- Anfragen messen: In GA4 unter **Verwaltung → Ereignisse** ein Ereignis für den Seitenaufruf `kontakt.html?ok=1` anlegen und als **Schlüsselereignis** markieren.
- Hinweis: GA4 zählt nur Besuche mit Einwilligung (Statistik). Die Zahlen sind daher eine Untergrenze.
- Alle UTM-Links nutzen `utm_medium=social`: GA4 ordnet `instagram / social` usw. dem Kanal „Organic Social“ zu. `utm_medium=organic` würde GA4 als „Organic Search“ werten, deshalb nicht verwenden. Für bezahlte Anzeigen später `utm_medium=paid_social` (Meta/TikTok) bzw. Google-Ads-Auto-Tagging.
- Kampagnen: `start-2026-11` = Beiträge zum Website-Start, `profil` = dauerhafte Profil-/Bio-Links.
