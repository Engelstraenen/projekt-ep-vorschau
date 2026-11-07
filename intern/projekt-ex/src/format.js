const euroNumber = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 });
const monthFormat = new Intl.DateTimeFormat('de-DE', { month: 'short', year: 'numeric', timeZone: 'UTC' });
const dateTime = new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Berlin' });

export function formatEuro(cents) {
  return `${euroNumber.format(Math.round(Number(cents) / 100))} €`;
}

export function formatOpenRate(rate) {
  if (!Number.isFinite(rate)) return '0 %';
  return `${Math.round(rate * 100)} %`;
}

export function formatClickRate(rate) {
  if (!Number.isFinite(rate)) return '0,0 %';
  const [whole, frac] = (rate * 100).toFixed(1).split('.');
  return `${whole},${frac} %`;
}

export function formatCount(value) {
  return euroNumber.format(value);
}

export function formatMonth(ym) {
  const [year, month] = String(ym).split('-').map(Number);
  if (!year || !month) return String(ym);
  return monthFormat.format(new Date(Date.UTC(year, month - 1, 1)));
}

export function formatWhen(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return String(iso || '');
  return dateTime.format(date);
}

export const DEFINITIONS = [
  ['Versendet', 'Zahl der E-Mail-Nachrichten mit gespeichertem Versandzeitpunkt und Status Beispielaufzeichnung oder Anbieteraufzeichnung. Entwürfe und freigegebene, aber nicht versendete Nachrichten zählen nicht. Im Beispieldatensatz ist der Zeitpunkt eine Markierung der Beispieldaten, kein tatsächlicher Versand.'],
  ['Öffnungsquote', 'Anteil der versendeten Nachrichten mit mindestens einer gespeicherten Öffnung. Weitere Öffnungen derselben Nachricht bleiben gespeichert und ändern die Quote nicht. Die Messung ist eingeschränkt: sie hängt an einem Zählpixel, viele Programme laden Bilder nicht, und Mail-Dienste können das Pixel laden, ohne dass eine Person die Nachricht öffnet. Die Anzeige rundet kaufmännisch auf ganze Prozent.'],
  ['Klickquote', 'Anteil der versendeten Nachrichten mit mindestens einem gespeicherten Klick. Mehrere Klicks derselben Nachricht zählen einmal. Die Anzeige hat eine Nachkommastelle. Es gibt keine Aussage über eine Zustell- oder Öffnungszuverlässigkeit.'],
  ['Kontakte je Kanal', 'Unterschiedliche Kontakte mit einem Ereignis oder einer Kanalidentität in WhatsApp, Telefon oder Website-Chat. Dieselbe Person kann in mehreren Kanälen vorkommen und wird im Kundenstamm einmal geführt, wenn E-Mail oder Telefonnummer übereinstimmt.'],
  ['Themen', 'Unterschiedliche Kontakte mit mindestens einem Ereignis dieses Kanals und dieses Themas. Die Zahl kommt nur aus events.topic. Es gibt keinen zweiten, unabhängigen Zähler. Ein Kontakt mit mehreren Ereignissen desselben Themas zählt einmal.'],
  ['Gespräche', 'Gespeicherte Unterhaltungen des Kanals Website-Chat.'],
  ['Leads', 'Unterschiedliche Kontakte mit einem Website-Chat-Ereignis vom Typ lead.'],
  ['Aufträge', 'Anzahl je Status: unbestätigt, bestätigt, in Arbeit, abgeschlossen.'],
  ['Umsatz', 'Summe der Aufträge mit Status bestätigt, in Arbeit oder abgeschlossen. Unbestätigte Aufträge zählen nicht. Der Balken zeigt dieselbe Summe je Monat des Auftragsdatums. Die Währung ist Euro.'],
  ['Deduplizierung', 'Ereignisse sind je Datensatz, Quelle und Idempotenzschlüssel eindeutig. Kontakte mit derselben normalisierten E-Mail oder derselben E.164-Nummer im selben Datensatz werden zusammengeführt. Beispiel und Echtbetrieb werden nie in einer Kennzahl gemischt.'],
];
