import {
	defaultBackgroundId,
	isBackgroundId,
	type BackgroundId,
} from '../config/backgrounds';
import {
	defaultTimeZoneId,
	isTimeZoneId,
	type TimeZoneId,
} from '../config/timeZones';
import {
	defaultNewsSourceId,
	isNewsSourceId,
	type NewsSourceId,
} from '../config/newsSources';
import {
	defaultLanguage,
	isLanguage,
	type Language,
} from '../config/languages';
import {
	defaultTimeFormat,
	isTimeFormat,
	type TimeFormat,
} from '../config/clock';
import {
	defaultWeatherPreferences,
	isTemperatureUnit,
	isWindSpeedUnit,
	type WeatherLocation,
	type WeatherPreferences,
} from '../config/weather';
import { isRecord } from './typeGuards';

/** Single local-storage entry containing every dashboard preference. */
const storageKey: string = 'decahub.preferences';

/** Keys supported by the single persisted preference object. */
type PreferenceKey =
	| 'background'
	| 'language'
	| 'newsSource'
	| 'timeFormat'
	| 'timeZone'
	| 'weather';

/** Validates a location restored from untrusted browser storage. */
const isWeatherLocation = (value: unknown): value is WeatherLocation =>
	isRecord(value) &&
	typeof value.name === 'string' &&
	value.name.length > 0 &&
	typeof value.latitude === 'number' &&
	Number.isFinite(value.latitude) &&
	value.latitude >= -90 &&
	value.latitude <= 90 &&
	typeof value.longitude === 'number' &&
	Number.isFinite(value.longitude) &&
	value.longitude >= -180 &&
	value.longitude <= 180 &&
	typeof value.timeZone === 'string' &&
	value.timeZone.length > 0 &&
	(value.country === undefined || typeof value.country === 'string') &&
	(value.adminArea === undefined || typeof value.adminArea === 'string');

/** Parses local storage as untrusted data and safely falls back to an empty object. */
const readStoredPreferences = (): Record<string, unknown> => {
	try {
		const storedValue = window.localStorage.getItem(storageKey);

		if (!storedValue) {
			return {};
		}

		const parsedValue: unknown = JSON.parse(storedValue);

		if (isRecord(parsedValue)) {
			return parsedValue;
		}
	} catch {
		// Fall back to defaults if storage is unavailable or contains invalid JSON.
	}

	return {};
};

/** Safely merges one preference into the existing local-storage object. */
const writeStoredPreference = (key: PreferenceKey, value: unknown): void => {
	try {
		const currentPreferences: Record<string, unknown> =
			readStoredPreferences();

		window.localStorage.setItem(
			storageKey,
			JSON.stringify({ ...currentPreferences, [key]: value }),
		);
	} catch {
		// React state still preserves the choice for this session if storage is blocked.
	}
};

/** Reads and validates the saved background. */
export const getBackgroundPreference = (): BackgroundId => {
	const { background } = readStoredPreferences();

	return isBackgroundId(background) ? background : defaultBackgroundId;
};

/** Persists the selected background. */
export const setBackgroundPreference = (background: BackgroundId): void => {
	writeStoredPreference('background', background);
};

/** Reads and validates the saved interface language. */
export const getLanguagePreference = (): Language => {
	const { language } = readStoredPreferences();

	return isLanguage(language) ? language : defaultLanguage;
};

/** Persists the selected interface language. */
export const setLanguagePreference = (language: Language): void => {
	writeStoredPreference('language', language);
};

/** Reads and validates the saved timezone. */
export const getTimeZonePreference = (): TimeZoneId => {
	const { timeZone } = readStoredPreferences();

	return isTimeZoneId(timeZone) ? timeZone : defaultTimeZoneId;
};

/** Persists the selected timezone. */
export const setTimeZonePreference = (timeZone: TimeZoneId): void => {
	writeStoredPreference('timeZone', timeZone);
};

/** Reads and validates the saved 12/24-hour clock format. */
export const getTimeFormatPreference = (): TimeFormat => {
	const { timeFormat } = readStoredPreferences();

	return isTimeFormat(timeFormat) ? timeFormat : defaultTimeFormat;
};

/** Persists the selected clock format. */
export const setTimeFormatPreference = (timeFormat: TimeFormat): void => {
	writeStoredPreference('timeFormat', timeFormat);
};

/** Reads and validates the saved RSS source. */
export const getNewsSourcePreference = (): NewsSourceId => {
	const { newsSource } = readStoredPreferences();

	return isNewsSourceId(newsSource) ? newsSource : defaultNewsSourceId;
};

/** Persists the selected RSS source. */
export const setNewsSourcePreference = (newsSource: NewsSourceId): void => {
	writeStoredPreference('newsSource', newsSource);
};

/** Reads weather preferences and falls back per field when stored data is invalid. */
export const getWeatherPreferences = (): WeatherPreferences => {
	const { weather } = readStoredPreferences();

	if (!isRecord(weather)) {
		return defaultWeatherPreferences;
	}

	return {
		location: isWeatherLocation(weather.location)
			? weather.location
			: defaultWeatherPreferences.location,
		temperatureUnit: isTemperatureUnit(weather.temperatureUnit)
			? weather.temperatureUnit
			: defaultWeatherPreferences.temperatureUnit,
		windSpeedUnit: isWindSpeedUnit(weather.windSpeedUnit)
			? weather.windSpeedUnit
			: defaultWeatherPreferences.windSpeedUnit,
	};
};

/** Persists location, temperature, and wind-speed preferences together. */
export const setWeatherPreferences = (weather: WeatherPreferences): void => {
	writeStoredPreference('weather', weather);
};
