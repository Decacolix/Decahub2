import { useCallback, useRef, useState } from 'react';
import type {
	TemperatureUnit,
	WeatherLocation,
	WeatherPreferences,
	WindSpeedUnit,
} from '../config/weather';
import {
	getWeatherPreferences,
	setWeatherPreferences,
} from '../lib/preferences';

export const useWeatherPreferences = () => {
	const [weatherPreferences, setCurrentWeatherPreferences] =
		useState<WeatherPreferences>(getWeatherPreferences);
	const weatherPreferencesRef = useRef(weatherPreferences);

	const updatePreferences = useCallback((nextPreferences: WeatherPreferences) => {
		weatherPreferencesRef.current = nextPreferences;
		setCurrentWeatherPreferences(nextPreferences);
		setWeatherPreferences(nextPreferences);
	}, []);

	const selectLocation = useCallback(
		(location: WeatherLocation) => {
			updatePreferences({ ...weatherPreferencesRef.current, location });
		},
		[updatePreferences],
	);

	const selectTemperatureUnit = useCallback(
		(temperatureUnit: TemperatureUnit) => {
			updatePreferences({
				...weatherPreferencesRef.current,
				temperatureUnit,
			});
		},
		[updatePreferences],
	);

	const selectWindSpeedUnit = useCallback(
		(windSpeedUnit: WindSpeedUnit) => {
			updatePreferences({
				...weatherPreferencesRef.current,
				windSpeedUnit,
			});
		},
		[updatePreferences],
	);

	return {
		...weatherPreferences,
		selectLocation,
		selectTemperatureUnit,
		selectWindSpeedUnit,
	};
};
