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

/** State and actions exposed by the weather-preferences hook. */
type WeatherPreferenceController = WeatherPreferences & {
	selectLocation: (location: WeatherLocation) => void;
	selectTemperatureUnit: (temperatureUnit: TemperatureUnit) => void;
	selectWindSpeedUnit: (windSpeedUnit: WindSpeedUnit) => void;
};

/** Restores, updates, and persists the related weather preferences atomically. */
export const useWeatherPreferences = (): WeatherPreferenceController => {
	const [weatherPreferences, setCurrentWeatherPreferences] =
		useState<WeatherPreferences>(getWeatherPreferences);
	const weatherPreferencesRef = useRef<WeatherPreferences>(weatherPreferences);

	const updatePreferences = useCallback(
		(nextPreferences: WeatherPreferences): void => {
			weatherPreferencesRef.current = nextPreferences;
			setCurrentWeatherPreferences(nextPreferences);
			setWeatherPreferences(nextPreferences);
		},
		[],
	);

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
