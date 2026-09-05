<?php

declare(strict_types=1);

/**
 * Retrieves a fixed HTTPS resource through cURL or PHP streams.
 *
 * @return array{body: string, contentType: string, statusCode: int}
 */
function fetchHttpsResource(string $url, string $accept, string $userAgent): array
{
    if (function_exists('curl_init')) {
        return fetchHttpsResourceWithCurl($url, $accept, $userAgent);
    }

    if (
        filter_var(ini_get('allow_url_fopen'), FILTER_VALIDATE_BOOLEAN) &&
        in_array('https', stream_get_wrappers(), true)
    ) {
        return fetchHttpsResourceWithStreams($url, $accept, $userAgent);
    }

    throw new RuntimeException(
        'Neither cURL nor an allow_url_fopen HTTPS stream is available.'
    );
}

/**
 * Retrieves an HTTPS resource with PHP's cURL extension.
 *
 * @return array{body: string, contentType: string, statusCode: int}
 */
function fetchHttpsResourceWithCurl(
    string $url,
    string $accept,
    string $userAgent
): array {
    $curlHandle = curl_init($url);

    if ($curlHandle === false) {
        throw new RuntimeException('The cURL request could not be initialized.');
    }

    curl_setopt_array($curlHandle, [
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_ENCODING => '',
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTPHEADER => ['Accept: ' . $accept],
        CURLOPT_MAXREDIRS => 5,
        CURLOPT_PROTOCOLS => CURLPROTO_HTTPS,
        CURLOPT_REDIR_PROTOCOLS => CURLPROTO_HTTPS,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 15,
        CURLOPT_USERAGENT => $userAgent,
    ]);

    $responseBody = curl_exec($curlHandle);
    $statusCode = (int) curl_getinfo($curlHandle, CURLINFO_HTTP_CODE);
    $contentType = curl_getinfo($curlHandle, CURLINFO_CONTENT_TYPE);
    $curlError = curl_error($curlHandle);
    curl_close($curlHandle);

    if ($responseBody === false) {
        throw new RuntimeException('The cURL request failed: ' . $curlError);
    }

    return [
        'body' => $responseBody,
        'contentType' => is_string($contentType) ? $contentType : '',
        'statusCode' => $statusCode,
    ];
}

/**
 * Retrieves an HTTPS resource when the cURL extension is unavailable.
 *
 * @return array{body: string, contentType: string, statusCode: int}
 */
function fetchHttpsResourceWithStreams(
    string $url,
    string $accept,
    string $userAgent
): array {
    $streamContext = stream_context_create([
        'http' => [
            'follow_location' => 1,
            'header' => implode("\r\n", [
                'Accept: ' . $accept,
                'User-Agent: ' . $userAgent,
                'Connection: close',
            ]),
            'ignore_errors' => true,
            'max_redirects' => 5,
            'method' => 'GET',
            'timeout' => 15,
        ],
        'ssl' => [
            'verify_peer' => true,
            'verify_peer_name' => true,
        ],
    ]);
    $responseBody = @file_get_contents($url, false, $streamContext);

    if ($responseBody === false) {
        $lastError = error_get_last();
        $errorMessage = is_array($lastError) && isset($lastError['message'])
            ? (string) $lastError['message']
            : 'Unknown stream error.';

        throw new RuntimeException('The stream request failed: ' . $errorMessage);
    }

    $responseHeaders = isset($http_response_header) && is_array($http_response_header)
        ? $http_response_header
        : [];
    $statusCode = 0;
    $contentType = '';

    foreach ($responseHeaders as $responseHeader) {
        if (preg_match('/^HTTP\/\S+\s+(\d{3})/i', $responseHeader, $matches) === 1) {
            $statusCode = (int) $matches[1];
        }

        if (stripos($responseHeader, 'Content-Type:') === 0) {
            $contentType = trim(substr($responseHeader, strlen('Content-Type:')));
        }
    }

    return [
        'body' => $responseBody,
        'contentType' => $contentType,
        'statusCode' => $statusCode,
    ];
}

// The helper defines server-side functionality and is not itself an endpoint.
if (basename($_SERVER['SCRIPT_FILENAME'] ?? '') === basename(__FILE__)) {
    http_response_code(404);
    exit;
}
