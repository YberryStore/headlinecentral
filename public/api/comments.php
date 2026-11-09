<?php
/**
 * Headline Central — Blog Comments API Endpoint
 * Stores, reads, and moderates reader comments for blog articles.
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
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

$commentsFile = $dataDir . '/comments.json';

function readAllComments($file) {
    if (!is_file($file)) {
        return [];
    }
    $raw = @file_get_contents($file);
    $arr = $raw ? json_decode($raw, true) : null;
    return is_array($arr) ? $arr : [];
}

function writeAllComments($file, $comments) {
    $encoded = json_encode($comments, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    return @file_put_contents($file, $encoded, LOCK_EX) !== false;
}

// GET: Retrieve comments
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $comments = readAllComments($commentsFile);
    $articleId = isset($_GET['articleId']) ? trim($_GET['articleId']) : '';
    $articleSlug = isset($_GET['articleSlug']) ? trim($_GET['articleSlug']) : '';
    $isAll = isset($_GET['all']) && $_GET['all'] === '1';

    if ($isAll) {
        echo json_encode([
            'ok' => true,
            'total' => count($comments),
            'comments' => $comments
        ]);
        exit;
    }

    $filtered = [];
    foreach ($comments as $c) {
        $matchId = $articleId && isset($c['articleId']) && $c['articleId'] === $articleId;
        $matchSlug = $articleSlug && isset($c['articleSlug']) && $c['articleSlug'] === $articleSlug;
        if ($matchId || $matchSlug || (!$articleId && !$articleSlug)) {
            // Strip private email from public read response
            $publicComment = $c;
            unset($publicComment['authorEmail']);
            $filtered[] = $publicComment;
        }
    }

    echo json_encode([
        'ok' => true,
        'count' => count($filtered),
        'comments' => $filtered
    ]);
    exit;
}

// POST: Add new comment or like comment
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $payload = $rawInput ? json_decode($rawInput, true) : null;

    if (!is_array($payload)) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Invalid JSON payload.']);
        exit;
    }

    $action = isset($payload['action']) ? $payload['action'] : 'create';

    // Action: Like a comment
    if ($action === 'like') {
        $commentId = isset($payload['id']) ? trim($payload['id']) : '';
        if (!$commentId) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'error' => 'Comment ID required.']);
            exit;
        }

        $comments = readAllComments($commentsFile);
        $found = false;
        $updatedLikes = 0;
        foreach ($comments as &$c) {
            if (isset($c['id']) && $c['id'] === $commentId) {
                $c['likes'] = (isset($c['likes']) ? intval($c['likes']) : 0) + 1;
                $updatedLikes = $c['likes'];
                $found = true;
                break;
            }
        }
        unset($c);

        if ($found) {
            writeAllComments($commentsFile, $comments);
            echo json_encode(['ok' => true, 'id' => $commentId, 'likes' => $updatedLikes]);
            exit;
        } else {
            http_response_code(404);
            echo json_encode(['ok' => false, 'error' => 'Comment not found.']);
            exit;
        }
    }

    // Action: Create comment
    $articleId = isset($payload['articleId']) ? trim($payload['articleId']) : '';
    $articleSlug = isset($payload['articleSlug']) ? trim($payload['articleSlug']) : '';
    $authorName = isset($payload['authorName']) ? trim(strip_tags($payload['authorName'])) : '';
    $authorEmail = isset($payload['authorEmail']) ? trim(strip_tags($payload['authorEmail'])) : '';
    $content = isset($payload['content']) ? trim(strip_tags($payload['content'])) : '';

    if (!$authorName || mb_strlen($authorName) < 2) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Please provide your name (at least 2 characters).']);
        exit;
    }

    if (!$authorEmail || !filter_var($authorEmail, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Please provide a valid email address.']);
        exit;
    }

    if (!$content || mb_strlen($content) < 3) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Comment text must be at least 3 characters.']);
        exit;
    }

    if (mb_strlen($content) > 3000) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Comment is too long (maximum 3000 characters).']);
        exit;
    }

    $comments = readAllComments($commentsFile);

    $newComment = [
        'id' => 'cmt-' . time() . '-' . substr(md5(uniqid('', true)), 0, 6),
        'articleId' => $articleId,
        'articleSlug' => $articleSlug,
        'authorName' => $authorName,
        'authorEmail' => $authorEmail,
        'content' => $content,
        'createdAt' => gmdate('c'),
        'likes' => 0,
        'status' => 'approved'
    ];

    array_unshift($comments, $newComment);
    writeAllComments($commentsFile, $comments);

    $publicComment = $newComment;
    unset($publicComment['authorEmail']);

    echo json_encode([
        'ok' => true,
        'comment' => $publicComment
    ]);
    exit;
}

// DELETE: Delete comment (Admin moderation)
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $commentId = isset($_GET['id']) ? trim($_GET['id']) : '';
    if (!$commentId) {
        $rawInput = file_get_contents('php://input');
        $payload = $rawInput ? json_decode($rawInput, true) : null;
        if (is_array($payload) && isset($payload['id'])) {
            $commentId = trim($payload['id']);
        }
    }

    if (!$commentId) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Comment ID required.']);
        exit;
    }

    $comments = readAllComments($commentsFile);
    $initialCount = count($comments);
    $comments = array_values(array_filter($comments, function($c) use ($commentId) {
        return !isset($c['id']) || $c['id'] !== $commentId;
    }));

    if (count($comments) < $initialCount) {
        writeAllComments($commentsFile, $comments);
        echo json_encode(['ok' => true, 'deletedId' => $commentId]);
        exit;
    } else {
        http_response_code(404);
        echo json_encode(['ok' => false, 'error' => 'Comment not found.']);
        exit;
    }
}

http_response_code(405);
echo json_encode(['ok' => false, 'error' => 'Method not allowed.']);

