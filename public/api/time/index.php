<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/_http.php';

/** Sends a JSON error response and stops the current request. */
function sendTimeProxyError(int $statusCode, string $message): void
{
    http_response_code($statusCode);
    header('Cache-Control: no-store');
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    echo json_encode(
        ['error' => $message],
        JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
    );
    exit;
}

$requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($requestMethod !== 'GET') {
    header('Allow: GET');
    sendTimeProxyError(405, 'Method not allowed.');
}

$timeZoneParameter = $_GET['timeZone'] ?? '';

if (!is_string($timeZoneParameter)) {
    sendTimeProxyError(400, 'The timeZone query parameter is invalid.');
}

$timeZone = trim($timeZoneParameter);

if (
    $timeZone === '' ||
    strlen($timeZone) > 100 ||
    preg_match('/^[A-Za-z0-9_+\-\/]+$/', $timeZone) !== 1
) {
    sendTimeProxyError(400, 'The timeZone query parameter is invalid.');
}

$upstreamUrl = 'https://timeapi.io/api/v1/timezone/zone?' . http_build_query(
    ['timeZone' => $timeZone],
    '',
    '&',
    PHP_QUERY_RFC3986
);

try {
    $upstreamResponse = fetchHttpsResource(
        $upstreamUrl,
        'application/json',
        'Mozilla/5.0 (compatible; Decahub/1.0)'
    );
} catch (RuntimeException $error) {
    error_log(sprintf('Decahub TimeAPI request failed: %s', $error->getMessage()));
    sendTimeProxyError(502, 'The current time could not be retrieved.');
}

$responseBody = $upstreamResponse['body'];
$statusCode = $upstreamResponse['statusCode'];
$contentType = $upstreamResponse['contentType'];

if ($statusCode < 200 || $statusCode >= 300) {
    error_log(sprintf('Decahub TimeAPI request returned HTTP %d.', $statusCode));
    sendTimeProxyError(502, 'TimeAPI returned an error.');
}

$safeContentType = $contentType !== ''
    ? str_replace(["\r", "\n"], '', $contentType)
    : 'application/json; charset=utf-8';

http_response_code(200);
header('Cache-Control: no-store');
header('Content-Type: ' . $safeContentType);
header('X-Content-Type-Options: nosniff');
echo $responseBody;
