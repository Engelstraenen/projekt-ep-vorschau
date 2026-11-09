# PROJEKT EX intern

Internes Backend und Dashboard der **Engelstränen UG (haftungsbeschränkt)** für PROJEKT EX.

Die öffentliche Website in diesem Repository bleibt statisch. Dieses Programm läuft **nicht** auf GitHub Pages und gehört **nicht** ins IONOS-Deploy-Paket. Es ändert keine öffentliche Seite, versendet nichts und veröffentlicht keine Inhalte.

## Lokal starten

Voraussetzung: Node.js 22.13 oder neuer. Es gibt keine Laufzeit-Abhängigkeiten.

```bash
cd intern/projekt-ex
cp .env.example .env
# SESSION_SECRET selbst erzeugen, nicht aus einem Beispiel übernehmen:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
npm test
npm start
```

Beim ersten Aufruf von `http://127.0.0.1:8787` legt die Einrichtung ein Verwaltungskonto an. Es gibt kein voreingestelltes Passwort.

Der frische Datenbestand steht auf **Echtbetrieb** und ist leer. Beispieldaten, die der freigegebenen Dashboard-Ansicht entsprechen, lädt nur dieser Befehl:

```bash
npm run seed:example
```

Der Befehl schreibt den Beispieldatensatz neu und schaltet die Ansicht auf Beispiel. Echte Zeilen bleiben liegen und erscheinen in der Beispielansicht nicht.

## Was die Oberfläche kann

- Dashboard mit E-Mail, Aufträgen, Umsatz, WhatsApp, Telefon und Website-Chat aus einer Datenbank
- Bots: Gespräche, Kennzahlen, Fehler/Einstellungen, Verbindungsstatus
- Kundenstamm, Verlauf, Termine
- Aufträge
- Seiten, Angebote und Shop als Entwürfe mit geschützter Vorschau
- Freigaben für Ausgangsnachrichten, ohne Versand

Jede Seite kennzeichnet **ENTWURF · BEISPIELDATEN** oder **ECHTBETRIEB · KEINE BEISPIELDATEN**.

## Dokumente

- [Sicherheit](docs/SICHERHEIT.md)
- [Kennzahlen](docs/METRIKEN.md)
- [Anschluss und Betrieb](docs/ANSCHLUSS.md)
- [Testbericht](docs/TESTBERICHT.md)
