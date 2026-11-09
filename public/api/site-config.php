<?php
/**
 * Headline Central — Live Server Persistence & Media Upload Endpoint
 * Stores CMS configuration (Hero Banners, GTM/SEO, Categories, Header/Footer, Blogs)
 * and uploaded media assets directly on the live hosting server.
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-HC-Admin');
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

$uploadsDir = dirname(__DIR__) . '/uploads';
if (!is_dir($uploadsDir)) {
    @mkdir($uploadsDir, 0755, true);
}

$allowedKeys = [
    'hero_banners',
    'seo_tracking',
    'categories',
    'header_footer',
    'contact_page',
    'blogs'
];

// Handle Multipart File Upload (?action=upload)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'upload') {
    header('Content-Type: application/json; charset=utf-8');
    if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'No valid file uploaded.']);
        exit;
    }

    $file = $_FILES['file'];
    $origName = basename($file['name']);
    $ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));
    $allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'mp4', 'webm', 'ogg', 'mov'];

    if (!in_array($ext, $allowedExts, true)) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Unsupported file extension.']);
        exit;
    }

    $folder = isset($_POST['folder']) ? preg_replace('/[^a-zA-Z0-9_-]/', '', $_POST['folder']) : 'blogs';
    if (!$folder) {
        $folder = 'blogs';
    }

    $targetSubDir = $uploadsDir . '/' . $folder;
    if (!is_dir($targetSubDir)) {
        @mkdir($targetSubDir, 0755, true);
    }

    $safeBase = preg_replace('/[^a-zA-Z0-9._-]/', '_', pathinfo($origName, PATHINFO_FILENAME));
    $finalName = time() . '-' . substr(md5(uniqid('', true)), 0, 6) . '-' . $safeBase . '.' . $ext;
    $destPath = $targetSubDir . '/' . $finalName;

    if (@move_uploaded_file($file['tmp_name'], $destPath)) {
        $publicUrl = '/uploads/' . $folder . '/' . $finalName;
        echo json_encode([
            'ok' => true,
            'url' => $publicUrl,
            'name' => $origName
        ]);
        exit;
    } else {
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => 'Failed to move uploaded file.']);
        exit;
    }
}

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $key = isset($_GET['key']) ? $_GET['key'] : 'all';

    if ($key === 'all') {
        $result = [];
        foreach ($allowedKeys as $k) {
            $filePath = $dataDir . '/' . $k . '.json';
            if (is_file($filePath)) {
                $raw = @file_get_contents($filePath);
                $decoded = $raw ? json_decode($raw, true) : null;
                if ($decoded !== null) {
                    $result[$k] = $decoded;
                }
            }
        }
        echo json_encode(['ok' => true, 'data' => $result]);
        exit;
    }

    if (!in_array($key, $allowedKeys, true)) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Invalid config key.']);
        exit;
    }

    $filePath = $dataDir . '/' . $key . '.json';
    if (!is_file($filePath)) {
        echo json_encode(['ok' => true, 'exists' => false, 'data' => null]);
        exit;
    }

    $raw = @file_get_contents($filePath);
    $decoded = $raw ? json_decode($raw, true) : null;
    echo json_encode([
        'ok' => true,
        'exists' => true,
        'data' => $decoded
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $payload = $rawInput ? json_decode($rawInput, true) : null;

    if (!is_array($payload) || !isset($payload['key']) || !in_array($payload['key'], $allowedKeys, true)) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Invalid payload or key.']);
        exit;
    }

    $key = $payload['key'];
    $data = isset($payload['data']) ? $payload['data'] : null;
    $filePath = $dataDir . '/' . $key . '.json';

    $encoded = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    if ($encoded === false) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Failed to encode JSON.']);
        exit;
    }

    $written = @file_put_contents($filePath, $encoded, LOCK_EX);
    if ($written === false) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => 'Failed to write config file on server.']);
        exit;
    }

    echo json_encode([
        'ok' => true,
        'key' => $key,
        'updatedAt' => gmdate('c')
    ]);
    exit;
}

http_response_code(405);
echo json_encode(['ok' => false, 'error' => 'Method not allowed.']);

