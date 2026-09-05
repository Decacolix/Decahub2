import { languageOptions, type Language } from '../../config/languages';
import { translations } from '../../config/translations';

/** Inputs required by the language picker. */
type LanguageSwitcherProps = {
	language: Language;
	onSelect: (language: Language) => void;
};

/** Displays the persistent Czech/English language choices. */
const LanguageSwitcher = ({ language, onSelect }: LanguageSwitcherProps): ReactElement => (
	<nav aria-label={translations[language].language} className="font-outfit absolute top-4 right-8 z-10 flex items-center gap-3 text-sm font-semibold [text-shadow:0_2px_8px_rgba(0,0,0,0.45)] w-8 lg:top-40 lg:right-6 lg:flex-col lg:gap-1">
		{languageOptions.map((languageOption) => {
			const isSelected: boolean = languageOption === language;

			return (
				<button
					key={languageOption}
					type="button"
					aria-pressed={isSelected}
					onClick={() => onSelect(languageOption)}
					className={`cursor-pointer transition hover:text-white focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${isSelected ? 'text-white' : 'text-white/45'}`}
				>
					{languageOption.toUpperCase()}
				</button>
			);
		})}
	</nav>
);

export default LanguageSwitcher;
import type { ReactElement } from 'react';
