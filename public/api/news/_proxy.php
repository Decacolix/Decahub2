<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/_http.php';

/** Sends a JSON error response and stops the current request. */
function sendNewsProxyError(int $statusCode, string $message): void
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

/** Retrieves one fixed RSS feed and forwards its XML response to the browser. */
function proxyNewsFeed(string $feedUrl): void
{
    $requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    if ($requestMethod !== 'GET') {
        header('Allow: GET');
        sendNewsProxyError(405, 'Method not allowed.');
    }

    try {
        $upstreamResponse = fetchHttpsResource(
            $feedUrl,
            'application/rss+xml, application/xml, text/xml',
            'Mozilla/5.0 (compatible; Decahub/1.0; RSS reader)'
        );
    } catch (RuntimeException $error) {
        error_log(sprintf('Decahub RSS request failed for %s: %s', $feedUrl, $error->getMessage()));
        sendNewsProxyError(502, 'The news feed could not be retrieved.');
    }

    $responseBody = $upstreamResponse['body'];
    $statusCode = $upstreamResponse['statusCode'];
    $contentType = $upstreamResponse['contentType'];

    if ($statusCode < 200 || $statusCode >= 300) {
        error_log(sprintf('Decahub RSS request to %s returned HTTP %d.', $feedUrl, $statusCode));
        sendNewsProxyError(502, 'The news provider returned an error.');
    }

    $safeContentType = $contentType !== ''
        ? str_replace(["\r", "\n"], '', $contentType)
        : 'application/xml; charset=utf-8';

    http_response_code(200);
    header('Cache-Control: public, max-age=60, s-maxage=300, stale-while-revalidate=600');
    header('Content-Type: ' . $safeContentType);
    header('X-Content-Type-Options: nosniff');
    echo $responseBody;
}

// The helper defines server-side functionality and is not itself an endpoint.
if (basename($_SERVER['SCRIPT_FILENAME'] ?? '') === basename(__FILE__)) {
    http_response_code(404);
    exit;
}
