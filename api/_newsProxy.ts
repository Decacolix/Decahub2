/** Web-handler contract used by Vercel Functions. */
type NewsProxyHandler = {
	fetch: (request: Request) => Promise<Response>;
};

/** Headers accepted by the RSS providers used by Decahub. */
const rssRequestHeaders: Readonly<Record<string, string>> = {
	Accept: 'application/rss+xml, application/xml, text/xml',
	'User-Agent': 'Mozilla/5.0 (compatible; Decahub/1.0; RSS reader)',
};

/** CDN caching policy for successfully retrieved RSS documents. */
const rssCacheControl: string =
	'public, max-age=60, s-maxage=300, stale-while-revalidate=600';

/** Builds a GET-only Vercel Function that forwards one RSS feed. */
export const createNewsProxy = (feedUrl: string): NewsProxyHandler => ({
	async fetch(request: Request): Promise<Response> {
		if (request.method !== 'GET') {
			return Response.json(
				{ error: 'Method not allowed.' },
				{ status: 405, headers: { Allow: 'GET' } },
			);
		}

		try {
			const upstreamResponse: Response = await fetch(feedUrl, {
				headers: rssRequestHeaders,
				signal: request.signal,
			});
			const responseBody: string = await upstreamResponse.text();
			const contentType: string =
				upstreamResponse.headers.get('content-type') ??
				'application/xml; charset=utf-8';

			return new Response(responseBody, {
				status: upstreamResponse.status,
				headers: {
					'Cache-Control': upstreamResponse.ok
						? rssCacheControl
						: 'no-store',
					'Content-Type': contentType,
					'X-Content-Type-Options': 'nosniff',
				},
			});
		} catch (error: unknown) {
			console.error(`Could not retrieve RSS feed ${feedUrl}.`, error);

			return Response.json(
				{ error: 'The news feed could not be retrieved.' },
				{ status: 502, headers: { 'Cache-Control': 'no-store' } },
			);
		}
	},
});
