/** Geographic grouping used by the two-column source picker. */
export type NewsSourceGroup = 'czech' | 'international';

/** Shared contract for each RSS source configuration. */
type NewsSourceDefinition = {
	endpoint: string;
	group: NewsSourceGroup;
	homepageUrl: string;
	id: string;
	name: string;
};

/** RSS sources available to the news panel. */
export const newsSources = [
	{
		id: 'ct24',
		name: 'ČT24',
		group: 'czech',
		endpoint: '/api/news/ct24',
		homepageUrl: 'https://ct24.ceskatelevize.cz/',
	},
	{
		id: 'idnes',
		name: 'iDNES',
		group: 'czech',
		endpoint: '/api/news/idnes',
		homepageUrl: 'https://www.idnes.cz/zpravy',
	},
	{
		id: 'novinky',
		name: 'Novinky',
		group: 'czech',
		endpoint: '/api/news/novinky',
		homepageUrl: 'https://www.novinky.cz/',
	},
	{
		id: 'aktualne',
		name: 'Aktuálně',
		group: 'czech',
		endpoint: '/api/news/aktualne',
		homepageUrl: 'https://www.aktualne.cz/',
	},
	{
		id: 'hn',
		name: 'Hospodářské noviny',
		group: 'czech',
		endpoint: '/api/news/hn',
		homepageUrl: 'https://hn.cz/',
	},
	{
		id: 'bbc',
		name: 'BBC',
		group: 'international',
		endpoint: '/api/news/bbc',
		homepageUrl: 'https://www.bbc.com/news/world',
	},
	{
		id: 'guardian',
		name: 'The Guardian',
		group: 'international',
		endpoint: '/api/news/guardian',
		homepageUrl: 'https://www.theguardian.com/uk',
	},
	{
		id: 'fox',
		name: 'Fox News',
		group: 'international',
		endpoint: '/api/news/fox',
		homepageUrl: 'https://www.foxnews.com/',
	},
	{
		id: 'euronews',
		name: 'Euronews',
		group: 'international',
		endpoint: '/api/news/euronews',
		homepageUrl: 'https://www.euronews.com/',
	},
	{
		id: 'nbc',
		name: 'NBC News',
		group: 'international',
		endpoint: '/api/news/nbc',
		homepageUrl: 'https://www.nbcnews.com/',
	},
] as const satisfies readonly NewsSourceDefinition[];

/** Identifier persisted for a selected RSS source. */
export type NewsSourceId = (typeof newsSources)[number]['id'];

/** A fully configured source from {@link newsSources}. */
export type NewsSource = (typeof newsSources)[number];

/** RSS source used when no valid saved preference exists. */
export const defaultNewsSourceId: NewsSourceId = 'ct24';

/** Checks unknown persisted data before treating it as a source ID. */
export const isNewsSourceId = (value: unknown): value is NewsSourceId =>
	newsSources.some(({ id }) => id === value);

/** Resolves a source ID to its complete configuration. */
export const getNewsSource = (newsSourceId: NewsSourceId): NewsSource =>
	newsSources.find(({ id }) => id === newsSourceId) ?? newsSources[0];
