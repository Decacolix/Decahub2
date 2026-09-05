import type { TemperatureUnit, WindSpeedUnit } from '../config/weather';

/** Current conditions returned by Open-Meteo. */
export type CurrentWeather = {
	temperature: number;
	maxTemperature: number;
	minTemperature: number;
	humidity: number;
	windSpeed: number;
	weatherCode: number;
};

/** One normalized daily forecast. */
export type ForecastDay = {
	date: string;
	maxTemperature: number;
	minTemperature: number;
	weatherCode: number;
};

/** Weather payload consumed by the weather panel. */
export type WeatherData = {
	current: CurrentWeather;
	forecast: ForecastDay[];
	temperatureUnit: TemperatureUnit;
	windSpeedUnit: WindSpeedUnit;
};
