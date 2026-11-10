<?php
/**
 * Headline Central — Realtime Analytics & Unique Page Views API
 * Tracks active live visitors (via heartbeat), unique visitors, and per-article views.
 */

ini_set('display_errors', '1');
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-HC-Admin');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0755, true);
}

$activeVisitorsFile = $dataDir . '/active_visitors.json';
$pageViewsFile = $dataDir . '/page_views.json';
$uniqueLogFile = $dataDir . '/unique_visits_log.json';

function readJsonFile($path, $default = []) {
    if (!is_file($path)) return $default;
    $raw = @file_get_contents($path);
    $arr = $raw ? json_decode($raw, true) : null;
    return is_array($arr) ? $arr : $default;
}

function writeJsonFile($path, $data) {
    $encoded = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    return @file_put_contents($path, $encoded, LOCK_EX) !== false;
}

// Prune inactive visitors older than 120 seconds (2 minutes)
function getActiveVisitorsCount($file) {
    $now = time();
    $visitors = readJsonFile($file, []);
    $cleaned = [];
    $count = 0;
    foreach ($visitors as $hash => $lastSeen) {
        if (($now - (int)$lastSeen) <= 120) {
            $cleaned[$hash] = (int)$lastSeen;
            $count++;
        }
    }
    // Only rewrite if items were pruned
    if (count($visitors) !== count($cleaned)) {
        writeJsonFile($file, $cleaned);
    }
    return $count;
}

// GET: Retrieve analytics summary
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $liveCount = getActiveVisitorsCount($activeVisitorsFile);
    $stats = readJsonFile($pageViewsFile, [
        'totalViews' => 0,
        'totalUniqueVisitors' => 0,
        'pages' => [],
        'articles' => [],
        'updatedAt' => date('c')
    ]);

    echo json_encode([
        'ok' => true,
        'liveVisitors' => $liveCount,
        'totalViews' => (int)($stats['totalViews'] ?? 0),
        'totalUniqueVisitors' => (int)($stats['totalUniqueVisitors'] ?? 0),
        'pages' => $stats['pages'] ?? [],
        'articles' => $stats['articles'] ?? [],
        'updatedAt' => $stats['updatedAt'] ?? date('c')
    ]);
    exit;
}

