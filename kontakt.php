<?php
/**
 * PROJEKT EX – Kontaktformular-Versand (IONOS Webhosting, PHP 8.x)
 * - keine Zugangsdaten im Code: Versand über PHP mail() des IONOS-Webspace
 * - Schutz: nur POST, Herkunftsprüfung, Honeypot, Mindest-Ausfüllzeit, Rate-Limit (IP nur als Hash, 1 h),
 *   Längenbegrenzung, Header-Injection-Schutz, keine Ausgabe von Nutzereingaben,
 *   Sec-Fetch-Site-Prüfung, Größenlimit, nur Text-Felder (keine Arrays), Auswahlfelder nur mit Formularwerten
 */
declare(strict_types=1);

const TO       = 'kontakt@projektex.de';
const FROM     = 'kontakt@projektex.de';           // Absender muss ein IONOS-Postfach der Domain sein
const HOSTS    = ['projektex.de', 'www.projektex.de', 'test.projektex.de']; // test.: geschützte Test-Subdomain laut docs/IONOS-UMZUG.md
const MIN_SECS = 4;      // schneller ausgefüllt = Bot
const MAX_PER_HOUR = 5;  // Anfragen je IP-Hash und Stunde
const LEISTUNGEN = ['Websites', 'SEO & Sichtbarkeit', 'Systeme & Dashboards', 'Automatisierung & Chatbots', 'App Design', 'Werbeclips', 'Ads-Management', 'Newsletter-Marketing', 'Logo Design', 'Print Design', 'Merch-Produktion', 'Räume & Visualisierung', 'Individuelle Aufträge', 'Bewertungs-Löschservice'];

ini_set('display_errors', '0');   // nie Fehlermeldungen/Pfade an Besucher ausgeben
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');
header('Cache-Control: no-store');

function back(string $q): never { header('Location: /kontakt.html?' . $q, true, 303); exit; }
function field(string $k): string { $v = $_POST[$k] ?? ''; return is_string($v) ? $v : ''; } // Arrays (name[]=) abweisen
function clean(string $v, int $max): string {
  if (!mb_check_encoding($v, 'UTF-8')) return '';
  $v = trim(str_replace("\0", '', $v));
  return mb_substr($v, 0, $max);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') { http_response_code(405); header('Allow: POST'); exit; }
if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 20000) { http_response_code(413); exit; }   // übergroße Anfragen
// Browser-Signal: nur Formularversand von der eigenen Seite (fehlt bei sehr alten Browsern -> dann Origin/Referer)
$sfs = $_SERVER['HTTP_SEC_FETCH_SITE'] ?? '';
if ($sfs !== '' && $sfs !== 'same-origin') back('err=origin');

// Herkunft prüfen (einfacher CSRF-Schutz)
$origin = $_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_REFERER'] ?? '');
$host = parse_url($origin, PHP_URL_HOST) ?: '';
if (!in_array($host, HOSTS, true)) back('err=origin');

// Honeypot und Zeitfalle: Bots bekommen eine neutrale Erfolgsmeldung
if (field('website') !== '') back('ok=1');
$ts = (int)field('ts');
if ($ts <= 0 || (time() - $ts) < MIN_SECS || (time() - $ts) > 86400) back('ok=1');

