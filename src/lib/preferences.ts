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
	defaultWeatherPreferences,
	isTemperatureUnit,
	isWindSpeedUnit,
	type WeatherLocation,
	type WeatherPreferences,
} from '../config/weather';

const storageKey = 'decahub.preferences';

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null;

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

export const getBackgroundPreference = (): BackgroundId => {
	const { background } = readStoredPreferences();

	return isBackgroundId(background) ? background : defaultBackgroundId;
};

export const setBackgroundPreference = (background: BackgroundId): void => {
	try {
		const currentPreferences = readStoredPreferences();

		window.localStorage.setItem(
			storageKey,
			JSON.stringify({ ...currentPreferences, background }),
		);
	} catch {
		// The selected background still works for this session if storage is blocked.
	}
};

export const getTimeZonePreference = (): TimeZoneId => {
	const { timeZone } = readStoredPreferences();

	return isTimeZoneId(timeZone) ? timeZone : defaultTimeZoneId;
};

export const setTimeZonePreference = (timeZone: TimeZoneId): void => {
	try {
		const currentPreferences = readStoredPreferences();

		window.localStorage.setItem(
			storageKey,
			JSON.stringify({ ...currentPreferences, timeZone }),
		);
	} catch {
		// The selected timezone still works for this session if storage is blocked.
	}
};

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

export const setWeatherPreferences = (
	weather: WeatherPreferences,
): void => {
	try {
		const currentPreferences = readStoredPreferences();

		window.localStorage.setItem(
			storageKey,
			JSON.stringify({ ...currentPreferences, weather }),
		);
	} catch {
		// The selected weather preferences still work if storage is blocked.
	}
};
