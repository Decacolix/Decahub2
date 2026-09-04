import type { TemperatureUnit, WindSpeedUnit } from '../config/weather';

export type CurrentWeather = {
	temperature: number;
	maxTemperature: number;
	minTemperature: number;
	humidity: number;
	windSpeed: number;
	weatherCode: number;
};

export type ForecastDay = {
	date: string;
	maxTemperature: number;
	minTemperature: number;
	weatherCode: number;
};

export type WeatherData = {
	current: CurrentWeather;
	forecast: ForecastDay[];
	temperatureUnit: TemperatureUnit;
	windSpeedUnit: WindSpeedUnit;
};
