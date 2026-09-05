import { languageLocales, type Language } from '../../config/languages';
import { translations } from '../../config/translations';
import { getWeatherVisual } from '../../config/weatherIcons';
import { formatTemperature } from '../../lib/weatherFormatting';
import type { ForecastDay } from '../../types/weather';

/** Inputs required by a forecast tile. */
type ForecastTileProps = {
	forecast: ForecastDay;
	language: Language;
};

/** Displays one day from the three-day forecast. */
const ForecastTile = ({ forecast, language }: ForecastTileProps): ReactElement => {
	const weatherVisual = getWeatherVisual(forecast.weatherCode, language);
	const text = translations[language].weather;
	const weekdayFormatter = useMemo<Intl.DateTimeFormat>(
		() =>
			new Intl.DateTimeFormat(languageLocales[language], {
				weekday: 'long',
				timeZone: 'UTC',
			}),
		[language],
	);
	const forecastDate: Date = new Date(`${forecast.date}T12:00:00Z`);
	const weekday: string = weekdayFormatter.format(forecastDate);

	return (
		<article className="flex min-h-18 items-center justify-between gap-2 py-3 text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.45)] lg:gap-3 border-t border-white/50">
			<div>
				<h3 className="min-w-0 flex-1 text-base font-medium capitalize lg:text-xl mb-3">{weekday}</h3>
				<img src={weatherVisual.icon} alt={weatherVisual.description} className="size-10 shrink-0 drop-shadow-md lg:size-12" />
			</div>
			<div className="flex min-w-22 justify-end items-end gap-1.5 text-base font-medium tabular-nums lg:min-w-25 lg:gap-2 lg:text-lg">
				<div className="text-3xl 2xl:text-4xl" aria-label={`${text.maximum} ${formatTemperature(forecast.maxTemperature)}`}>
					{formatTemperature(forecast.maxTemperature)}
				</div>
				<div className="text-white/65 text-xl 2xl:text-2xl" aria-label={`${text.minimum} ${formatTemperature(forecast.minTemperature)}`}>
					{formatTemperature(forecast.minTemperature)}
				</div>
			</div>
		</article>
	);
};

export default ForecastTile;
import { useMemo, type ReactElement } from 'react';
