import { useEffect, useState } from 'react';
import type {
	TemperatureUnit,
	WeatherLocation,
	WindSpeedUnit,
} from '../config/weather';
import { fetchWeather } from '../services/weatherApi';
import type { WeatherData } from '../types/weather';

/** Loading state returned by the weather hook. */
type WeatherState = {
	data: WeatherData | null;
	status: 'loading' | 'ready' | 'error';
};

/** Refresh weather conditions every fifteen minutes. */
const refreshInterval: number = 15 * 60 * 1_000;

/** Loads weather immediately and refreshes it in the background. */
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
		const controller: AbortController = new AbortController();

		const loadWeather = async (): Promise<void> => {
			try {
				const data: WeatherData = await fetchWeather(
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
		const refreshTimer: number = window.setInterval(
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
