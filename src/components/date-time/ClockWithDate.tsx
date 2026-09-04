import { useCallback, useMemo, useRef, type ReactNode } from 'react';
import settingsIcon from '../../assets/icons/settings/settings-icon.svg';
import { localTimeZoneId, type TimeZoneId } from '../../config/timeZones';
import { useTimeApiClock } from '../../hooks/useTimeApiClock';
import TimeZoneSettings from './TimeZoneSettings';

type ClockWithDateProps = {
	isSettingsOpen: boolean;
	selectedTimeZoneId: TimeZoneId;
	onCloseSettings: () => void;
	onSelectTimeZone: (timeZoneId: TimeZoneId) => void;
	onToggleSettings: () => void;
	settingsOverlay?: ReactNode;
};

const clockTextStyles = 'text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.6)]';

const ClockWithDate = ({
	isSettingsOpen,
	selectedTimeZoneId,
	onCloseSettings,
	onSelectTimeZone,
	onToggleSettings,
	settingsOverlay,
}: ClockWithDateProps) => {
	const settingsButton = useRef<HTMLButtonElement>(null);
	const timeZone = selectedTimeZoneId === localTimeZoneId ? null : selectedTimeZoneId;
	const currentTime = useTimeApiClock(timeZone);
	const timeFormatter = useMemo(
		() =>
			new Intl.DateTimeFormat('cs-CZ', {
				timeZone: timeZone ?? undefined,
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
				hourCycle: 'h23',
			}),
		[timeZone],
	);
	const dateFormatter = useMemo(
		() =>
			new Intl.DateTimeFormat('cs-CZ', {
				timeZone: timeZone ?? undefined,
				day: 'numeric',
				month: 'long',
				year: 'numeric',
			}),
		[timeZone],
	);

	const closeSettings = useCallback(() => {
		onCloseSettings();
		window.requestAnimationFrame(() => settingsButton.current?.focus());
	}, [onCloseSettings]);

	return (
		<section aria-label="Aktuální datum a čas" className="group font-outfit relative w-full max-w-md text-center text-white lg:w-fit lg:max-w-none">
			<div className="relative px-8 py-1 whitespace-nowrap lg:px-12">
				<button
					ref={settingsButton}
					type="button"
					aria-label="Nastavit časové pásmo"
					aria-expanded={isSettingsOpen}
					aria-controls="time-zone-settings"
					onClick={onToggleSettings}
					className={`absolute -top-1 right-0 grid size-9 cursor-pointer place-items-center rounded-full transition-all duration-150 hover:opacity-100! focus-visible:opacity-100! focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
						isSettingsOpen ? 'bg-white/10 opacity-100' : 'opacity-50 lg:opacity-0 lg:group-hover:opacity-60'
					}`}
				>
					<img src={settingsIcon} alt="" className="size-6" />
				</button>

				<time dateTime={currentTime.toISOString()} className={`block text-6xl leading-none font-light tracking-wide tabular-nums lg:text-8xl ${clockTextStyles}`}>
					{timeFormatter.format(currentTime)}
				</time>
				<p className={`mt-3 text-2xl font-normal lg:text-3xl ${clockTextStyles}`}>{dateFormatter.format(currentTime)}</p>
			</div>

			<TimeZoneSettings isOpen={isSettingsOpen} selectedTimeZoneId={selectedTimeZoneId} onClose={closeSettings} onSelect={onSelectTimeZone} />
			{settingsOverlay}
		</section>
	);
};

export default ClockWithDate;
