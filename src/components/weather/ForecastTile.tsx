import { getWeatherVisual } from '../../config/weatherIcons';
import type { ForecastDay } from '../../types/weather';

type ForecastTileProps = {
	forecast: ForecastDay;
};

const weekdayFormatter = new Intl.DateTimeFormat('cs-CZ', {
	weekday: 'long',
	timeZone: 'UTC',
});

const formatTemperature = (temperature: number) => `${Math.round(temperature)}°`;

const ForecastTile = ({ forecast }: ForecastTileProps) => {
	const weatherVisual = getWeatherVisual(forecast.weatherCode);
	const weekday = weekdayFormatter.format(new Date(`${forecast.date}T12:00:00Z`));

	return (
		<article className="flex min-h-18 items-center justify-between gap-2 py-3 text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.45)] lg:gap-3 border-t border-white">
			<div>
				<h3 className="min-w-0 flex-1 text-base font-medium capitalize lg:text-xl mb-3">{weekday}</h3>
				<img src={weatherVisual.icon} alt={weatherVisual.description} className="size-10 shrink-0 drop-shadow-md lg:size-12" />
			</div>
			<div className="flex min-w-22 justify-end items-end gap-1.5 text-base font-medium tabular-nums lg:min-w-25 lg:gap-2 lg:text-lg">
				<div className="text-4xl" aria-label={`Maximum ${formatTemperature(forecast.maxTemperature)}`}>
					{formatTemperature(forecast.maxTemperature)}
				</div>
				<div className="text-white/65 text-3xl" aria-label={`Minimum ${formatTemperature(forecast.minTemperature)}`}>
					{formatTemperature(forecast.minTemperature)}
				</div>
			</div>
		</article>
	);
};

export default ForecastTile;
