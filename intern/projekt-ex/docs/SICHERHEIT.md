# Sicherheitsentscheidungen

Stand der Umsetzung in diesem Branch. Das System ist ein lokales internes Werkzeug, kein freigegebenes Produktivsystem.

## Zugang

- Es gibt kein voreingestelltes Konto und kein Passwort im Repository.
- Das erste Konto entsteht nur, solange die Tabelle `users` leer ist. Danach ist `/setup` geschlossen.
- Passwörter: mindestens 12 Zeichen, nicht identisch mit der E-Mail, gespeichert als scrypt (N=16384, r=8, p=1, 16 Byte Salz, 64 Byte Hash).
- Die Sitzung ist ein Zufallstoken. Gespeichert wird nur SHA-256. Cookie: `HttpOnly`, `SameSite=Lax`, Pfad `/`, 12 Stunden, absolut höchstens 7 Tage.
- `COOKIE_SECURE=1` ist Pflicht, wenn `NODE_ENV=production`. Ohne das startet der Prozess nicht.
- `SESSION_SECRET` muss mindestens 32 Zeichen haben und darf keine üblichen Platzhalter enthalten. Sonst startet der Prozess nicht. Ein Entwicklungsgeheimnis wird nicht erfunden.
- Änderungen prüfen Herkunft (`Origin` bzw. `Sec-Fetch-Site`) und ein CSRF-Token an der Sitzung. Das Einrichtungs- und Anmeldeformular bindet zusätzlich ein kurzlebiges Cookie.
- Fehlversuche der Anmeldung: 8 je E-Mail und IP-Hash in 15 Minuten. Die IP wird nicht im Klartext abgelegt.
- Die API-Antwort bei falschem Passwort unterscheidet nicht, welches der beiden Felder falsch war.

## Daten

- SQLite-Datei standardmäßig unter `intern/projekt-ex/data/`, per `.gitignore` ausgeschlossen.
- Beispiel und Echtbetrieb sind Spaltenwerte `dataset`, keine zwei Anwendungen. Webhooks schreiben nur `dataset='real'`.
- Kennzahlen filtern immer genau einen Datensatz.
- Webhook-Körper werden nicht gespeichert. Aufbewahrt werden Zeitpunkt, Anbieter, Idempotenzschlüssel, SHA-256 und ein kurzer Grund. Angenommene Nachrichten und Kontaktdaten liegen in den Fachtabellen, weil der Kundenstamm sie sonst nicht zeigen kann. Deshalb darf echter Verkehr erst nach separater Freigabe auf einen betriebenen Server zeigen.
- CMS-Status ist in der Datenbank auf `draft` beschränkt. Es gibt keine Route, die veröffentlicht oder die öffentliche Website schreibt.

## Ausgang

- Freigabe setzt `approved_not_dispatched` und lässt `recorded_sent_at` leer.
- Es gibt in diesem Code keinen Versandaufruf. `decideApproval` öffnet keine HTTP-Verbindung.
- Entwürfe bleiben liegen, bis jemand sie später an einen echten Anbieter übergibt. Das ist hier nicht gebaut.

## Webhooks

- Telefon, E-Mail und Website-Chat: HMAC-SHA256 über `Zeitstempel.Rohkörper`, Kopfzeilen `X-Projekt-Ex-Timestamp` und `X-Projekt-Ex-Signature`. Zeitfenster ±5 Minuten. Idempotenzschlüssel aus Kopfzeile oder `id`.
- Meta-WhatsApp: `X-Hub-Signature-256` über den Rohkörper mit `META_APP_SECRET`. Die Prüfadresse `GET` vergleicht `META_VERIFY_TOKEN` und antwortet mit der Challenge. Das setzt den Kanal nicht auf verbunden.
- Fehlt das Geheimnis, antwortet der Webhook mit 503 `provider_not_configured`. Die Oberfläche zeigt dann „Nicht konfiguriert“, nie „Verbunden“.
- Ein gesetztes Geheimnis ergibt „Konfiguriert, nicht verbunden“. Eine erfolgreiche Challenge oder ein einzelner Webhook ist kein Verbindungsnachweis für den laufenden Bot.

## HTTP

- Bindet standardmäßig an `127.0.0.1`.
- Kopfzeilen: CSP nur `self`, `nosniff`, `no-referrer`, kein Framing, `noindex`.
- HTML wird escaped. Entwurfstext in der Vorschau wird als Text gezeigt, nicht als HTML ausgeführt.
- Statische Dateien dürfen den Ordner `public/` nicht verlassen.

## Was bewusst nicht drin ist

- Keine Mehrfaktor-Anmeldung, kein SSO, keine Rollen außer dem einen Verwaltungskonto.
- Keine Verschlüsselung der SQLite-Datei. Wer die Datei lesen kann, liest die Fachdaten.
- Kein automatisches Backup.
- Der Prozess ist ein einzelner Node-Prozess. Mehrere Instanzen auf derselben Datei sind nicht vorgesehen.
