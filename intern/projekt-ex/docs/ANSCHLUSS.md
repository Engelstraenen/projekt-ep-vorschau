# Anschluss und Betrieb

Dieses Programm ist lauffähig auf einem Rechner mit Node.js. Es ist nicht an Telefon, Meta, E-Mail oder den öffentlichen Website-Chat angeschlossen. Dafür liegen keine Zugangsdaten vor, und diese Fassung soll sie auch nicht enthalten.

## Warum nicht die bestehende Website

Die Website ist statisches HTML. GitHub Pages führt kein Node aus. Der IONOS-Workflow baut mit `tools/launch_build.py` ein statisches Paket und lädt es per SFTP hoch. `intern/` steht in der Jekyll-Ausschlussliste und in `EXCLUDE_PREFIX`, damit Quelltext, Schrift und später eine lokale Datenbank nicht mit der Website ausgeliefert werden.

Ein späterer Betrieb braucht einen eigenen Prozess mit dauerhafter Platte, HTTPS-Proxy und Backup. Das ist hier nicht eingerichtet. Es wurde kein Server gemietet, kein Konto angelegt und nichts deployed.

## Anbieterverträge

Geheimnisse bleiben Umgebungsvariablen. Die Oberfläche speichert sie nicht.

| Kanal | Variablen | Eingang | Ohne Variablen |
| --- | --- | --- | --- |
| Telefon | `TELEPHONE_WEBHOOK_SECRET` | `POST /api/hooks/telephone` | 503 |
| WhatsApp über Meta | `META_APP_SECRET`, `META_VERIFY_TOKEN` | `GET` und `POST /api/hooks/meta/whatsapp` | 503 |
| E-Mail | `EMAIL_WEBHOOK_SECRET` | `POST /api/hooks/email` | 503 |
| Website-Chat | `WEBCHAT_INGEST_SECRET` | `POST /api/hooks/webchat` | 503 |

Signatur Telefon, E-Mail, Chat: Hex-HMAC-SHA256 von `unixZeitstempel + "." + Rohkörper`, Kopfzeile `X-Projekt-Ex-Signature: sha256=…` und `X-Projekt-Ex-Timestamp`. Fenster fünf Minuten. `Idempotency-Key` oder Feld `id`.

Meta: Kopfzeile `X-Hub-Signature-256` über den Rohkörper. Die GET-Prüfung antwortet nur mit `hub.challenge`, wenn `hub.verify_token` stimmt.

Beispiel Telefon, nur Vertrag, kein echter Anruf:

```json
{
  "id": "call-1",
  "occurred_at": "2026-11-07T18:00:00.000Z",
  "contact": { "name": "Anrufer", "phone": "+490000000000", "external_id": "provider-1" },
  "topic": "Angebot",
  "text": "Notiz"
}
```

Beispiel E-Mail: `kind` ist `sent`, `open`, `click` oder `inbound`, dazu `message_id`, `occurred_at`, `contact.email`. `sent` von außen ist eine Aufzeichnung des Anbieters, kein Versand durch diese Anwendung.

Beispiel Chat: `id`, `occurred_at`, `contact.external_id`, `text`, optional `lead: true` und `topic`.

Meta-Nachrichten folgen `entry[].changes[].value.messages[]` mit `id`, `from`, `timestamp`, `text.body`. Das öffentliche Meta-Objekt hat kein Themenfeld. Themen bleiben dann leer, bis eine spätere Zuordnung sie setzt. Telefon, E-Mail und Chat dieses Vertrags haben `topic`.

Bestehende Bots liegen außerhalb des Repositories. Solange ihre Endpunkte nicht auf diesen Prozess zeigen und die Variablen nicht gesetzt sind, sind sie nicht angebunden. Die Oberfläche behauptet das auch nicht.

## Ausgang und Veröffentlichung

Ausgang entsteht nur als Entwurf und Freigabe. Beides versendet nicht. Eine spätere Anbindung muss eine eigene, ausdrücklich freigegebene Versandstufe bekommen. Die ist nicht vorbereitet, damit sie nicht versehentlich aufrufbar ist.

CMS-Entwürfe haben eine interne Vorschau hinter der Anmeldung. Es gibt keinen Befehl, der nach `index.html` oder auf den Webspace schreibt.

## Bevor echtes Personenmaterial hier landet

- Betrieb außerhalb von GitHub Pages, mit HTTPS, `COOKIE_SECURE=1` und eigenem `SESSION_SECRET`
- Backup und Zugriffsschutz der SQLite-Datei
- Verträge und Datenschutztexte für Telefon, Meta, E-Mail und Chat, bevor Webhooks produktiv zeigen
- Entscheidung, dass der öffentliche Website-Chat überhaupt angebunden werden soll; das Widget der Website ist in diesem Branch nicht verändert
- Getrennte Freigabe, bevor irgendetwas automatisch hinausgeht

## Nicht gebaut

- Mehrfaktor, SSO, feinere Rollen
- Rich-Text-Editor
- Mehrere Server auf einer Datenbank
- Automatische Sicherung
- Versand, Kampagnenstart, Anruf, WhatsApp-Ausgang
- Verbindungskennzeichen „verbunden“
- Übernahme der bestehenden Bot-Prozesse; dafür fehlen die Endpunkte
