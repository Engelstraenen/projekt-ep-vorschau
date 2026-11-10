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
const LEISTUNGEN = ['', 'Website', 'Werbeclips', 'Logo Design', 'Print Design', 'Merch', 'SEO', 'Apps', 'Games',
  'Automatisierung & Chatbots', 'Systeme & Dashboards', 'Visualisierung', 'Bewertungs-Löschservice', 'Etwas anderes']; // = Optionen in kontakt.html

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
$leistung  = clean(field('leistung'), 60);
if (!in_array($leistung, LEISTUNGEN, true)) $leistung = '';
$taetigkeit = clean(field('taetigkeit'), 200);
$branche    = clean(field('branche'), 200);
$web        = clean(field('web'), 200);
$social     = clean(field('social'), 300);
$zielgruppe = clean(field('zielgruppe'), 300);
$ziel       = clean(field('ziel'), 300);
$hakenText  = clean(field('haken_text'), 1000);
$zeitpunkt  = clean(field('zeitpunkt'), 200);
$entscheidet = clean(field('entscheidet'), 200);
$hakenAllow = ['zu wenige Anfragen', 'kaum Reichweite', 'Website veraltet oder fehlt', 'keine Zeit für Social Media', 'Werbung bringt nichts'];
$materialAllow = ['Logo', 'eigene Fotos', 'eigene Videos', 'Texte für die Website', 'nichts davon'];
$pick = static function (string $raw, array $allow): string {
    $out = [];
    foreach (array_map('trim', explode(',', $raw)) as $part) {
        if ($part !== '' && in_array($part, $allow, true) && !in_array($part, $out, true)) $out[] = $part;
    }
    if (in_array('nichts davon', $out, true)) $out = ['nichts davon'];
    return implode(', ', $out);
};
$haken    = $pick(clean(field('haken'), 400), $hakenAllow);
$material = $pick(clean(field('material'), 200), $materialAllow);
$nachricht = clean(field('nachricht'), 5000);

if ($name === '' || mb_strlen($nachricht) < 10) back('err=input');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) back('err=email');
if (preg_match('/[\r\n]/', $name . $email . $firma . $leistung . $taetigkeit . $branche . $web . $social . $zeitpunkt . $entscheidet . $haken . $material)) back('err=input'); // Header-Injection
if (preg_match_all('~https?://~i', $nachricht) > 3) back('ok=1');                    // Link-Spam

$subject = '=?UTF-8?B?' . base64_encode('Anfrage über projektex.de: ' . ($leistung !== '' ? $leistung : 'Allgemein')) . '?=';
$body = "Neue Anfrage über das Kontaktformular\n\n"
      . "Name: $name\nE-Mail: $email\nAnfrage als: $kundentyp\nUnternehmen/Verein: $firma\n"
      . "Tätigkeit: $taetigkeit\nBranche bzw. Bereich: $branche\nWebsite: $web\nSocial Media: $social\n"
      . "Zielgruppe und Region: $zielgruppe\nWichtigstes Ziel: $ziel\nWo hakt es gerade?: $haken\nIn eigenen Worten: $hakenText\n"
      . "Leistung: $leistung\nWas haben Sie schon?: $material\nZeitpunkt: $zeitpunkt\nWer entscheidet?: $entscheidet\n\nNachricht:\n$nachricht\n";
$headers = implode("\r\n", [
  'From: PROJEKT EX Website <' . FROM . '>',
  'Reply-To: ' . $email,
  'Content-Type: text/plain; charset=UTF-8',
  'Content-Transfer-Encoding: 8bit',
  'X-Mailer: projekt-ep-kontakt',
]);

$ok = mail(TO, $subject, $body, $headers, '-f' . FROM);
back($ok ? 'ok=1' : 'err=send');
