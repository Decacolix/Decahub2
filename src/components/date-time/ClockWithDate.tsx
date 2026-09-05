import { useMemo, type ReactElement, type ReactNode } from 'react';
import type { TimeFormat } from '../../config/clock';
import { languageLocales, type Language } from '../../config/languages';
import { localTimeZoneId, type TimeZoneId } from '../../config/timeZones';
import { translations } from '../../config/translations';
import PanelSettingsButton from '../settings/PanelSettingsButton';
import ClockSettings from './ClockSettings';

/** Inputs and preference callbacks required by the clock panel. */
type ClockWithDateProps = {
	currentTime: Date;
	isSettingsOpen: boolean;
	language: Language;
	selectedTimeZoneId: TimeZoneId;
	timeFormat: TimeFormat;
	onCloseSettings: () => void;
	onSelectTimeFormat: (timeFormat: TimeFormat) => void;
	onSelectTimeZone: (timeZoneId: TimeZoneId) => void;
	onToggleSettings: () => void;
	settingsOverlay?: ReactNode;
};

/** Shared high-contrast text treatment for the clock and date. */
const clockTextStyles: string =
	'text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.6)]';

/** Displays the selected timezone's live time and localized calendar date. */
const ClockWithDate = ({
	currentTime,
	isSettingsOpen,
	language,
	selectedTimeZoneId,
	timeFormat,
	onCloseSettings,
	onSelectTimeFormat,
	onSelectTimeZone,
	onToggleSettings,
	settingsOverlay,
}: ClockWithDateProps): ReactElement => {
	const timeZone: string | null = selectedTimeZoneId === localTimeZoneId ? null : selectedTimeZoneId;
	const text = translations[language];
	const timeFormatter = useMemo<Intl.DateTimeFormat>(
		() =>
			new Intl.DateTimeFormat(languageLocales[language], {
				timeZone: timeZone ?? undefined,
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
				hourCycle: timeFormat === '12-hour' ? 'h12' : 'h23',
			}),
		[language, timeFormat, timeZone],
	);
	const dateFormatter = useMemo<Intl.DateTimeFormat>(
		() =>
			new Intl.DateTimeFormat(languageLocales[language], {
				timeZone: timeZone ?? undefined,
				day: 'numeric',
				month: 'long',
				year: 'numeric',
			}),
		[language, timeZone],
	);
	const timeParts: Intl.DateTimeFormatPart[] =
		timeFormatter.formatToParts(currentTime);

	return (
		<section aria-label={text.clock.label} className="group font-outfit relative w-full min-w-full max-w-md text-center text-white lg:w-fit lg:max-w-none">
			<div className="relative px-8 whitespace-nowrap lg:px-12">
				<PanelSettingsButton
					id="clock-settings-button"
					controls="clock-settings"
					isOpen={isSettingsOpen}
					label={text.clock.settings}
					onToggle={onToggleSettings}
				/>

				<time dateTime={currentTime.toISOString()} className={`block text-6xl leading-none font-light tracking-wide tabular-nums xl:text-8xl ${clockTextStyles}`}>
					{timeParts.map((part, index) => (
						<span key={`${part.type}-${index}`} className={part.type === 'dayPeriod' ? 'inline-block text-[0.35em] font-normal tracking-normal' : undefined}>
							{part.value}
						</span>
					))}
				</time>
				<p className={`mt-3 text-2xl font-normal lg:text-3xl ${clockTextStyles}`}>{dateFormatter.format(currentTime)}</p>
			</div>

			<ClockSettings isOpen={isSettingsOpen} language={language} selectedTimeFormat={timeFormat} selectedTimeZoneId={selectedTimeZoneId} onClose={onCloseSettings} onSelectTimeFormat={onSelectTimeFormat} onSelectTimeZone={onSelectTimeZone} />
			{settingsOverlay}
		</section>
	);
};

export default ClockWithDate;
