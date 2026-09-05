/** Upstream endpoint used for timezone-aware clock synchronization. */
const timeApiUrl: string = 'https://timeapi.io/api/v1/timezone/zone';

/** Proxies a timezone query to TimeAPI without exposing a cross-origin request. */
export default {
	async fetch(request: Request): Promise<Response> {
		if (request.method !== 'GET') {
			return Response.json(
				{ error: 'Method not allowed.' },
				{ status: 405, headers: { Allow: 'GET' } },
			);
		}

		const requestUrl: URL = new URL(request.url);
		const timeZone: string | null = requestUrl.searchParams.get('timeZone');

		if (!timeZone?.trim()) {
			return Response.json(
				{ error: 'The timeZone query parameter is required.' },
				{ status: 400, headers: { 'Cache-Control': 'no-store' } },
			);
		}

		const upstreamUrl: URL = new URL(timeApiUrl);
		upstreamUrl.searchParams.set('timeZone', timeZone);

		try {
			const upstreamResponse: Response = await fetch(upstreamUrl, {
				headers: { Accept: 'application/json' },
				signal: request.signal,
			});
			const responseBody: string = await upstreamResponse.text();
			const contentType: string =
				upstreamResponse.headers.get('content-type') ??
				'application/json; charset=utf-8';

			return new Response(responseBody, {
				status: upstreamResponse.status,
				headers: {
					'Cache-Control': 'no-store',
					'Content-Type': contentType,
					'X-Content-Type-Options': 'nosniff',
				},
			});
		} catch (error: unknown) {
			console.error('Could not retrieve the current time from TimeAPI.', error);

			return Response.json(
				{ error: 'The current time could not be retrieved.' },
				{ status: 502, headers: { 'Cache-Control': 'no-store' } },
			);
		}
	},
};
