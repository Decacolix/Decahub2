import type { WeatherLocation } from '../config/weather';

type OpenMeteoLocation = {
	name: string;
	latitude: number;
	longitude: number;
	timezone: string;
	country?: string;
	admin1?: string;
};

type OpenMeteoGeocodingResponse = {
	results?: OpenMeteoLocation[];
};

const geocodingApiUrl = 'https://geocoding-api.open-meteo.com/v1/search';

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null;

const isFiniteNumber = (value: unknown): value is number =>
	typeof value === 'number' && Number.isFinite(value);

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

const parseLocations = (value: unknown): WeatherLocation[] => {
	if (!isRecord(value)) {
		throw new Error('Open-Meteo returned an unexpected geocoding response.');
	}

	const { results } = value as OpenMeteoGeocodingResponse;

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
		country: location.country,
		adminArea: location.admin1,
	}));
};

export const searchWeatherLocations = async (
	query: string,
	signal: AbortSignal,
): Promise<WeatherLocation[]> => {
	const searchParameters = new URLSearchParams({
		name: query,
		count: '8',
		language: 'cs',
		format: 'json',
	});
	const response = await fetch(`${geocodingApiUrl}?${searchParameters}`, {
		headers: { Accept: 'application/json' },
		signal,
	});

	if (!response.ok) {
		throw new Error(`Open-Meteo geocoding returned ${response.status}.`);
	}

	return parseLocations(await response.json());
};
