import type { ReactElement } from 'react';
import type { Language } from '../../config/languages';
import { translations } from '../../config/translations';
import type { TemperatureUnit, WeatherLocation, WindSpeedUnit } from '../../config/weather';
import { useWeather } from '../../hooks/useWeather';
import PanelSettingsButton from '../settings/PanelSettingsButton';
import CurrentWeatherTile from './CurrentWeatherTile';
import ForecastTile from './ForecastTile';

/** Inputs required by the weather panel. */
type WeatherPanelProps = {
	isSettingsOpen: boolean;
	language: Language;
	location: WeatherLocation;
	temperatureUnit: TemperatureUnit;
	windSpeedUnit: WindSpeedUnit;
	onToggleSettings: () => void;
};

/** Loads and displays current conditions plus the three-day forecast. */
const WeatherPanel = ({
	isSettingsOpen,
	language,
	location,
	temperatureUnit,
	windSpeedUnit,
	onToggleSettings,
}: WeatherPanelProps): ReactElement => {
	const { data, status } = useWeather(location, temperatureUnit, windSpeedUnit);
	const text = translations[language].weather;

	return (
		<aside aria-label={`${text.label} ${location.name}`} className="group font-outfit relative w-full min-w-0">
			<PanelSettingsButton
				id="weather-settings-button"
				controls="weather-settings"
				isOpen={isSettingsOpen}
				label={text.settings}
				onToggle={onToggleSettings}
			/>

			{data ? (
				<>
					<CurrentWeatherTile language={language} locationName={location.name} temperatureUnit={data.temperatureUnit} weather={data.current} windSpeedUnit={data.windSpeedUnit} />

					<div className="mt-3 space-y-2">
						{data.forecast.map((forecast) => (
							<ForecastTile key={forecast.date} forecast={forecast} language={language} />
						))}
					</div>
				</>
			) : (
				<p className="p-6 text-center text-lg text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.45)]">{status === 'error' ? text.error : text.loading}</p>
			)}
		</aside>
	);
};

export default WeatherPanel;
