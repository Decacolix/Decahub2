import humidityIcon from '../../assets/icons/weather/humidity.svg';
import windIcon from '../../assets/icons/weather/wind.svg';
import { languageLocales, type Language } from '../../config/languages';
import { translations } from '../../config/translations';
import { windSpeedUnitLabels, type TemperatureUnit, type WindSpeedUnit } from '../../config/weather';
import { getWeatherVisual } from '../../config/weatherIcons';
import {
	formatTemperature,
	formatTemperatureWithUnit,
} from '../../lib/weatherFormatting';
import type { CurrentWeather } from '../../types/weather';

/** Inputs required by the current-weather tile. */
type CurrentWeatherTileProps = {
	language: Language;
	locationName: string;
	temperatureUnit: TemperatureUnit;
	weather: CurrentWeather;
	windSpeedUnit: WindSpeedUnit;
};

/** Displays detailed conditions for the selected location. */
const CurrentWeatherTile = ({
	language,
	locationName,
	temperatureUnit,
	weather,
	windSpeedUnit,
}: CurrentWeatherTileProps): ReactElement => {
	const weatherVisual = getWeatherVisual(weather.weatherCode, language);
	const text = translations[language].weather;
	const numberFormatter = useMemo<Intl.NumberFormat>(
		() =>
			new Intl.NumberFormat(languageLocales[language], {
				maximumFractionDigits: 1,
			}),
		[language],
	);

	return (
		<article className="mb-8 text-white">
			<header className="pr-10">
				<h2 className="text-2xl lg:text-3xl font-semibold [text-shadow:0_2px_8px_rgba(0,0,0,0.45)]">{locationName}</h2>
			</header>

			<div className="mt-2 flex flex-row lg:flex-col 2xl:flex-row items-start justify-between gap-3 lg:gap-4">
				<div>
					<p className="text-4xl leading-none font-light tabular-nums [text-shadow:0_2px_8px_rgba(0,0,0,0.45)] xl:text-7xl">{formatTemperatureWithUnit(weather.temperature, temperatureUnit)}</p>
					<div className="mt-3 flex flex-row lg:flex-col 2xl:flex-row gap-4 text-base tabular-nums">
						<span className="text-xl" aria-label={`${text.todayMaximum} ${formatTemperature(weather.maxTemperature)}`}>
							<span className="mr-1 text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.45)]">Max:</span>
							<span className="[text-shadow:0_2px_8px_rgba(0,0,0,0.45)] font-semibold">{formatTemperature(weather.maxTemperature)}</span>
						</span>
						<span className="text-xl" aria-label={`${text.todayMinimum} ${formatTemperature(weather.minTemperature)}`}>
							<span className="mr-1 text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.45)]">Min:</span>
							<span className="[text-shadow:0_2px_8px_rgba(0,0,0,0.45)] font-semibold">{formatTemperature(weather.minTemperature)}</span>
						</span>
					</div>
				</div>

				<img src={weatherVisual.icon} alt={weatherVisual.description} className="size-20 shrink-0 drop-shadow-lg lg:size-24" />
			</div>

			<div className="mt-5 flex flex-row lg:flex-col xl:flex-row justify-between">
				<div className="flex items-center gap-3">
					<img src={humidityIcon} alt={text.humidity} className="size-7 shrink-0 drop-shadow-lg" />
					<p>
						<span className="block text-base text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.45)]">{text.humidity}</span>
						<strong className="text-xl font-semibold tabular-nums [text-shadow:0_2px_8px_rgba(0,0,0,0.45)]">{Math.round(weather.humidity)} %</strong>
					</p>
				</div>

				<div className="flex items-center gap-3">
					<img src={windIcon} alt={text.wind} className="size-7 shrink-0 drop-shadow-lg" />
					<p>
						<span className="block text-base text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.45)]">{text.wind}</span>
						<strong className="text-xl font-semibold tabular-nums [text-shadow:0_2px_8px_rgba(0,0,0,0.45)]">
							{numberFormatter.format(weather.windSpeed)} {windSpeedUnitLabels[windSpeedUnit]}
						</strong>
					</p>
				</div>
			</div>
		</article>
	);
};

export default CurrentWeatherTile;
import { useMemo, type ReactElement } from 'react';
