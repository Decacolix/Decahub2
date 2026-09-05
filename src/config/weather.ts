/** Geographic point used by the weather and geocoding services. */
export type WeatherLocation = {
	name: string;
	latitude: number;
	longitude: number;
	timeZone: string;
	country?: string;
	adminArea?: string;
};

/** Temperature units supported by Open-Meteo. */
export type TemperatureUnit = 'celsius' | 'fahrenheit';

/** Wind-speed units supported by Open-Meteo. */
export type WindSpeedUnit = 'kmh' | 'ms' | 'kn' | 'mph';

/** Complete set of persisted weather preferences. */
export type WeatherPreferences = {
	location: WeatherLocation;
	temperatureUnit: TemperatureUnit;
	windSpeedUnit: WindSpeedUnit;
};

/** Initial Prague location used before the user chooses another place. */
export const defaultWeatherLocation: WeatherLocation = {
	name: 'Praha',
	latitude: 50.0755,
	longitude: 14.4378,
	timeZone: 'Europe/Prague',
	country: 'Česko',
};

/** Initial temperature unit. */
export const defaultTemperatureUnit: TemperatureUnit = 'celsius';

/** Initial wind-speed unit. */
export const defaultWindSpeedUnit: WindSpeedUnit = 'kmh';

/** Compact labels shown next to wind-speed values. */
export const windSpeedUnitLabels: Readonly<Record<WindSpeedUnit, string>> = {
	kmh: 'km/h',
	ms: 'm/s',
	kn: 'kn',
	mph: 'mph',
};

/** Complete fallback used when stored weather preferences are unavailable. */
export const defaultWeatherPreferences: WeatherPreferences = {
	location: defaultWeatherLocation,
	temperatureUnit: defaultTemperatureUnit,
	windSpeedUnit: defaultWindSpeedUnit,
};

/** Checks unknown persisted data before treating it as a temperature unit. */
export const isTemperatureUnit = (value: unknown): value is TemperatureUnit =>
	value === 'celsius' || value === 'fahrenheit';

/** Checks unknown persisted data before treating it as a wind-speed unit. */
export const isWindSpeedUnit = (value: unknown): value is WindSpeedUnit =>
	value === 'kmh' || value === 'ms' || value === 'kn' || value === 'mph';
