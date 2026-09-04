import { useCallback, useState } from 'react';
import ClockWithDate from '../components/date-time/ClockWithDate';
import NewsPanel from '../components/news/NewsPanel';
import BackgroundSwitcher from '../components/settings/BackgroundSwitcher';
import WeatherPanel from '../components/weather/WeatherPanel';
import WeatherSettings from '../components/weather/WeatherSettings';
import { backgroundOptions } from '../config/backgrounds';
import { useBackgroundPreference } from '../hooks/useBackgroundPreference';
import { useTimeZonePreference } from '../hooks/useTimeZonePreference';
import { useWeatherPreferences } from '../hooks/useWeatherPreferences';
import DashboardLayout from '../layouts/DashboardLayout';

type ActiveSettings = 'clock' | 'weather' | null;

const DashboardPage = () => {
	const [activeSettings, setActiveSettings] = useState<ActiveSettings>(null);
	const { backgroundId, selectBackground } = useBackgroundPreference();
	const { timeZoneId, selectTimeZone } = useTimeZonePreference();
	const {
		location,
		temperatureUnit,
		windSpeedUnit,
		selectLocation,
		selectTemperatureUnit,
		selectWindSpeedUnit,
	} = useWeatherPreferences();
	const selectedBackground = backgroundOptions.find(({ id }) => id === backgroundId) ?? backgroundOptions[0];
	const closeSettings = useCallback(() => setActiveSettings(null), []);
	const closeWeatherSettings = useCallback(() => {
		setActiveSettings(null);
		window.requestAnimationFrame(() =>
			document.getElementById('weather-settings-button')?.focus(),
		);
	}, []);
	const toggleClockSettings = useCallback(
		() =>
			setActiveSettings((currentSettings) =>
				currentSettings === 'clock' ? null : 'clock',
			),
		[],
	);
	const toggleWeatherSettings = useCallback(
		() =>
			setActiveSettings((currentSettings) =>
				currentSettings === 'weather' ? null : 'weather',
			),
		[],
	);

	return (
		<DashboardLayout backgroundImage={selectedBackground.backgroundImage}>
			<BackgroundSwitcher selectedBackgroundId={backgroundId} onSelect={selectBackground} />
			<main className="grid min-h-dvh w-full grid-cols-1 content-start gap-8 px-4 pt-20 pb-8 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:grid-rows-1 lg:items-start lg:gap-x-20 lg:px-20 lg:pt-6">
				<header className={`relative flex min-w-0 justify-center lg:col-start-2 lg:row-start-1 ${activeSettings === null ? 'z-20' : 'z-30'}`}>
					<ClockWithDate
						isSettingsOpen={activeSettings === 'clock'}
						selectedTimeZoneId={timeZoneId}
						onCloseSettings={closeSettings}
						onSelectTimeZone={selectTimeZone}
						onToggleSettings={toggleClockSettings}
						settingsOverlay={
							activeSettings === 'weather' ? (
								<WeatherSettings
									isOpen
									selectedLocation={location}
									temperatureUnit={temperatureUnit}
									windSpeedUnit={windSpeedUnit}
									onClose={closeWeatherSettings}
									onSelectLocation={selectLocation}
									onSelectTemperatureUnit={selectTemperatureUnit}
									onSelectWindSpeedUnit={selectWindSpeedUnit}
								/>
							) : null
						}
					/>
				</header>

				<div className="relative z-10 min-w-0 self-start lg:col-start-1 lg:row-start-1 lg:w-full lg:max-w-92 lg:justify-self-start">
					<WeatherPanel
						isSettingsOpen={activeSettings === 'weather'}
						location={location}
						temperatureUnit={temperatureUnit}
						windSpeedUnit={windSpeedUnit}
						onToggleSettings={toggleWeatherSettings}
					/>
				</div>

				<div className="relative z-10 min-w-0 self-start lg:col-start-3 lg:row-start-1 lg:w-full lg:max-w-120 lg:justify-self-end">
					<NewsPanel />
				</div>
			</main>
		</DashboardLayout>
	);
};

export default DashboardPage;
