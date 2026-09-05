import { nameDayMessages } from '../config/nameDays';
import type { Language } from '../config/languages';

/** English equivalents for entries that cannot be translated by a simple prefix. */
const specialEnglishMessages: Readonly<Record<string, string>> = {
	'Je Nový rok, Den obnovy samostatného českého státu':
		"It is New Year's Day and Restoration Day of the Independent Czech State",
	'Je den Tří králů': 'The day of the Three Kings',
	'Je Svátek práce': 'It is Labour Day',
	'Je Den vítězství': 'The day of Victory',
	'Je Den upálení mistra Jana Husa': 'The day of the Burning of Jan Hus',
	'Je Den vzniku samostatného československého státu':
		'The day of the Establishment of the Independent Czechoslovak State',
	'Je Památka zesnulých': "It is All Souls' Day",
	'Je 1. svátek vánoční': 'It is Christmas Day',
	'Svátek má Václav, je Den české státnosti':
		'The name day of Václav, the day of Czech Statehood',
	'Svátek má Mahulena, je Den boje za svobodu a demokracii':
		'The name day of Mahulena, the day of the Struggle for Freedom and Democracy',
	'Svátek má Adam a Eva, je Štědrý den':
		'The name day of Adam and Eva, and it is Christmas Eve',
	'Svátek má Štěpán, je 2. svátek vánoční':
		'The name day of Štěpán, and it is the second day of Christmas',
};

/** Translates a Czech name-day entry while preserving personal names. */
const translateNameDayMessage = (message: string): string => {
	const specialMessage: string | undefined = specialEnglishMessages[message];

	if (specialMessage) {
		return specialMessage;
	}

	if (message.startsWith('Svátek má ')) {
		return `The name day of ${message.slice('Svátek má '.length).replaceAll(' a ', ' and ')}`;
	}

	if (message.startsWith('Je Den ')) {
		return `The day of ${message.slice('Je Den '.length)}`;
	}

	return message;
};

/** Returns the localized name-day message for a one-based month and day. */
export const getNameDayMessage = (
	month: number,
	day: number,
	language: Language,
) => {
	const message: string = nameDayMessages[month - 1]?.[day - 1] ?? '';

	return language === 'en' ? translateNameDayMessage(message) : message;
};
