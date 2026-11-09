# Kennzahlen

Alle Dashboard-Zahlen kommen aus SQLite, gefiltert auf den gerade angezeigten Datensatz. Es gibt keine zweite Zähltabelle.

Die Definitionen stehen außerdem in der Oberfläche unter „Definitionen“.

| Zahl | Bildung |
| --- | --- |
| Versendet | E-Mail-Zeilen mit Status `example_recorded` oder `provider_recorded` und gesetztem `recorded_sent_at`. Entwürfe und `approved_not_dispatched` zählen nicht. |
| Öffnungsquote | Unterschiedliche versendete Nachrichten mit mindestens einer Öffnung, geteilt durch Versendet, kaufmännisch auf ganze Prozent. Weitere Öffnungen derselben Nachricht bleiben gespeichert und ändern die Quote nicht. |
| Klickquote | Wie die Öffnung, für Klicks, mit einer Nachkommastelle. |
| WhatsApp- / Telefonkontakte | Vereinigung aus Ereignissen des Kanals und Kanalidentitäten, unterschiedliche Kontakte. |
| Themen | `COUNT(DISTINCT contact_id)` aus `events` mit diesem Kanal und nicht leerem `topic`. |
| Gespräche | Zeilen in `conversations` mit Kanal `webchat`. |
| Leads | Unterschiedliche Kontakte mit Ereignis `channel=webchat` und `type=lead`. |
| Auftragszahlen | Anzahl je Status. |
| Umsatz | Summe `amount_cents` der Status bestätigt, in Arbeit, abgeschlossen. Unbestätigt zählt nicht. Der Balken gruppiert dieselbe Summe nach `YYYY-MM` von `ordered_at`. |

## Deduplizierung

- Ereignis: eindeutig über `(dataset, source, idempotency_key)`.
- E-Mail-Öffnung oder -Klick: dieselbe Regel, zusätzlich zählt die Quote je Nachricht höchstens einmal.
- Kontakt: dieselbe normalisierte E-Mail oder dieselbe E.164-Nummer im selben Datensatz wird zusammengeführt. Beispiel und Echtbetrieb bleiben getrennt, auch bei gleicher Adresse.
- Ein Kontakt kann mehrere Kanäle haben. Die Kanalzahl ist deshalb kein Teil der Gesamtzahl der Personen.

## Beispieldatensatz

`npm run seed:example` erzeugt genau diese Werte und sonst keine Personen:

- 420 versendet, 172 Öffnungen → 41 %, 26 Klicks → 6,2 %
- WhatsApp 186 Kontakte, davon Thema Terminwunsch 64 und Rückruf 41
- Telefon 92 Kontakte, davon Angebot 28 und Projektstatus 19; 40 dieser Kontakte sind dieselben Datensätze wie bei WhatsApp
- Website-Chat 134 Gespräche, 27 Leads
- Aufträge 5 / 8 / 6 / 14
- Umsatz 48.600 € über sieben Monate

Namen lauten „Beispielkontakt“, E-Mails enden auf `@example.invalid`, Telefonnummern sind synthetische `+490000…`. Der Umsatz ist als Beispiel beschriftet. Öffnungen sind als eingeschränkt messbar beschriftet, auch im Echtbetrieb, weil die Messart die Einschränkung trägt und nicht der Datensatz.

## Warum die Öffnung eingeschränkt ist

Die Öffnung hängt an einem Bildabruf. Viele Programme laden Bilder nicht. Manche Mail-Dienste laden das Bild, ohne dass jemand die Nachricht liest. Die Quote ist deshalb keine verlässliche Lesequote und keine Zuverlässigkeitsangabe.
