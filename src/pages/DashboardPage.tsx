import { useCallback, useState, type ReactElement } from 'react';
import ClockWithDate from '../components/date-time/ClockWithDate';
import AuthorFooter from '../components/footer/AuthorFooter';
import NewsPanel from '../components/news/NewsPanel';
import NewsSourceSwitcher from '../components/news/NewsSourceSwitcher';
import BackgroundSwitcher from '../components/settings/BackgroundSwitcher';
import LanguageSwitcher from '../components/settings/LanguageSwitcher';
import WeatherPanel from '../components/weather/WeatherPanel';
import WeatherSettings from '../components/weather/WeatherSettings';
import { backgroundOptions } from '../config/backgrounds';
import { localTimeZoneId } from '../config/timeZones';
import { useBackgroundPreference } from '../hooks/useBackgroundPreference';
import { useLanguagePreference } from '../hooks/useLanguagePreference';
import { useNewsSourcePreference } from '../hooks/useNewsSourcePreference';
import { useTimeApiClock } from '../hooks/useTimeApiClock';
import { useTimeFormatPreference } from '../hooks/useTimeFormatPreference';
import { useTimeZonePreference } from '../hooks/useTimeZonePreference';
import { useWeatherPreferences } from '../hooks/useWeatherPreferences';
import DashboardLayout from '../layouts/DashboardLayout';

/** Currently visible settings dialog, or `null` when all dialogs are closed. */
type ActiveSettings = 'clock' | 'news' | 'weather' | null;

/** Non-null settings identifiers accepted by the shared toggle function. */
type SettingsName = Exclude<ActiveSettings, null>;

/** Coordinates dashboard data, preferences, panels, and mutually exclusive dialogs. */
const DashboardPage = (): ReactElement => {
	const [activeSettings, setActiveSettings] = useState<ActiveSettings>(null);
	const { backgroundId, selectBackground } = useBackgroundPreference();
	const { language, selectLanguage } = useLanguagePreference();
	const { newsSourceId, selectNewsSource } = useNewsSourcePreference();
	const { timeFormat, selectTimeFormat } = useTimeFormatPreference();
	const { timeZoneId, selectTimeZone } = useTimeZonePreference();
	const {
		location,
		temperatureUnit,
		windSpeedUnit,
		selectLocation,
		selectTemperatureUnit,
		selectWindSpeedUnit,
	} = useWeatherPreferences();
	const selectedTimeZone: string | null =
		timeZoneId === localTimeZoneId ? null : timeZoneId;
	const currentTime: Date = useTimeApiClock(selectedTimeZone);
	const selectedBackground: (typeof backgroundOptions)[number] =
		backgroundOptions.find(({ id }) => id === backgroundId) ??
		backgroundOptions[0];
	const closeSettings = useCallback(
		(): void => setActiveSettings(null),
		[],
	);
	const toggleSettings = useCallback(
		(settingsName: SettingsName): void =>
			setActiveSettings((currentSettings) =>
				currentSettings === settingsName ? null : settingsName,
			),
		[],
	);
	const settingsOverlay: ReactElement | null =
		activeSettings === 'weather' ? (
			<WeatherSettings
				isOpen
				language={language}
				selectedLocation={location}
				temperatureUnit={temperatureUnit}
				windSpeedUnit={windSpeedUnit}
				onClose={closeSettings}
				onSelectLocation={selectLocation}
				onSelectTemperatureUnit={selectTemperatureUnit}
				onSelectWindSpeedUnit={selectWindSpeedUnit}
			/>
		) : activeSettings === 'news' ? (
			<NewsSourceSwitcher
				isOpen
				language={language}
				selectedNewsSourceId={newsSourceId}
				onClose={closeSettings}
				onSelect={selectNewsSource}
			/>
		) : null;

	return (
		<DashboardLayout backgroundImage={selectedBackground.backgroundImage}>
			<BackgroundSwitcher
				language={language}
				selectedBackgroundId={backgroundId}
				onSelect={selectBackground}
			/>
			<LanguageSwitcher language={language} onSelect={selectLanguage} />
			<main className="flex min-h-dvh w-full flex-col gap-8 px-4 pt-20 pb-8 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:grid-rows-[auto_1fr_auto] lg:items-start lg:gap-x-20 lg:px-20 lg:pt-6">
				<header className={`relative flex min-w-0 justify-center lg:col-start-2 lg:row-start-1 ${activeSettings === null ? 'z-20' : 'z-30'}`}>
					<ClockWithDate
						currentTime={currentTime}
						isSettingsOpen={activeSettings === 'clock'}
						language={language}
						selectedTimeZoneId={timeZoneId}
						timeFormat={timeFormat}
						onCloseSettings={closeSettings}
						onSelectTimeFormat={selectTimeFormat}
						onSelectTimeZone={selectTimeZone}
						onToggleSettings={() => toggleSettings('clock')}
						settingsOverlay={settingsOverlay}
					/>
				</header>

				<div className="relative z-10 w-full min-w-0 self-start lg:col-start-1 lg:row-start-1 lg:max-w-92 lg:justify-self-start">
					<WeatherPanel
						isSettingsOpen={activeSettings === 'weather'}
						language={language}
						location={location}
						temperatureUnit={temperatureUnit}
						windSpeedUnit={windSpeedUnit}
						onToggleSettings={() => toggleSettings('weather')}
					/>
				</div>

				<div className="relative z-10 w-full min-w-0 self-start lg:col-start-3 lg:row-start-1 lg:max-w-120 lg:justify-self-end">
					<NewsPanel
						currentTime={currentTime}
						isSettingsOpen={activeSettings === 'news'}
						language={language}
						newsSourceId={newsSourceId}
						timeZone={selectedTimeZone}
						onToggleSettings={() => toggleSettings('news')}
					/>
				</div>

				<AuthorFooter language={language} />
			</main>
		</DashboardLayout>
	);
};

export default DashboardPage;
