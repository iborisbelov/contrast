<?php
/**
 * Folio AI proxy → Groq.
 * - The API key lives outside the web root (~/folio-secrets/config.php), never in the browser or the repo.
 * - Prompts are built here from a fixed set of tasks, so this endpoint can't be used as a general LLM proxy.
 * - Simple per-IP rate limit.
 */
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo '{"error":"method"}'; exit; }

$cfg = @include getenv('HOME') . '/folio-secrets/config.php';
if (!$cfg) $cfg = @include dirname(__DIR__, 4) . '/folio-secrets/config.php';
if (!$cfg || empty($cfg['groq_key'])) { http_response_code(500); echo '{"error":"not_configured"}'; exit; }

// --- rate limit: 120 requests / 10 min per IP ---
$ip = preg_replace('/[^0-9a-f:.]/i', '', $_SERVER['REMOTE_ADDR'] ?? 'x');
$rl = sys_get_temp_dir() . '/folio_rl_' . md5($ip);
$now = time(); $hits = array_filter(json_decode(@file_get_contents($rl) ?: '[]', true) ?: [], fn($t) => $t > $now - 600);
if (count($hits) >= 120) { http_response_code(429); echo '{"error":"rate_limited"}'; exit; }
$hits[] = $now; @file_put_contents($rl, json_encode(array_values($hits)));

$in = json_decode(file_get_contents('php://input'), true) ?: [];
$task = $in['task'] ?? '';
$p = $in['payload'] ?? [];
$clip = fn($s, $n = 600) => mb_substr(trim((string)$s), 0, $n);

$brief = "Book idea: " . $clip($p['idea'] ?? '') . "\nReaders: " . $clip($p['audience'] ?? '', 120) .
  "\nVoice: " . $clip($p['tone'] ?? '', 60) . "\nAuthor's own tip/story (use only if given, never invent one): " . $clip($p['story'] ?? '', 500);
$system = "You are a senior non-fiction editor writing short, practical eBooks for experts with no writing background. " .
  "Plain, concrete, warm English. No clichés, no hype words (unlock, elevate, delve, journey, game-changer). " .
  "Never invent personal stories about the author. Always answer with valid JSON only.";

switch ($task) {
  case 'brief':
    $user = "Book idea: " . $clip($p['idea'] ?? '', 300) . "\n\nIs this idea too vague to write a useful short guide (for example a single word like 'bread' or 'life')? "
      . "Return JSON: {\"topic\":\"topic in 1-3 words, Title Case\",\"vague\":true|false,"
      . "\"options\":[3 specific book ideas built from it, one sentence each, only when vague],"
      . "\"audiences\":[{\"t\":\"reader group, 2-4 words\",\"d\":\"who they are, max 8 words\"} x3, clearly different],"
      . "\"tones\":[{\"t\":\"Warm & practical\",\"sample\":\"one opening sentence about this topic in that voice\"},{\"t\":\"Playful\",\"sample\":\"...\"},{\"t\":\"Straight to the point\",\"sample\":\"...\"}]}";
    $max = 500; break;
  case 'plan':
    $n = max(3, min(8, (int)($p['chapters'] ?? 6)));
    $user = "$brief\n\nCreate the plan. Return JSON: {\"titles\":[{\"t\":\"title (max 6 words)\",\"s\":\"subtitle (max 9 words)\"} x3, different angles: direct, intriguing, benefit],"
      . "\"chapters\":[\"chapter title\" x$n, short and specific, in a logical order],"
      . "\"cover\":{\"motif\":one of [\"leaf\",\"wave\",\"sun\",\"peak\",\"star\",\"loaf\",\"wheat\",\"circle\"] that best fits the topic,"
      . "\"palette\":one of [0 flour/warm,1 forest,2 night,3 blush,4 ocean,5 sage],\"font\":one of [\"editorial\",\"modern\",\"classic\"]},"
      . "\"topic\":\"the topic in 1-3 words\",\"suggestions\":[\"3 extra chapter ideas\"]}";
    $max = 700; break;
  case 'chapter':
    $user = "$brief\nBook title: " . $clip($p['title'] ?? '', 120) . "\nAll chapters: " . $clip(implode(' | ', (array)($p['chapters'] ?? [])), 900) .
      "\n\nWrite chapter " . (int)($p['index'] ?? 0) + 1 . ": \"" . $clip($p['chapter'] ?? '', 140) . "\". 3 paragraphs, 50-90 words each, concrete and actionable, matching the voice." .
      (!empty($p['story']) && (int)($p['index'] ?? 0) === 0 ? " Weave the author's tip in naturally in their words." : "") .
      " Return JSON: {\"paras\":[\"...\",\"...\",\"...\"]}";
    $max = 900; break;
  case 'rewrite':
    $how = ['shorter' => 'Make it about half as long, keep the key point.', 'simpler' => 'Use simpler words and shorter sentences for a complete beginner.',
      'example' => 'Keep it and add one concrete, realistic example (one or two sentences).', 'warmer' => 'Make it warmer and more encouraging, same length.',
      'practical' => 'Make it more practical: add one specific step the reader can do today.', 'custom' => $clip($p['instruction'] ?? '', 200)][$p['kind'] ?? 'shorter'] ?? 'Improve it.';
    $variant = (int)($p['variant'] ?? 0);
    $user = "$brief\n\nRewrite this paragraph. $how" . ($variant ? " Give a noticeably different version than before (variant $variant)." : "") .
      "\nParagraph: \"" . $clip($p['text'] ?? '', 1200) . "\"\nReturn JSON: {\"text\":\"...\"}";
    $max = 400; break;
  default: http_response_code(400); echo '{"error":"task"}'; exit;
}

$body = json_encode([
  'model' => $cfg['model'] ?? 'openai/gpt-oss-120b',
  'reasoning_effort' => 'low',
  'messages' => [['role' => 'system', 'content' => $system], ['role' => 'user', 'content' => $user]],
  'temperature' => $task === 'plan' ? 0.8 : 0.7,
  'max_tokens' => $max + 1500,
  'response_format' => ['type' => 'json_object'],
]);
$ch = curl_init('https://api.groq.com/openai/v1/chat/completions');
curl_setopt_array($ch, [CURLOPT_POST => true, CURLOPT_POSTFIELDS => $body, CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 40,
  CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'Authorization: Bearer ' . $cfg['groq_key']]]);
$res = curl_exec($ch); $code = curl_getinfo($ch, CURLINFO_HTTP_CODE); curl_close($ch);
if ($res === false || $code >= 400) { http_response_code(502); echo json_encode(['error' => 'upstream', 'status' => $code]); exit; }
$content = json_decode($res, true)['choices'][0]['message']['content'] ?? '';
$out = json_decode($content, true);
if (!is_array($out)) { http_response_code(502); echo '{"error":"bad_json"}'; exit; }
echo json_encode($out);
