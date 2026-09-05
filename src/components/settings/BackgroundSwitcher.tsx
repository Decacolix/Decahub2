import type { ReactElement } from 'react';
import { backgroundOptions, type BackgroundId } from '../../config/backgrounds';
import type { Language } from '../../config/languages';
import { translations } from '../../config/translations';

/** Inputs required by the background picker. */
type BackgroundSwitcherProps = {
	language: Language;
	selectedBackgroundId: BackgroundId;
	onSelect: (backgroundId: BackgroundId) => void;
};

/** Displays the three persistent background choices. */
const BackgroundSwitcher = ({
	language,
	selectedBackgroundId,
	onSelect,
}: BackgroundSwitcherProps): ReactElement => (
	<nav
		aria-label={translations[language].background.label}
		className="absolute top-4 left-4 z-10 flex items-center gap-2 lg:top-6 lg:right-6 lg:left-auto lg:flex-col"
	>
		{backgroundOptions.map(({ id, icon }) => {
			const isSelected: boolean = id === selectedBackgroundId;
			const text = translations[language].background;
			const buttonLabel: string = `${text.use} ${text.names[id]} ${text.suffix}`;

			return (
				<button
					key={id}
					type="button"
					aria-label={buttonLabel}
					aria-pressed={isSelected}
					onClick={() => onSelect(id)}
					className={`grid size-8 cursor-pointer place-items-center rounded-full border-2 transition duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
						isSelected
							? 'border-white bg-white/15 shadow-lg'
							: 'border-transparent bg-black/10 hover:border-white/60 hover:bg-white/10'
					}`}
				>
					<img src={icon} alt="" className="size-5" />
				</button>
			);
		})}
	</nav>
);

export default BackgroundSwitcher;
