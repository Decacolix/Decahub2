import settingsIcon from '../../assets/icons/settings/settings-icon.svg';
import type {
	TemperatureUnit,
	WeatherLocation,
	WindSpeedUnit,
} from '../../config/weather';
import { useWeather } from '../../hooks/useWeather';
import CurrentWeatherTile from './CurrentWeatherTile';
import ForecastTile from './ForecastTile';

type WeatherPanelProps = {
	isSettingsOpen: boolean;
	location: WeatherLocation;
	temperatureUnit: TemperatureUnit;
	windSpeedUnit: WindSpeedUnit;
	onToggleSettings: () => void;
};

const WeatherPanel = ({
	isSettingsOpen,
	location,
	temperatureUnit,
	windSpeedUnit,
	onToggleSettings,
}: WeatherPanelProps) => {
	const { data, status } = useWeather(
		location,
		temperatureUnit,
		windSpeedUnit,
	);

	return (
		<aside
			aria-label={`Počasí pro ${location.name}`}
			className="group font-outfit relative w-full min-w-0"
		>
			<button
				id="weather-settings-button"
				type="button"
				aria-label="Nastavit místo a jednotku teploty"
				aria-expanded={isSettingsOpen}
				aria-controls="weather-settings"
				onClick={onToggleSettings}
				className={`absolute -top-1 right-0 z-10 grid size-9 cursor-pointer place-items-center rounded-full transition-all duration-150 hover:opacity-100! focus-visible:opacity-100! focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
					isSettingsOpen
						? 'bg-white/10 opacity-100'
						: 'opacity-50 lg:opacity-0 lg:group-hover:opacity-60'
				}`}
			>
				<img src={settingsIcon} alt="" className="size-6" />
			</button>

			{data ? (
				<>
					<CurrentWeatherTile
						locationName={location.name}
						temperatureUnit={data.temperatureUnit}
						weather={data.current}
						windSpeedUnit={data.windSpeedUnit}
					/>

					<div className="mt-3 space-y-2">
						{data.forecast.map((forecast) => (
							<ForecastTile key={forecast.date} forecast={forecast} />
						))}
					</div>
				</>
			) : (
				<p className="p-6 text-center text-lg text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.45)]">
					{status === 'error'
						? 'Počasí se nepodařilo načíst.'
						: 'Načítání počasí…'}
				</p>
			)}
		</aside>
	);
};

export default WeatherPanel;
