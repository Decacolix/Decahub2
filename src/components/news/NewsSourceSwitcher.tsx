import type { ReactElement } from 'react';
import SettingsDialog from '../settings/SettingsDialog';
import type { Language } from '../../config/languages';
import {
	newsSources,
	type NewsSource,
	type NewsSourceId,
} from '../../config/newsSources';
import { translations } from '../../config/translations';

/** Inputs and preference callbacks required by the news-source dialog. */
type NewsSourceSwitcherProps = {
	isOpen: boolean;
	language: Language;
	selectedNewsSourceId: NewsSourceId;
	onClose: () => void;
	onSelect: (newsSourceId: NewsSourceId) => void;
};

/** Source columns shown in Czech-first, international-second order. */
const sourceGroups: readonly (readonly NewsSource[])[] = [
	newsSources.filter(({ group }) => group === 'czech'),
	newsSources.filter(({ group }) => group === 'international'),
];

/** Presents the available Czech and international RSS sources. */
const NewsSourceSwitcher = ({
	isOpen,
	language,
	selectedNewsSourceId,
	onClose,
	onSelect,
}: NewsSourceSwitcherProps): ReactElement => {
	const text = translations[language].newsSettings;

	return (
		<SettingsDialog
			bodyClassName="grid grid-cols-2 gap-3 p-3"
			closeLabel={text.close}
			id="news-source-settings"
			isOpen={isOpen}
			onClose={onClose}
			returnFocusId="news-settings-button"
			title={text.title}
		>
			{sourceGroups.map((sources, groupIndex) => (
				<div key={groupIndex} className="space-y-1">
					{sources.map(({ id, name }) => {
						const isSelected: boolean = id === selectedNewsSourceId;

						return (
							<button
								key={id}
								type="button"
								aria-pressed={isSelected}
								onClick={() => onSelect(id)}
								className={`min-h-12 w-full cursor-pointer rounded-xl px-3 py-2 text-left transition focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white ${isSelected ? 'bg-white font-semibold text-slate-950' : 'hover:bg-white/10'}`}
							>
								{name}
							</button>
						);
					})}
				</div>
			))}
		</SettingsDialog>
	);
};

export default NewsSourceSwitcher;
