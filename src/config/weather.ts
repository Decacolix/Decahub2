export type WeatherLocation = {
	name: string;
	latitude: number;
	longitude: number;
	timeZone: string;
	country?: string;
	adminArea?: string;
};

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'kmh' | 'ms' | 'kn' | 'mph';

export type WeatherPreferences = {
	location: WeatherLocation;
	temperatureUnit: TemperatureUnit;
	windSpeedUnit: WindSpeedUnit;
};

export const defaultWeatherLocation: WeatherLocation = {
	name: 'Praha',
	latitude: 50.0755,
	longitude: 14.4378,
	timeZone: 'Europe/Prague',
	country: 'Česko',
};

export const defaultTemperatureUnit: TemperatureUnit = 'celsius';
export const defaultWindSpeedUnit: WindSpeedUnit = 'kmh';

export const windSpeedUnitLabels: Record<WindSpeedUnit, string> = {
	kmh: 'km/h',
	ms: 'm/s',
	kn: 'kn',
	mph: 'mph',
};

export const defaultWeatherPreferences: WeatherPreferences = {
	location: defaultWeatherLocation,
	temperatureUnit: defaultTemperatureUnit,
	windSpeedUnit: defaultWindSpeedUnit,
};

export const isTemperatureUnit = (value: unknown): value is TemperatureUnit =>
	value === 'celsius' || value === 'fahrenheit';

export const isWindSpeedUnit = (value: unknown): value is WindSpeedUnit =>
	value === 'kmh' || value === 'ms' || value === 'kn' || value === 'mph';
