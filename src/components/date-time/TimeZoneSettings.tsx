import { useEffect } from 'react';
import closeIcon from '../../assets/icons/settings/close-icon.svg';
import { timeZoneOptions, type TimeZoneId } from '../../config/timeZones';

type TimeZoneSettingsProps = {
	isOpen: boolean;
	selectedTimeZoneId: TimeZoneId;
	onClose: () => void;
	onSelect: (timeZoneId: TimeZoneId) => void;
};

const TimeZoneSettings = ({ isOpen, selectedTimeZoneId, onClose, onSelect }: TimeZoneSettingsProps) => {
	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose();
			}
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, onClose]);

	if (!isOpen) {
		return null;
	}

	return (
		<div
			id="time-zone-settings"
			role="dialog"
			aria-labelledby="time-zone-settings-title"
			className="absolute top-[50%] left-1/2 z-30 mt-4 w-[min(92vw,34rem)] -translate-x-1/2 overflow-hidden rounded-2xl border border-white/20 bg-slate-950/85 text-left text-white shadow-2xl backdrop-blur-xl lg:top-full"
		>
			<header className="flex items-center justify-between border-b border-white/15 px-5 py-4">
				<h2 id="time-zone-settings-title" className="text-xl font-semibold">
					Časové pásmo
				</h2>
				<button
					type="button"
					autoFocus
					aria-label="Zavřít nastavení časového pásma"
					onClick={onClose}
					className="grid size-9 cursor-pointer place-items-center rounded-full opacity-70 transition hover:bg-white/10 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
				>
					<img src={closeIcon} alt="" className="size-4" />
				</button>
			</header>

			<div className="max-h-[min(60vh,32rem)] space-y-1 overflow-y-auto p-3">
				{timeZoneOptions.map(({ code, name, utc }) => {
					const isSelected = code === selectedTimeZoneId;

					return (
						<button
							key={code}
							type="button"
							aria-pressed={isSelected}
							onClick={() => {
								onSelect(code);
							}}
							className={`flex w-full cursor-pointer items-start gap-4 rounded-xl px-4 py-3 text-left transition focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white ${isSelected ? 'bg-white text-slate-950' : 'hover:bg-white/10'}`}
						>
							<span className="min-w-20 pt-0.5 text-sm font-semibold tabular-nums">{utc === null ? 'AUTO' : `UTC ${utc}`}</span>
							<span className="text-base leading-snug">{name}</span>
						</button>
					);
				})}
			</div>
		</div>
	);
};

export default TimeZoneSettings;
