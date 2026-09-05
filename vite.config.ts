import { defineConfig, type ProxyOptions } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/** Creates the development proxy used for timezone-aware TimeAPI requests. */
const createTimeApiProxy = (): ProxyOptions => ({
	target: 'https://timeapi.io',
	changeOrigin: true,
	rewrite: (path: string) => path.replace(/^\/api\/time/, '/api/v1/timezone/zone'),
});

/** Creates a development proxy for an RSS feed that does not allow browser CORS. */
const createNewsProxy = (
	target: string,
	feedPath: string,
): ProxyOptions => ({
	target,
	changeOrigin: true,
	followRedirects: true,
	headers: {
		Accept: 'application/rss+xml, application/xml, text/xml',
		'User-Agent': 'Mozilla/5.0 (compatible; Decahub/1.0; RSS reader)',
	},
	rewrite: () => feedPath,
});

/** RSS proxy routes shared by Vite's development and preview servers. */
const newsProxies: Readonly<Record<string, ProxyOptions>> = {
	'/api/news/ct24': createNewsProxy(
		'https://ct24.ceskatelevize.cz',
		'/rss',
	),
	'/api/news/idnes': createNewsProxy(
		'https://servis.idnes.cz',
		'/rss.aspx?c=zpravodaj',
	),
	'/api/news/novinky': createNewsProxy('https://www.novinky.cz', '/rss'),
	'/api/news/aktualne': createNewsProxy(
		'https://www.aktualne.cz',
		'/rss',
	),
	'/api/news/hn': createNewsProxy('https://hn.cz', '/?m=rss'),
	'/api/news/bbc': createNewsProxy(
		'https://feeds.bbci.co.uk',
		'/news/world/rss.xml',
	),
	'/api/news/guardian': createNewsProxy(
		'https://www.theguardian.com',
		'/uk/rss',
	),
	'/api/news/fox': createNewsProxy(
		'https://moxie.foxnews.com',
		'/google-publisher/latest.xml',
	),
	'/api/news/euronews': createNewsProxy(
		'https://www.euronews.com',
		'/rss?format=mrss&level=theme&name=news',
	),
	'/api/news/nbc': createNewsProxy(
		'https://feeds.nbcnews.com',
		'/nbcnews/public/news',
	),
};

export default defineConfig({
	plugins: [react(), tailwindcss()],
	server: {
		proxy: {
			'/api/time': createTimeApiProxy(),
			...newsProxies,
		},
	},
	preview: {
		proxy: {
			'/api/time': createTimeApiProxy(),
			...newsProxies,
		},
	},
});
