import humidityIcon from '../../assets/icons/weather/humidity.svg';
import windIcon from '../../assets/icons/weather/wind.svg';
import { windSpeedUnitLabels, type TemperatureUnit, type WindSpeedUnit } from '../../config/weather';
import { getWeatherVisual } from '../../config/weatherIcons';
import type { CurrentWeather } from '../../types/weather';

type CurrentWeatherTileProps = {
	locationName: string;
	temperatureUnit: TemperatureUnit;
	weather: CurrentWeather;
	windSpeedUnit: WindSpeedUnit;
};

const numberFormatter = new Intl.NumberFormat('cs-CZ', {
	maximumFractionDigits: 1,
});

const formatTemperature = (temperature: number) => `${Math.round(temperature)}°`;

const formatTemperatureWithUnit = (temperature: number, temperatureUnit: TemperatureUnit) => `${Math.round(temperature)}°${temperatureUnit === 'celsius' ? 'C' : 'F'}`;

const CurrentWeatherTile = ({ locationName, temperatureUnit, weather, windSpeedUnit }: CurrentWeatherTileProps) => {
	const weatherVisual = getWeatherVisual(weather.weatherCode);

	return (
		<article className="text-white mb-8">
			<header className="pr-10">
				<h2 className="text-3xl font-semibold [text-shadow:0_2px_8px_rgba(0,0,0,0.45)]">{locationName}</h2>
			</header>

			<div className="mt-2 flex flex-row lg:flex-col xl:flex-row items-start justify-between gap-3 lg:gap-4">
				<div>
					<p className="text-5xl leading-none font-light tabular-nums [text-shadow:0_2px_8px_rgba(0,0,0,0.45)] lg:text-8xl">{formatTemperatureWithUnit(weather.temperature, temperatureUnit)}</p>
					<div className="mt-3 flex gap-4 text-base tabular-nums">
						<span className="text-xl" aria-label={`Dnešní maximum ${formatTemperature(weather.maxTemperature)}`}>
							<span className="mr-1 text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.45)]">Max:</span>
							<span className="[text-shadow:0_2px_8px_rgba(0,0,0,0.45)] font-semibold">{formatTemperature(weather.maxTemperature)}</span>
						</span>
						<span className="text-xl" aria-label={`Dnešní minimum ${formatTemperature(weather.minTemperature)}`}>
							<span className="mr-1 text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.45)]">Min:</span>
							<span className="[text-shadow:0_2px_8px_rgba(0,0,0,0.45)] font-semibold">{formatTemperature(weather.minTemperature)}</span>
						</span>
					</div>
				</div>

				<img src={weatherVisual.icon} alt={weatherVisual.description} className="size-20 shrink-0 drop-shadow-lg lg:size-24" />
			</div>

			<div className="mt-5 flex flex-row lg:flex-col xl:flex-row justify-between">
				<div className="flex items-center gap-3">
					<img src={humidityIcon} alt="" className="size-7 shrink-0 drop-shadow-lg" />
					<p>
						<span className="block text-md text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.45)]">Vlhkost</span>
						<strong className="text-xl font-semibold tabular-nums [text-shadow:0_2px_8px_rgba(0,0,0,0.45)]">{Math.round(weather.humidity)} %</strong>
					</p>
				</div>

				<div className="flex items-center gap-3">
					<img src={windIcon} alt="" className="size-7 shrink-0 drop-shadow-lg" />
					<p>
						<span className="block text-md text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.45)]">Vítr</span>
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