// POST: Record visit or heartbeat
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $payload = $raw ? json_decode($raw, true) : null;

    if (!is_array($payload)) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Invalid JSON payload']);
        exit;
    }

    $action = $payload['action'] ?? 'visit'; // 'visit' or 'heartbeat'
    $rawVisitorId = trim($payload['visitorId'] ?? '');
    $path = trim($payload['path'] ?? '/');
    $slug = trim($payload['slug'] ?? '');
    
    // Ignore CMS and admin paths from public reader analytics
    if (strpos($path, '/cms') === 0 || strpos($path, '/admin') === 0) {
        $liveCount = getActiveVisitorsCount($activeVisitorsFile);
        echo json_encode(['ok' => true, 'ignored' => true, 'liveVisitors' => $liveCount]);
        exit;
    }

    // Generate a secure anonymous visitor hash (POPIA & GDPR compliant)
    $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
    $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
    $visitorHash = md5($rawVisitorId . '_' . $ip . '_' . $ua);

    $now = time();
    $today = date('Y-m-d');

    // 1. Update Active Live Visitors list
    $activeVisitors = readJsonFile($activeVisitorsFile, []);
    $activeVisitors[$visitorHash] = $now;
    
    // Prune stale visitors (> 120s)
    $cleanedVisitors = [];
    foreach ($activeVisitors as $h => $t) {
        if (($now - (int)$t) <= 120) {
            $cleanedVisitors[$h] = (int)$t;
        }
    }
    writeJsonFile($activeVisitorsFile, $cleanedVisitors);
    $liveCount = count($cleanedVisitors);

    // If this is just a heartbeat ping, exit early after updating active status
    if ($action === 'heartbeat') {
        echo json_encode(['ok' => true, 'action' => 'heartbeat', 'liveVisitors' => $liveCount]);
        exit;
    }

    // 2. Process Page Visit (Unique vs Return)
    $uniqueLog = readJsonFile($uniqueLogFile, []);
    $stats = readJsonFile($pageViewsFile, [
        'totalViews' => 0,
        'totalUniqueVisitors' => 0,
        'pages' => [],
        'articles' => [],
        'updatedAt' => date('c')
    ]);

    // Track total site-wide unique visitor today
    $siteDailyKey = "site_{$today}";
    $isSiteUniqueToday = false;
    if (!isset($uniqueLog[$siteDailyKey]) || !is_array($uniqueLog[$siteDailyKey])) {
        $uniqueLog[$siteDailyKey] = [];
    }
    if (!isset($uniqueLog[$siteDailyKey][$visitorHash])) {
        $uniqueLog[$siteDailyKey][$visitorHash] = true;
        $isSiteUniqueToday = true;
        $stats['totalUniqueVisitors'] = (int)($stats['totalUniqueVisitors'] ?? 0) + 1;
    }
    $stats['totalViews'] = (int)($stats['totalViews'] ?? 0) + 1;

    // Track path-specific unique visit today
    $pathDailyKey = "path_{$today}_" . md5($path);
    $isPathUniqueToday = false;
    if (!isset($uniqueLog[$pathDailyKey]) || !is_array($uniqueLog[$pathDailyKey])) {
        $uniqueLog[$pathDailyKey] = [];
    }
    if (!isset($uniqueLog[$pathDailyKey][$visitorHash])) {
        $uniqueLog[$pathDailyKey][$visitorHash] = true;
        $isPathUniqueToday = true;
    }

    // Update stats for path
    if (!isset($stats['pages'][$path])) {
        $stats['pages'][$path] = ['views' => 0, 'uniqueVisitors' => 0, 'lastVisited' => date('c')];
    }
    $stats['pages'][$path]['views'] = (int)$stats['pages'][$path]['views'] + 1;
    if ($isPathUniqueToday) {
        $stats['pages'][$path]['uniqueVisitors'] = (int)$stats['pages'][$path]['uniqueVisitors'] + 1;
    }
    $stats['pages'][$path]['lastVisited'] = date('c');

    // If an article slug was supplied, update article-specific stats
    if ($slug) {
        if (!isset($stats['articles'][$slug])) {
            $stats['articles'][$slug] = ['views' => 0, 'uniqueVisitors' => 0, 'lastVisited' => date('c')];
        }
        $stats['articles'][$slug]['views'] = (int)$stats['articles'][$slug]['views'] + 1;
        if ($isPathUniqueToday) {
            $stats['articles'][$slug]['uniqueVisitors'] = (int)$stats['articles'][$slug]['uniqueVisitors'] + 1;
        }
        $stats['articles'][$slug]['lastVisited'] = date('c');
    }

    $stats['updatedAt'] = date('c');

    // Prune uniqueLog keys older than 30 days
    $oldCutoff = date('Y-m-d', strtotime('-30 days'));
    foreach (array_keys($uniqueLog) as $k) {
        if (preg_match('/_(\d{4}-\d{2}-\d{2})/', $k, $m)) {
            if ($m[1] < $oldCutoff) {
                unset($uniqueLog[$k]);
            }
        }
    }

    writeJsonFile($pageViewsFile, $stats);
    writeJsonFile($uniqueLogFile, $uniqueLog);

    echo json_encode([
        'ok' => true,
        'liveVisitors' => $liveCount,
        'totalViews' => $stats['totalViews'],
        'totalUniqueVisitors' => $stats['totalUniqueVisitors'],
        'pathStats' => $stats['pages'][$path] ?? null,
        'articleStats' => $slug && isset($stats['articles'][$slug]) ? $stats['articles'][$slug] : null
    ]);
    exit;
}

