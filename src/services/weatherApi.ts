import type {
	TemperatureUnit,
	WeatherLocation,
	WindSpeedUnit,
} from '../config/weather';
import type { WeatherData } from '../types/weather';
import { isFiniteNumber, isRecord } from '../lib/typeGuards';

/** Minimal forecast payload consumed from Open-Meteo. */
type OpenMeteoResponse = {
	current: {
		temperature_2m: number;
		relative_humidity_2m: number;
		weather_code: number;
		wind_speed_10m: number;
	};
	daily: {
		time: string[];
		weather_code: number[];
		temperature_2m_max: number[];
		temperature_2m_min: number[];
	};
};

/** Open-Meteo forecast endpoint used directly by the browser. */
const weatherApiUrl: string = 'https://api.open-meteo.com/v1/forecast';

/** Today plus the three forecast days displayed by the dashboard. */
const requiredDailyEntries: number = 4;

/** Validates an unknown array of numeric API values. */
const isNumberArray = (value: unknown): value is number[] =>
	Array.isArray(value) && value.every(isFiniteNumber);

/** Validates an unknown array of string API values. */
const isStringArray = (value: unknown): value is string[] =>
	Array.isArray(value) && value.every((item) => typeof item === 'string');

/**
 * Reads an API array only after the response has passed its length validation.
 * The runtime guard also keeps indexed access safe if the response changes later.
 */
const getRequiredValue = <Value>(values: readonly Value[], index: number): Value => {
	const value: Value | undefined = values[index];

	if (value === undefined) {
		throw new Error('Open-Meteo returned incomplete daily weather data.');
	}

	return value;
};

/** Validates all forecast fields and the required number of daily entries. */
const isOpenMeteoResponse = (value: unknown): value is OpenMeteoResponse => {
	if (!isRecord(value) || !isRecord(value.current) || !isRecord(value.daily)) {
		return false;
	}

	const { current, daily } = value;
	const dailyTimes = daily.time;
	const dailyWeatherCodes = daily.weather_code;
	const dailyMaxTemperatures = daily.temperature_2m_max;
	const dailyMinTemperatures = daily.temperature_2m_min;

	if (
		!isStringArray(dailyTimes) ||
		!isNumberArray(dailyWeatherCodes) ||
		!isNumberArray(dailyMaxTemperatures) ||
		!isNumberArray(dailyMinTemperatures)
	) {
		return false;
	}

	return (
		isFiniteNumber(current.temperature_2m) &&
		isFiniteNumber(current.relative_humidity_2m) &&
		isFiniteNumber(current.weather_code) &&
		isFiniteNumber(current.wind_speed_10m) &&
		dailyTimes.length >= requiredDailyEntries &&
		dailyWeatherCodes.length >= requiredDailyEntries &&
		dailyMaxTemperatures.length >= requiredDailyEntries &&
		dailyMinTemperatures.length >= requiredDailyEntries
	);
};

/** Fetches current conditions and a three-day forecast for one location. */
export const fetchWeather = async (
	location: WeatherLocation,
	temperatureUnit: TemperatureUnit,
	windSpeedUnit: WindSpeedUnit,
	signal: AbortSignal,
): Promise<WeatherData> => {
	const searchParameters: URLSearchParams = new URLSearchParams({
		latitude: String(location.latitude),
		longitude: String(location.longitude),
		current:
			'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
		daily: 'weather_code,temperature_2m_max,temperature_2m_min',
		temperature_unit: temperatureUnit,
		wind_speed_unit: windSpeedUnit,
		timezone: location.timeZone,
		forecast_days: String(requiredDailyEntries),
	});
	const response: Response = await fetch(`${weatherApiUrl}?${searchParameters}`, {
		headers: { Accept: 'application/json' },
		signal,
	});

	if (!response.ok) {
		throw new Error(`Open-Meteo returned ${response.status}.`);
	}

	const data: unknown = await response.json();

	if (!isOpenMeteoResponse(data)) {
		throw new Error('Open-Meteo returned an unexpected response.');
	}

	return {
		temperatureUnit,
		windSpeedUnit,
		current: {
			temperature: data.current.temperature_2m,
			maxTemperature: getRequiredValue(data.daily.temperature_2m_max, 0),
			minTemperature: getRequiredValue(data.daily.temperature_2m_min, 0),
			humidity: data.current.relative_humidity_2m,
			windSpeed: data.current.wind_speed_10m,
			weatherCode: data.current.weather_code,
		},
		forecast: data.daily.time.slice(1, requiredDailyEntries).map((date, index) => ({
			date,
			maxTemperature: getRequiredValue(data.daily.temperature_2m_max, index + 1),
			minTemperature: getRequiredValue(data.daily.temperature_2m_min, index + 1),
			weatherCode: getRequiredValue(data.daily.weather_code, index + 1),
		})),
	};
};
