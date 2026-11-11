<?php
/**
 * Headline Central — Blog Comments API Endpoint (with 5-Layer Smart Anti-Spam Shield)
 * Stores, reads, filters, rate-limits, and moderates reader comments for blog articles.
 */

ini_set('display_errors', '0');
error_reporting(0);

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
$rateLimitFile = $dataDir . '/comments_ratelimit.json';

function readJsonData($file) {
    if (!is_file($file)) {
        return [];
    }
    $raw = @file_get_contents($file);
    $arr = $raw ? json_decode($raw, true) : null;
    return is_array($arr) ? $arr : [];
}

function writeJsonData($file, $data) {
    $encoded = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    return @file_put_contents($file, $encoded, LOCK_EX) !== false;
}

function isAdminRequest() {
    $header = isset($_SERVER['HTTP_X_HC_ADMIN']) ? trim($_SERVER['HTTP_X_HC_ADMIN']) : '';
    return $header === 'HC-CMS-Admin-2026';
}

function getClientIpHash() {
    $ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '127.0.0.1';
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $parts = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        $ip = trim($parts[0]);
    }
    return substr(hash('sha256', $ip . '_hc_comment_salt_2026'), 0, 16);
}

/**
 * Evaluate comment content, author name, and email for spam signals.
 * Returns: ['decision' => 'allow'|'pending'|'block', 'reason' => string]
 */
function evaluateSpamHeuristics($rawAuthor, $rawEmail, $rawContent) {
    // 1. Block HTML or BBCode link injection attempts in raw input
    if (preg_match('/(<\s*a\s+href|<\s*script|<\s*iframe|\[url=|\[link=)/i', $rawContent . ' ' . $rawAuthor)) {
        return [
            'decision' => 'block',
            'reason' => 'HTML tags and BBCode links are not permitted in comments.'
        ];
    }

    // 2. Validate author name (no URLs or domain names in name field)
    if (preg_match('/(https?:\/\/|www\.|\.(com|net|org|ru|xyz|info|biz|io|co)\b)/i', $rawAuthor)) {
        return [
            'decision' => 'block',
            'reason' => 'Please enter a valid personal name without links or domains.'
        ];
    }

    // 3. Disposable / burner email domain blocklist
    $emailParts = explode('@', strtolower($rawEmail));
    $domain = isset($emailParts[1]) ? trim($emailParts[1]) : '';
    $disposableDomains = [
        'mailinator.com', 'guerrillamail.com', '10minutemail.com', 'tempmail.com',
        'temp-mail.org', 'yopmail.com', 'trashmail.com', 'sharklasers.com',
        'getnada.com', 'maildrop.cc', 'dispostable.com', 'fakeinbox.com',
        'throwawaymail.com', 'mailnesia.com', 'burnermail.io', 'tempmailo.com'
    ];
    if (in_array($domain, $disposableDomains, true)) {
        return [
            'decision' => 'block',
            'reason' => 'Disposable or temporary email addresses are not permitted.'
        ];
    }

    // 4. Count URLs in comment body
    $urlCount = preg_match_all('/(https?:\/\/|www\.|[a-z0-9\-]+\.(com|net|org|co\.za|io|ru|xyz|info|biz|me|ly|gl)\/)/i', $rawContent, $matches);
    if ($urlCount > 2) {
        return [
            'decision' => 'block',
            'reason' => 'For spam protection, comments may not contain more than 2 links.'
        ];
    }

    // 5. High-confidence spam keywords & patterns (Hard Block)
    $hardSpamPatterns = [
        '/\b(viagra|cialis|levitra|casino|slot\s*gacor|poker\s*online|betting|sportsbook|payday\s*loan)\b/i',
        '/\b(crypto\s*recovery|hack\s*recovery|recover\s*lost\s*(bitcoin|crypto|funds)|whatsapp\s*\+?\d{7,})\b/i',
        '/\b(buy\s*backlinks|seo\s*services|guest\s*post\s*service|rank\s*your\s*website|cheap\s*traffic)\b/i',
        '/\b(telegram\s*@?[a-z0-9_]{4,}|signal\s*\+?\d{7,})\b/i',
        '/(.)\1{14,}/u' // 15+ identical consecutive characters
    ];
    foreach ($hardSpamPatterns as $pattern) {
        if (preg_match($pattern, $rawContent) || preg_match($pattern, $rawAuthor)) {
            return [
                'decision' => 'block',
                'reason' => 'Your comment triggered our automated spam filter and could not be posted.'
            ];
        }
    }

    // 6. Soft Flag -> Quarantine as 'pending' for editorial review
    if ($urlCount >= 1) {
        return [
            'decision' => 'pending',
            'reason' => 'Contains external link (' . $urlCount . ')'
        ];
    }

    $softFlagPatterns = [
        '/\b(check\s*out\s*my|visit\s*my\s*(site|website|blog|channel)|promo\s*code|discount\s*code|free\s*money|make\s*\$\d+|earn\s*\$\d+|dm\s*me|contact\s*me\s*at)\b/i'
    ];
    foreach ($softFlagPatterns as $pattern) {
        if (preg_match($pattern, $rawContent)) {
            return [
                'decision' => 'pending',
                'reason' => 'Flagged for promotional phrasing'
            ];
        }
    }

    return [
        'decision' => 'allow',
        'reason' => ''
    ];
}

