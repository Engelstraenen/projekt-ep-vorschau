# PROJEKT EX – Anzahlungs-/Rechnungsvorschau

Nur Testdaten, kein produktiver Auftrag, keine Zahlung, kein Mailversand. Alle Dateien liegen ausschließlich in `vorschau/projektex-bestellprozess/`. Die Live-Seite, der Bewertungs-Löschservice und Videos werden nicht verändert.

## Bestand geprüft

GitHub main: `package.json`, `kontakt.html`, `assets/kontakt.js`, `kontakt.php`, `rechtliches.html`, vollständige Pfadliste. Lokaler Bestand: `/workspace/ex-repo`, `/workspace/gh-vorschau-clean`, `/workspace/ep-preview-work`; nach Rechnungs-/Zahlungsintegrationen gesucht. `/workspace/projekt-ep-cms` existiert nicht. Keine Aussage über nicht zugängliche oder externe Systeme.

- Kontaktformular ist eine unverbindliche Anfrage, kein Checkout.
- `kontakt.php` versendet die Anfrage serverseitig über PHP `mail()` an PROJEKT EX, nicht automatisch eine Rechnung an den Kunden.
- `assets/kontakt.js` wechselt außerhalb projektex.de zum Mailprogramm (`mailto:`), weil Pages kein PHP ausführt.
- Keine Rechnungs-/Buchhaltungsintegration in den geprüften Bestandsdateien oder SDK-Abhängigkeiten gefunden. `package.json` führt Lenis, Three und Vanilla CookieConsent.
- Bestehende AGB § 6 enthalten **50 %**, 14 Tage Zahlungsziel und teils Leistungsbeginn nach Zahlung. Diese wurden NICHT live geändert. Vor Livegang müssen § 6 Abs. 2, 2a und 3 sowie Angebot/Auftragsbestätigung konsistent geprüft werden; alte Bedingungen nicht stillschweigend fortschreiben.

## Regeln

Reguläre Aufträge: 30 % Anzahlung; tatsächliche Zahlung wird mit Nettoanteil und USt. in der Schlussrechnung abgesetzt. Fälligkeit, Leistungsbeginn und Zeitpunkt der Restzahlung bleiben offen. 19 % USt. ist nur eine Testannahme.

Bewertungs-Löschservice: keine Anzahlung; ausschließlich bestätigte Erfolge, 10 EUR netto je Erfolg, sonst 0 EUR. Sammelrechnung alle 2 Wochen. Erneut sichtbare Bewertung nur auf Kundenmeldung und nach Prüfung korrigieren. Keine Löschgarantie. Die Ausnahme wird nur im neuen Testprozess dargestellt; bestehende Löschservice-Dateien bleiben unangetastet.

## Idempotenz und Produktionskonzept

`order_id + event_type + version`, bei Erfolgsabrechnung zusätzlich Perioden-ID; jede Löschung mit eindeutiger Beleg-ID und eindeutiger Rechnungszuordnung. Unique Constraints und Rechnung plus Outbox in derselben Datenbanktransaktion. Mailauftrag eindeutig über Rechnungs-ID, Empfänger und Version. Nummernkreis serverseitig, unveränderliche Beleg-Snapshots. Zahlungs-/Providerereignisse deduplizieren. Bei Timeout Status beim Provider abgleichen, kein blindes erneutes Senden. Provider-Idempotenz erforderlich; ohne sie ist genau-einmaliger externer Versand nicht garantiert. Storno/Korrektur separat und nachvollziehbar. Vor Umsetzung vorhandenen Rechnungsanbieter und dessen APIs prüfen und rechtlich/steuerlich freigeben lassen; keine Eigenbau-Finanzbuchhaltung.

Die lokale Simulation nutzt nur Tab-Arbeitsspeicher: kein Datenbank-/Mehrbenutzer-/Browserneustart-Schutz und keine produktive Versandgarantie. Sie zeigt die Regeln; sie ersetzt kein Backend. Der simulierte Zahlungseingang ist keine Festlegung des Leistungsbeginns. Die simulierte Schlussrechnung setzt eine im Test abgeschlossene Leistung voraus; der Zahlungstermin bleibt offen.

## Vor Livegang erforderlich

- Rechtsprüfung §§ 305 ff. BGB / § 307, B2B/B2C, individuelle Vereinbarungen, Widerruf, gegebenenfalls § 312j BGB; AGB tatsächlich wirksam einbeziehen. Fälligkeit, Leistungsbeginn, Restzahlung, Periodenanker und elektronische Übermittlung entscheiden.
- § 14 Abs. 4 UStG: Parteien mit vollständigem Namen/Anschrift, Steuer-/USt-ID, Ausstellungsdatum, einmalige fortlaufende Rechnungsnummer, Leistungsart/-umfang/-zeitpunkt, steuerlich aufgeschlüsseltes Entgelt, Steuersatz/-betrag oder Befreiungshinweis, ggf. Sonderangaben. Muster sind keine gültigen Rechnungen.
- Anzahlungen: Rechnung, Forderung und tatsächliche Vereinnahmung unterscheiden. USt. auf vor Leistung vereinnahmte Beträge grundsätzlich im Voranmeldungszeitraum des Eingangs (§ 13 UStG). In der Endrechnung vereinnahmte Teilentgelte plus zugehörige USt. absetzen (§ 14 Abs. 5 UStG). Ist-/Sollversteuerung, Kleinunternehmerstatus und Steuersätze prüfen.
- Inländische B2B-E-Rechnung: Empfang seit 2025 grundsätzlich ermöglichen. Allgemeine Ausstellung-Übergangsfrist bis Ende 2026; 2027 bei Vorjahresumsatz bis 800.000 EUR, EDI-Sonderregel. Ab 2028 grundsätzlich Ausstellungspflicht, Ausnahmen prüfen. PDF allein ist keine strukturierte E-Rechnung. XRechnung/ZUGFeRD, EN16931, jeweils aktuelle BMF-Regeln und Übermittlungszustimmung beachten.
- NL/sonstiges Ausland: Leistungsort, Unternehmerstatus/USt-ID, Reverse Charge, § 14a UStG getrennt prüfen.
- GoBD, Archivierung, Belegkorrektur, Datenschutz/AVV, Versand- und Zahlungsanbieter, Test-/Produktivtrennung.

Quellen:
https://www.gesetze-im-internet.de/ustg_1980/__14.html
https://www.gesetze-im-internet.de/ustg_1980/__13.html
https://www.bundesfinanzministerium.de/Content/DE/FAQ/e-rechnung.html
https://www.gesetze-im-internet.de/bgb/__305.html
