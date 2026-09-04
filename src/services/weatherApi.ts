import type {
	TemperatureUnit,
	WeatherLocation,
	WindSpeedUnit,
} from '../config/weather';
import type { WeatherData } from '../types/weather';

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

const weatherApiUrl = 'https://api.open-meteo.com/v1/forecast';
const requiredDailyEntries = 4;

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null;

const isFiniteNumber = (value: unknown): value is number =>
	typeof value === 'number' && Number.isFinite(value);

const isNumberArray = (value: unknown): value is number[] =>
	Array.isArray(value) && value.every(isFiniteNumber);

const isStringArray = (value: unknown): value is string[] =>
	Array.isArray(value) && value.every((item) => typeof item === 'string');

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

export const fetchWeather = async (
	location: WeatherLocation,
	temperatureUnit: TemperatureUnit,
	windSpeedUnit: WindSpeedUnit,
	signal: AbortSignal,
): Promise<WeatherData> => {
	const searchParameters = new URLSearchParams({
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
	const response = await fetch(`${weatherApiUrl}?${searchParameters}`, {
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
			maxTemperature: data.daily.temperature_2m_max[0],
			minTemperature: data.daily.temperature_2m_min[0],
			humidity: data.current.relative_humidity_2m,
			windSpeed: data.current.wind_speed_10m,
			weatherCode: data.current.weather_code,
		},
		forecast: data.daily.time.slice(1, 4).map((date, index) => ({
			date,
			maxTemperature: data.daily.temperature_2m_max[index + 1],
			minTemperature: data.daily.temperature_2m_min[index + 1],
			weatherCode: data.daily.weather_code[index + 1],
		})),
	};
};
