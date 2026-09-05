import type { TemperatureUnit } from '../config/weather';

/** Formats a rounded temperature without repeating its unit in min/max labels. */
export const formatTemperature = (temperature: number): string =>
	`${Math.round(temperature)} °`;

/** Formats a rounded temperature with the selected unit. */
export const formatTemperatureWithUnit = (
	temperature: number,
	temperatureUnit: TemperatureUnit,
): string =>
	`${Math.round(temperature)} °${temperatureUnit === 'celsius' ? 'C' : 'F'}`;
