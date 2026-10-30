<?php
/**
 * PROJEKT EP – Kontaktformular-Versand (IONOS Webhosting, PHP 8.x)
 * - keine Zugangsdaten im Code: Versand über PHP mail() des IONOS-Webspace
 * - Schutz: nur POST, Herkunftsprüfung, Honeypot, Mindest-Ausfüllzeit, Rate-Limit (IP nur als Hash, 1 h),
 *   Längenbegrenzung, Header-Injection-Schutz, keine Ausgabe von Nutzereingaben
 */
declare(strict_types=1);

const TO       = 'kontakt@projekt-ep.de';
const FROM     = 'kontakt@projekt-ep.de';           // Absender muss ein IONOS-Postfach der Domain sein
const HOSTS    = ['projekt-ep.de', 'www.projekt-ep.de'];
const MIN_SECS = 4;      // schneller ausgefüllt = Bot
const MAX_PER_HOUR = 5;  // Anfragen je IP-Hash und Stunde

header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function back(string $q): never { header('Location: /kontakt.html?' . $q, true, 303); exit; }
function clean(string $v, int $max): string {
  $v = trim(str_replace("\0", '', $v));
  return mb_substr($v, 0, $max);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') { http_response_code(405); header('Allow: POST'); exit; }

// Herkunft prüfen (einfacher CSRF-Schutz)
$origin = $_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_REFERER'] ?? '');
$host = parse_url($origin, PHP_URL_HOST) ?: '';
if (!in_array($host, HOSTS, true)) back('err=origin');

// Honeypot und Zeitfalle: Bots bekommen eine neutrale Erfolgsmeldung
if (!empty($_POST['website'])) back('ok=1');
$ts = (int)($_POST['ts'] ?? 0);
if ($ts <= 0 || (time() - $ts) < MIN_SECS || (time() - $ts) > 86400) back('ok=1');

// Rate-Limit: gehashte IP, Datei außerhalb des Web-Roots, wenn möglich
$dir = rtrim(sys_get_temp_dir(), '/') . '/ep-ratelimit';
if (!is_dir($dir)) @mkdir($dir, 0700, true);
$key = $dir . '/' . hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . '|' . date('Y-m-d-H'));
$count = is_file($key) ? (int)file_get_contents($key) : 0;
if ($count >= MAX_PER_HOUR) { http_response_code(429); back('err=rate'); }
@file_put_contents($key, (string)($count + 1), LOCK_EX);
foreach (glob($dir . '/*') ?: [] as $f) { if (filemtime($f) < time() - 3600) @unlink($f); }

// Eingaben prüfen
$name      = clean((string)($_POST['name'] ?? ''), 100);
$email     = clean((string)($_POST['email'] ?? ''), 200);
$firma     = clean((string)($_POST['firma'] ?? ''), 150);
$leistung  = clean((string)($_POST['leistung'] ?? ''), 60);
$nachricht = clean((string)($_POST['nachricht'] ?? ''), 5000);

if ($name === '' || mb_strlen($nachricht) < 10) back('err=input');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) back('err=email');
if (preg_match('/[\r\n]/', $name . $email . $firma . $leistung)) back('err=input'); // Header-Injection
if (preg_match_all('~https?://~i', $nachricht) > 3) back('ok=1');                    // Link-Spam

$subject = '=?UTF-8?B?' . base64_encode('Anfrage über projekt-ep.de: ' . ($leistung !== '' ? $leistung : 'Allgemein')) . '?=';
$body = "Neue Anfrage über das Kontaktformular\n\n"
      . "Name: $name\nE-Mail: $email\nUnternehmen: $firma\nLeistung: $leistung\n\nNachricht:\n$nachricht\n";
$headers = implode("\r\n", [
  'From: PROJEKT EP Website <' . FROM . '>',
  'Reply-To: ' . $email,
  'Content-Type: text/plain; charset=UTF-8',
  'Content-Transfer-Encoding: 8bit',
  'X-Mailer: projekt-ep-kontakt',
]);

$ok = mail(TO, $subject, $body, $headers, '-f' . FROM);
back($ok ? 'ok=1' : 'err=send');