// GET: Retrieve comments
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $comments = readJsonData($commentsFile);
    $articleId = isset($_GET['articleId']) ? trim($_GET['articleId']) : '';
    $articleSlug = isset($_GET['articleSlug']) ? trim($_GET['articleSlug']) : '';
    $isAll = isset($_GET['all']) && $_GET['all'] === '1';

    if ($isAll) {
        $isAdmin = isAdminRequest();
        $out = [];
        foreach ($comments as $c) {
            if (!$isAdmin) {
                $status = isset($c['status']) ? $c['status'] : 'approved';
                if ($status !== 'approved') {
                    continue;
                }
                unset($c['authorEmail'], $c['ipHash']);
            }
            $out[] = $c;
        }
        echo json_encode([
            'ok' => true,
            'total' => count($out),
            'comments' => $out
        ]);
        exit;
    }

    $filtered = [];
    foreach ($comments as $c) {
        $status = isset($c['status']) ? $c['status'] : 'approved';
        if ($status !== 'approved') {
            continue;
        }

        $matchId = $articleId && isset($c['articleId']) && $c['articleId'] === $articleId;
        $matchSlug = $articleSlug && isset($c['articleSlug']) && $c['articleSlug'] === $articleSlug;
        if ($matchId || $matchSlug || (!$articleId && !$articleSlug)) {
            $publicComment = $c;
            unset($publicComment['authorEmail'], $publicComment['ipHash']);
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

// POST: Create, Like, or Moderate comments
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

        $comments = readJsonData($commentsFile);
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
            writeJsonData($commentsFile, $comments);
            echo json_encode(['ok' => true, 'id' => $commentId, 'likes' => $updatedLikes]);
            exit;
        } else {
            http_response_code(404);
            echo json_encode(['ok' => false, 'error' => 'Comment not found.']);
            exit;
        }
    }

    // Action: Moderate comment status (Admin only: approve / pending / spam)
    if ($action === 'moderate') {
        if (!isAdminRequest()) {
            http_response_code(403);
            echo json_encode(['ok' => false, 'error' => 'Unauthorized moderation request.']);
            exit;
        }

        $commentId = isset($payload['id']) ? trim($payload['id']) : '';
        $newStatus = isset($payload['status']) ? trim($payload['status']) : '';
        if (!$commentId || !in_array($newStatus, ['approved', 'pending', 'spam'], true)) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'error' => 'Valid comment ID and status required.']);
            exit;
        }

        $comments = readJsonData($commentsFile);
        $found = false;
        foreach ($comments as &$c) {
            if (isset($c['id']) && $c['id'] === $commentId) {
                $c['status'] = $newStatus;
                if ($newStatus === 'approved') {
                    unset($c['moderationReason']);
                }
                $found = true;
                break;
            }
        }
        unset($c);

        if ($found) {
            writeJsonData($commentsFile, $comments);
            echo json_encode(['ok' => true, 'id' => $commentId, 'status' => $newStatus]);
            exit;
        } else {
            http_response_code(404);
            echo json_encode(['ok' => false, 'error' => 'Comment not found.']);
            exit;
        }
    }

    // Action: Purge all comments marked as spam (Admin only)
    if ($action === 'purge_spam') {
        if (!isAdminRequest()) {
            http_response_code(403);
            echo json_encode(['ok' => false, 'error' => 'Unauthorized moderation request.']);
            exit;
        }

        $comments = readJsonData($commentsFile);
        $beforeCount = count($comments);
        $comments = array_values(array_filter($comments, function($c) {
            return !isset($c['status']) || $c['status'] !== 'spam';
        }));
        $removedCount = $beforeCount - count($comments);
        writeJsonData($commentsFile, $comments);

        echo json_encode([
            'ok' => true,
            'removedCount' => $removedCount,
            'remainingCount' => count($comments)
        ]);
        exit;
    }

    // Action: Create comment
    $rawAuthor = isset($payload['authorName']) ? trim($payload['authorName']) : '';
    $rawEmail = isset($payload['authorEmail']) ? trim($payload['authorEmail']) : '';
    $rawContent = isset($payload['content']) ? trim($payload['content']) : '';
    $honeypot = isset($payload['websiteUrl']) ? trim($payload['websiteUrl']) : '';
    $elapsedMs = isset($payload['elapsedMs']) ? intval($payload['elapsedMs']) : 10000;

    $articleId = isset($payload['articleId']) ? trim(strip_tags($payload['articleId'])) : '';
    $articleSlug = isset($payload['articleSlug']) ? trim(strip_tags($payload['articleSlug'])) : '';
    $authorName = trim(strip_tags($rawAuthor));
    $authorEmail = strtolower(trim(strip_tags($rawEmail)));
    $content = trim(strip_tags($rawContent));

    // LAYER 1: Invisible Honeypot & Speed Trap (< 2.5 seconds)
    // Silently fake success so automated bots move on without retrying
    if ($honeypot !== '' || ($elapsedMs > 0 && $elapsedMs < 2500)) {
        echo json_encode([
            'ok' => true,
            'shadowDropped' => true,
            'comment' => [
                'id' => 'cmt-' . time() . '-bot',
                'articleId' => $articleId,
                'articleSlug' => $articleSlug,
                'authorName' => $authorName ?: 'Reader',
                'content' => $content,
                'createdAt' => gmdate('c'),
                'likes' => 0,
                'status' => 'spam'
            ]
        ]);
        exit;
    }

    // Basic field length & format validation
    if (!$authorName || mb_strlen($authorName) < 2 || mb_strlen($authorName) > 60) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Please provide a valid name (2 to 60 characters).']);
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

    // LAYER 2: IP Rate Limiting (45s cooldown & max 5 comments per 15 mins)
    $ipHash = getClientIpHash();
    $now = time();
    $rateData = readJsonData($rateLimitFile);
    $cleanedRateData = [];
    foreach ($rateData as $hashKey => $timestamps) {
        if (is_array($timestamps)) {
            $recent = array_values(array_filter($timestamps, function($ts) use ($now) {
                return ($now - intval($ts)) < 900; // keep last 15 minutes
            }));
            if (!empty($recent)) {
                $cleanedRateData[$hashKey] = $recent;
            }
        }
    }

    $userTimestamps = isset($cleanedRateData[$ipHash]) ? $cleanedRateData[$ipHash] : [];
    if (!empty($userTimestamps)) {
        $lastPostTime = max($userTimestamps);
        $secondsSinceLast = $now - $lastPostTime;
        if ($secondsSinceLast < 45) {
            $waitSec = 45 - $secondsSinceLast;
            http_response_code(429);
            echo json_encode([
                'ok' => false,
                'error' => "Please wait {$waitSec} seconds before posting another comment."
            ]);
            exit;
        }
        if (count($userTimestamps) >= 5) {
            http_response_code(429);
            echo json_encode([
                'ok' => false,
                'error' => 'Too many comments submitted recently. Please try again in 15 minutes.'
            ]);
            exit;
        }
    }

    $comments = readJsonData($commentsFile);

    // Duplicate message check (same normalized text within last 24 hours)
    $normalizedNew = strtolower(preg_replace('/\s+/', ' ', $content));
    foreach ($comments as $existing) {
        $existingNormalized = strtolower(preg_replace('/\s+/', ' ', isset($existing['content']) ? $existing['content'] : ''));
        if ($existingNormalized === $normalizedNew) {
            $existingTime = isset($existing['createdAt']) ? strtotime($existing['createdAt']) : 0;
            if ($existingTime && ($now - $existingTime) < 86400) {
                http_response_code(409);
                echo json_encode([
                    'ok' => false,
                    'error' => 'This exact comment has already been posted recently.'
                ]);
                exit;
            }
        }
    }

    // LAYER 3: Content & Heuristic Spam Evaluation
    $evaluation = evaluateSpamHeuristics($rawAuthor, $rawEmail, $rawContent);
    if ($evaluation['decision'] === 'block') {
        http_response_code(422);
        echo json_encode([
            'ok' => false,
            'error' => $evaluation['reason']
        ]);
        exit;
    }

    $commentStatus = $evaluation['decision'] === 'pending' ? 'pending' : 'approved';

    $newComment = [
        'id' => 'cmt-' . $now . '-' . substr(md5(uniqid('', true)), 0, 6),
        'articleId' => $articleId,
        'articleSlug' => $articleSlug,
        'authorName' => $authorName,
        'authorEmail' => $authorEmail,
        'ipHash' => $ipHash,
        'content' => $content,
        'createdAt' => gmdate('c'),
        'likes' => 0,
        'status' => $commentStatus
    ];

    if (!empty($evaluation['reason'])) {
        $newComment['moderationReason'] = $evaluation['reason'];
    }

    array_unshift($comments, $newComment);
    writeJsonData($commentsFile, $comments);

    // Record timestamp for IP rate limiting
    $userTimestamps[] = $now;
    $cleanedRateData[$ipHash] = $userTimestamps;
    writeJsonData($rateLimitFile, $cleanedRateData);

    $publicComment = $newComment;
    unset($publicComment['authorEmail'], $publicComment['ipHash']);

    echo json_encode([
        'ok' => true,
        'status' => $commentStatus,
        'pendingModeration' => ($commentStatus === 'pending'),
        'comment' => $publicComment
    ]);
    exit;
}

// DELETE: Delete comment (Admin moderation)
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    if (!isAdminRequest()) {
        http_response_code(403);
        echo json_encode(['ok' => false, 'error' => 'Unauthorized delete request.']);
        exit;
    }

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

    $comments = readJsonData($commentsFile);
    $initialCount = count($comments);
    $comments = array_values(array_filter($comments, function($c) use ($commentId) {
        return !isset($c['id']) || $c['id'] !== $commentId;
    }));

    if (count($comments) < $initialCount) {
        writeJsonData($commentsFile, $comments);
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
