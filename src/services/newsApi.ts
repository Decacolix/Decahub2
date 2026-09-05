import { getNewsSource, type NewsSourceId } from '../config/newsSources';
import type { NewsArticle } from '../types/news';

/** Maximum number of headlines shown in the news panel. */
const articleLimit: number = 6;

/** Finds a direct XML child by its namespace-agnostic local name. */
const getChild = (
	element: Element,
	localNames: readonly string[],
): Element | undefined =>
	Array.from(element.children).find((child) =>
		localNames.includes(child.localName.toLowerCase()),
	);

/** Reads and trims a matching direct XML child's text. */
const getChildText = (element: Element, localNames: readonly string[]): string =>
	getChild(element, localNames)?.textContent?.trim() ?? '';

/** Extracts a safe HTTP(S) article URL from RSS or Atom markup. */
const getArticleUrl = (element: Element): string => {
	const linkElement: Element | undefined = getChild(element, ['link']);
	const rawUrl: string =
		linkElement?.getAttribute('href')?.trim() ||
		linkElement?.textContent?.trim() ||
		getChildText(element, ['guid', 'id']);

	try {
		const url: URL = new URL(rawUrl);

		return url.protocol === 'https:' || url.protocol === 'http:'
			? url.toString()
			: '';
	} catch {
		return '';
	}
};

/** Normalizes one valid RSS/Atom entry or rejects it with `null`. */
const parseArticle = (element: Element): NewsArticle | null => {
	const title: string = getChildText(element, ['title']);
	const url: string = getArticleUrl(element);
	const publishedDate: string = getChildText(element, [
		'pubdate',
		'published',
		'updated',
		'date',
	]);
	const publishedTime: number = Date.parse(publishedDate);

	if (!title || !url || !Number.isFinite(publishedTime)) {
		return null;
	}

	return {
		id: getChildText(element, ['guid', 'id']) || url,
		title,
		url,
		publishedAt: new Date(publishedTime).toISOString(),
	};
};

/** Parses RSS or Atom XML, then returns the six newest valid articles. */
const parseNewsFeed = (feedXml: string): NewsArticle[] => {
	const document: Document = new DOMParser().parseFromString(
		feedXml,
		'application/xml',
	);

	if (document.querySelector('parsererror')) {
		throw new Error('The news source returned invalid XML.');
	}

	const rssItems: Element[] = Array.from(document.getElementsByTagName('item'));
	const feedItems: Element[] =
		rssItems.length > 0
			? rssItems
			: Array.from(document.getElementsByTagNameNS('*', 'entry'));

	return feedItems
		.map(parseArticle)
		.filter((article): article is NewsArticle => article !== null)
		.sort(
			(firstArticle, secondArticle) =>
				secondArticle.publishedAt.localeCompare(firstArticle.publishedAt),
		)
		.slice(0, articleLimit);
};

/** Fetches and parses the configured RSS source. */
export const fetchNews = async (
	newsSourceId: NewsSourceId,
	signal: AbortSignal,
): Promise<NewsArticle[]> => {
	const newsSource = getNewsSource(newsSourceId);
	const response: Response = await fetch(newsSource.endpoint, {
		headers: {
			Accept: 'application/rss+xml, application/xml, text/xml',
		},
		signal,
	});

	if (!response.ok) {
		throw new Error(`${newsSource.name} returned ${response.status}.`);
	}

	const articles: NewsArticle[] = parseNewsFeed(await response.text());

	if (articles.length === 0) {
		throw new Error(`${newsSource.name} did not return any valid articles.`);
	}

	return articles;
};
