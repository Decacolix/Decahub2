import type { Language } from './languages';

/** Recursive translation-object shape with all leaf values widened to strings. */
type TranslationShape<Value> = {
	readonly [Key in keyof Value]: Value[Key] extends string
		? string
		: TranslationShape<Value[Key]>;
};

const czechTranslations = {
	language: 'Jazyk',
	background: {
		label: 'Barva pozadí',
		use: 'Použít',
		suffix: 'pozadí',
		names: { green: 'zelené', blue: 'modré', pink: 'růžové' },
	},
	clock: {
		label: 'Aktuální datum a čas',
		settings: 'Otevřít nastavení hodin',
	},
	clockSettings: {
		title: 'Nastavení hodin',
		close: 'Zavřít nastavení hodin',
		timeFormat: 'Formát času',
		timeFormatDescription: '12hodinový nebo 24hodinový',
		twentyFourHour: 'Používat 24hodinový formát',
		timeZone: 'Časové pásmo',
	},
	weather: {
		label: 'Počasí pro',
		settings: 'Nastavit místo a jednotky počasí',
		loading: 'Načítání počasí…',
		error: 'Počasí se nepodařilo načíst.',
		humidity: 'Vlhkost',
		wind: 'Vítr',
		todayMaximum: 'Dnešní maximum',
		todayMinimum: 'Dnešní minimum',
		maximum: 'Maximum',
		minimum: 'Minimum',
	},
	weatherSettings: {
		title: 'Nastavení počasí',
		close: 'Zavřít nastavení počasí',
		searchLocation: 'Vyhledat místo',
		placeholder: 'Praha, New York, Sydney…',
		clearSearch: 'Vymazat hledání',
		search: 'Vyhledat místo',
		results: 'Nalezená místa',
		searching: 'Vyhledávání…',
		found: 'Místo bylo nalezeno.',
		notFound: 'Místo nebylo nalezeno.',
		searchError: 'Vyhledávání se nepodařilo. Zkuste to prosím znovu.',
		selectedLocation: 'Aktuálně vybrané místo',
		latitude: 'Zeměpisná šířka',
		longitude: 'Zeměpisná délka',
		temperatureUnit: 'Jednotka teploty',
		temperatureUnitDescription: 'Celsius nebo Fahrenheit',
		fahrenheit: 'Používat stupně Fahrenheita',
		windSpeedUnit: 'Jednotka rychlosti větru',
		windUnits: {
			kmh: 'Kilometry za hodinu',
			ms: 'Metry za sekundu',
			kn: 'Uzly',
			mph: 'Míle za hodinu',
		},
	},
	news: {
		label: 'Zprávy',
		settings: 'Nastavit zdroj zpráv',
		loading: 'Načítání zpráv…',
		error: 'Zprávy se nepodařilo načíst.',
		latest: 'Nejnovější zprávy',
	},
	newsSettings: {
		title: 'Zdroj zpráv',
		close: 'Zavřít nastavení zdroje zpráv',
	},
	footer: {
		createdBy: 'Vytvořil David Toman v roce 2026',
		email: 'E-mail',
	},
} as const;

/** Complete localized UI copy. The type requires both languages to stay in sync. */
export const translations: Readonly<
	Record<Language, TranslationShape<typeof czechTranslations>>
> = {
	cs: czechTranslations,
	en: {
		language: 'Language',
		background: {
			label: 'Background colour',
			use: 'Use',
			suffix: 'background',
			names: { green: 'green', blue: 'blue', pink: 'pink' },
		},
		clock: {
			label: 'Current date and time',
			settings: 'Open clock settings',
		},
		clockSettings: {
			title: 'Clock settings',
			close: 'Close clock settings',
			timeFormat: 'Time format',
			timeFormatDescription: '12-hour or 24-hour',
			twentyFourHour: 'Use 24-hour format',
			timeZone: 'Time zone',
		},
		weather: {
			label: 'Weather for',
			settings: 'Set location and weather units',
			loading: 'Loading weather…',
			error: 'Weather could not be loaded.',
			humidity: 'Humidity',
			wind: 'Wind',
			todayMaximum: "Today's maximum",
			todayMinimum: "Today's minimum",
			maximum: 'Maximum',
			minimum: 'Minimum',
		},
		weatherSettings: {
			title: 'Weather settings',
			close: 'Close weather settings',
			searchLocation: 'Search for a location',
			placeholder: 'Prague, New York, Sydney…',
			clearSearch: 'Clear search',
			search: 'Search for a location',
			results: 'Locations found',
			searching: 'Searching…',
			found: 'The location was found.',
			notFound: 'The location was not found.',
			searchError: 'The search failed. Please try again.',
			selectedLocation: 'Currently selected location',
			latitude: 'Latitude',
			longitude: 'Longitude',
			temperatureUnit: 'Temperature unit',
			temperatureUnitDescription: 'Celsius or Fahrenheit',
			fahrenheit: 'Use degrees Fahrenheit',
			windSpeedUnit: 'Wind speed unit',
			windUnits: {
				kmh: 'Kilometres per hour',
				ms: 'Metres per second',
				kn: 'Knots',
				mph: 'Miles per hour',
			},
		},
		news: {
			label: 'News',
			settings: 'Set news source',
			loading: 'Loading news…',
			error: 'News could not be loaded.',
			latest: 'Latest news',
		},
		newsSettings: {
			title: 'News source',
			close: 'Close news source settings',
		},
		footer: {
			createdBy: 'Created by David Toman in 2026',
			email: 'E-mail',
		},
	},
};
