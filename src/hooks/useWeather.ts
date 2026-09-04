import { useEffect, useState } from 'react';
import type {
	TemperatureUnit,
	WeatherLocation,
	WindSpeedUnit,
} from '../config/weather';
import { fetchWeather } from '../services/weatherApi';
import type { WeatherData } from '../types/weather';

type WeatherState = {
	data: WeatherData | null;
	status: 'loading' | 'ready' | 'error';
};

const refreshInterval = 15 * 60 * 1_000;

export const useWeather = (
	location: WeatherLocation,
	temperatureUnit: TemperatureUnit,
	windSpeedUnit: WindSpeedUnit,
): WeatherState => {
	const [weatherState, setWeatherState] = useState<WeatherState>({
		data: null,
		status: 'loading',
	});

	useEffect(() => {
		const controller = new AbortController();

		const loadWeather = async () => {
			try {
				const data = await fetchWeather(
					location,
					temperatureUnit,
					windSpeedUnit,
					controller.signal,
				);
				setWeatherState({ data, status: 'ready' });
			} catch (error) {
				if (error instanceof DOMException && error.name === 'AbortError') {
					return;
				}

				setWeatherState((currentState) =>
					currentState.data
						? currentState
						: { data: null, status: 'error' },
				);
			}
		};

		void loadWeather();
		const refreshTimer = window.setInterval(
			() => void loadWeather(),
			refreshInterval,
		);

		return () => {
			controller.abort();
			window.clearInterval(refreshTimer);
		};
	}, [location, temperatureUnit, windSpeedUnit]);

	return weatherState;
};
