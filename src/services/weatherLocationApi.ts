import type { Language } from '../config/languages';
import type { WeatherLocation } from '../config/weather';
import { isFiniteNumber, isRecord } from '../lib/typeGuards';

/** Minimal geocoding result consumed from Open-Meteo. */
type OpenMeteoLocation = {
	name: string;
	latitude: number;
	longitude: number;
	timezone: string;
	country?: string;
	admin1?: string;
};

/** Open-Meteo location-search endpoint. */
const geocodingApiUrl: string =
	'https://geocoding-api.open-meteo.com/v1/search';

/** Validates one location from an unknown geocoding response. */
const isOpenMeteoLocation = (value: unknown): value is OpenMeteoLocation =>
	isRecord(value) &&
	typeof value.name === 'string' &&
	value.name.length > 0 &&
	isFiniteNumber(value.latitude) &&
	isFiniteNumber(value.longitude) &&
	typeof value.timezone === 'string' &&
	value.timezone.length > 0 &&
	(value.country === undefined || typeof value.country === 'string') &&
	(value.admin1 === undefined || typeof value.admin1 === 'string');

/** Validates and normalizes an unknown geocoding response. */
const parseLocations = (value: unknown): WeatherLocation[] => {
	if (!isRecord(value)) {
		throw new Error('Open-Meteo returned an unexpected geocoding response.');
	}

	const { results } = value;

	if (results === undefined) {
		return [];
	}

	if (!Array.isArray(results)) {
		throw new Error('Open-Meteo returned an unexpected geocoding response.');
	}

	return results.filter(isOpenMeteoLocation).map((location) => ({
		name: location.name,
		latitude: location.latitude,
		longitude: location.longitude,
		timeZone: location.timezone,
		...(location.country === undefined ? {} : { country: location.country }),
		...(location.admin1 === undefined ? {} : { adminArea: location.admin1 }),
	}));
};

/** Searches for up to eight weather locations in the selected UI language. */
export const searchWeatherLocations = async (
	query: string,
	language: Language,
	signal: AbortSignal,
): Promise<WeatherLocation[]> => {
	const searchParameters: URLSearchParams = new URLSearchParams({
		name: query,
		count: '8',
		language,
		format: 'json',
	});
	const response: Response = await fetch(`${geocodingApiUrl}?${searchParameters}`, {
		headers: { Accept: 'application/json' },
		signal,
	});

	if (!response.ok) {
		throw new Error(`Open-Meteo geocoding returned ${response.status}.`);
	}

	return parseLocations(await response.json());
};
