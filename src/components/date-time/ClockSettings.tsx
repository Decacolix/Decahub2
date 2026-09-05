import type { ReactElement } from 'react';
import BinarySwitch from '../settings/BinarySwitch';
import SettingsDialog from '../settings/SettingsDialog';
import type { TimeFormat } from '../../config/clock';
import type { Language } from '../../config/languages';
import { timeZoneNamesEn, timeZoneOptions, type TimeZoneId } from '../../config/timeZones';
import { translations } from '../../config/translations';

/** Inputs and preference callbacks required by the clock dialog. */
type ClockSettingsProps = {
	isOpen: boolean;
	language: Language;
	selectedTimeFormat: TimeFormat;
	selectedTimeZoneId: TimeZoneId;
	onClose: () => void;
	onSelectTimeFormat: (timeFormat: TimeFormat) => void;
	onSelectTimeZone: (timeZoneId: TimeZoneId) => void;
};

/** Lets the user select the clock format and display timezone. */
const ClockSettings = ({
	isOpen,
	language,
	selectedTimeFormat,
	selectedTimeZoneId,
	onClose,
	onSelectTimeFormat,
	onSelectTimeZone,
}: ClockSettingsProps): ReactElement => {
	const text = translations[language].clockSettings;
	const isTwentyFourHour: boolean = selectedTimeFormat === '24-hour';

	return (
		<SettingsDialog
			bodyClassName="max-h-[min(72vh,38rem)] space-y-5 overflow-y-auto p-5"
			closeLabel={text.close}
			id="clock-settings"
			isOpen={isOpen}
			onClose={onClose}
			returnFocusId="clock-settings-button"
			title={text.title}
		>
			<div className="flex items-center justify-between gap-4 rounded-xl border border-white/15 bg-white/5 p-4">
				<div>
					<p className="font-semibold">{text.timeFormat}</p>
					<p className="text-sm text-white/60">{text.timeFormatDescription}</p>
				</div>
				<BinarySwitch
					ariaLabel={text.twentyFourHour}
					isRightSelected={isTwentyFourHour}
					leftLabel="12 h"
					onToggle={() =>
						onSelectTimeFormat(isTwentyFourHour ? '12-hour' : '24-hour')
					}
					rightLabel="24 h"
				/>
			</div>

			<section aria-labelledby="clock-time-zone-title">
				<p id="clock-time-zone-title" className="font-semibold">
					{text.timeZone}
				</p>
				<div className="mt-3 space-y-1">
					{timeZoneOptions.map(({ code, name, utc }) => {
						const isSelected: boolean = code === selectedTimeZoneId;

						return (
							<button
								key={code}
								type="button"
								aria-pressed={isSelected}
								onClick={() => onSelectTimeZone(code)}
								className={`flex w-full cursor-pointer items-start gap-4 rounded-xl px-4 py-3 text-left transition focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white ${isSelected ? 'bg-white text-slate-950' : 'hover:bg-white/10'}`}
							>
								<span className="min-w-20 pt-0.5 text-sm font-semibold tabular-nums">{utc === null ? 'AUTO' : `UTC ${utc}`}</span>
								<span className="text-base leading-snug">{language === 'en' ? timeZoneNamesEn[code] : name}</span>
							</button>
						);
					})}
				</div>
			</section>
		</SettingsDialog>
	);
};

export default ClockSettings;