// Rate-Limit: gehashte IP, Datei außerhalb des Web-Roots, wenn möglich
$dir = rtrim(sys_get_temp_dir(), '/') . '/ep-ratelimit';
if (!is_dir($dir)) @mkdir($dir, 0700, true);
// IP nur gesalzen gehasht (Salz = Pfad dieser Datei auf dem Server, nicht im Repo erratbar), Schlüssel wechselt stündlich
$key = $dir . '/' . hash_hmac('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . '|' . date('Y-m-d-H'), __FILE__ . php_uname('n'));
$count = is_file($key) ? (int)file_get_contents($key) : 0;
if ($count >= MAX_PER_HOUR) { http_response_code(429); back('err=rate'); }
@file_put_contents($key, (string)($count + 1), LOCK_EX);
foreach (glob($dir . '/*') ?: [] as $f) { if (filemtime($f) < time() - 3600) @unlink($f); }

// Eingaben prüfen
$name      = clean(field('name'), 100);
$email     = clean(field('email'), 200);
$firma     = clean(field('firma'), 150);
$kundentyp = clean(field('kundentyp'), 40);
if (!in_array($kundentyp, ['', 'Unternehmen', 'Verein', 'Öffentlicher Auftraggeber', 'Privatperson'], true)) $kundentyp = '';
$pick = static function (string $raw, array $allow): string {
    $out = [];
    foreach (array_map('trim', explode(',', $raw)) as $part) {
        if ($part !== '' && in_array($part, $allow, true) && !in_array($part, $out, true)) $out[] = $part;
    }
    if (in_array('nichts davon', $out, true)) $out = ['nichts davon'];
    return implode(', ', $out);
};
$note = static function (string $key, int $max): string { return clean(field($key), $max); };
$branche = $pick(clean(field('branche'), 400), ['Handwerk', 'Gastronomie', 'Einzelhandel/Shop', 'Gesundheit/Praxis', 'Beauty/Friseur', 'Immobilien', 'Beratung/Dienstleistung', 'Steuer/Recht', 'Fitness/Sport', 'Industrie/Produktion', 'Bildung', 'Event', 'Tourismus/Hotel', 'Sonstiges']);
$kanaele = $pick(clean(field('kanaele'), 400), ['keine Website', 'Website vorhanden', 'Instagram', 'Facebook', 'TikTok', 'YouTube', 'LinkedIn', 'Google-Unternehmensprofil', 'kein Social Media']);
$region = $pick(clean(field('region'), 200), ['lokal', 'regional', 'deutschlandweit', 'international', 'B2B', 'B2C', 'beides']);
$ziel = $pick(clean(field('ziel'), 500), ['mehr Anfragen', 'mehr Reichweite', 'Bekanntheit', 'Mitarbeiter finden', 'Online-Verkauf', 'bei Google gefunden werden', 'Social Media aufbauen', 'Abläufe entlasten', 'Marke schärfen', 'unzulässige Bewertungen prüfen lassen']);
$haken = $pick(clean(field('haken'), 500), ['zu wenige Anfragen', 'kaum Reichweite', 'Website veraltet oder fehlt', 'keine Zeit für Social Media', 'Werbung bringt nichts', 'Auftritt uneinheitlich', 'zu viel Handarbeit', 'kein Überblick', 'Online-Shop fehlt oder hakt']);
$leistungen = $pick(clean(field('leistungen'), 600), LEISTUNGEN);
$material = $pick(clean(field('material'), 240), ['Logo', 'eigene Fotos', 'eigene Videos', 'Texte', 'Farben und Schriften', 'Domain', 'nichts davon']);
$zeitpunkt = $pick(clean(field('zeitpunkt'), 80), ['sofort', 'in 1–3 Monaten', 'in diesem Jahr', 'später', 'noch offen']);
$entscheidet = $pick(clean(field('entscheidet'), 80), ['ich selbst', 'mit Partner/Team', 'Geschäftsführung', 'noch unklar']);
$sonstBranche = $note('sonst_branche', 240);
$sonstKanaele = $note('sonst_kanaele', 300);
$sonstRegion = $note('sonst_region', 240);
$sonstZiel = $note('sonst_ziel', 240);
$sonstHaken = $note('sonst_haken', 240);
$sonstLeistungen = $note('sonst_leistungen', 240);
$sonstMaterial = $note('sonst_material', 240);
$sonstZeitpunkt = $note('sonst_zeitpunkt', 240);
$sonstEntscheidet = $note('sonst_entscheidet', 240);
$nachricht = clean(field('nachricht'), 5000);

if ($name === '' || mb_strlen($nachricht) < 10) back('err=input');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) back('err=email');
$einzeilig = $name . $email . $firma . $branche . $kanaele . $region . $ziel . $haken . $leistungen . $material . $zeitpunkt . $entscheidet . $sonstBranche . $sonstKanaele . $sonstRegion . $sonstZiel . $sonstHaken . $sonstLeistungen . $sonstMaterial . $sonstZeitpunkt . $sonstEntscheidet;
if (preg_match('/[\r\n]/', $einzeilig)) back('err=input');
if (preg_match_all('~https?://~i', $nachricht) > 3) back('ok=1');

$betreff = $leistungen !== '' ? explode(', ', $leistungen)[0] : 'Allgemein';
$subject = '=?UTF-8?B?' . base64_encode('Anfrage über projektex.de: ' . $betreff) . '?=';
$body = "Neue Anfrage über das Kontaktformular\n\n"
      . "Name: $name\nE-Mail: $email\nAnfrage als: $kundentyp\nUnternehmen/Verein: $firma\n"
      . "Branche: $branche\nBranche sonstiges: $sonstBranche\n"
      . "Kanäle: $kanaele\nKanäle sonstiges: $sonstKanaele\n"
      . "Zielgruppe und Region: $region\nRegion sonstiges: $sonstRegion\n"
      . "Wichtigstes Ziel: $ziel\nZiel sonstiges: $sonstZiel\n"
      . "Wo hakt es gerade?: $haken\nHaken sonstiges: $sonstHaken\n"
      . "Leistungen: $leistungen\nLeistungen sonstiges: $sonstLeistungen\n"
      . "Was haben Sie schon?: $material\nMaterial sonstiges: $sonstMaterial\n"
      . "Zeitpunkt: $zeitpunkt\nZeitpunkt sonstiges: $sonstZeitpunkt\n"
      . "Wer entscheidet?: $entscheidet\nEntscheidung sonstiges: $sonstEntscheidet\n\nNachricht:\n$nachricht\n";
$headers = implode("\r\n", [
  'From: PROJEKT EX Website <' . FROM . '>',
  'Reply-To: ' . $email,
  'Content-Type: text/plain; charset=UTF-8',
  'Content-Transfer-Encoding: 8bit',
  'X-Mailer: projekt-ep-kontakt',
]);

$ok = mail(TO, $subject, $body, $headers, '-f' . FROM);
back($ok ? 'ok=1' : 'err=send');
