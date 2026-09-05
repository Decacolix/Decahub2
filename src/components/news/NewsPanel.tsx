import type { ReactElement } from 'react';
import type { Language } from '../../config/languages';
import {
	getNewsSource,
	type NewsSource,
	type NewsSourceId,
} from '../../config/newsSources';
import { translations } from '../../config/translations';
import { useNews } from '../../hooks/useNews';
import PanelSettingsButton from '../settings/PanelSettingsButton';
import CurrentDayInfo from './CurrentDayInfo';
import HeadlineList from './HeadlineList';

/** Inputs required by the news panel. */
type NewsPanelProps = {
	currentTime: Date;
	isSettingsOpen: boolean;
	language: Language;
	newsSourceId: NewsSourceId;
	timeZone: string | null;
	onToggleSettings: () => void;
};

/** Displays current-day information and headlines from the selected source. */
const NewsPanel = ({
	currentTime,
	isSettingsOpen,
	language,
	newsSourceId,
	timeZone,
	onToggleSettings,
}: NewsPanelProps): ReactElement => {
	const { articles, status } = useNews(newsSourceId);
	const newsSource: NewsSource = getNewsSource(newsSourceId);
	const text = translations[language].news;

	return (
		<section aria-label={`${text.label} – ${newsSource.name}`} className="group font-outfit relative w-full min-w-0 text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.45)]">
			<PanelSettingsButton
				id="news-settings-button"
				controls="news-source-settings"
				isOpen={isSettingsOpen}
				label={text.settings}
				onToggle={onToggleSettings}
			/>

			<header className="mb-3 border-b border-white/50 pb-4">
				<CurrentDayInfo currentTime={currentTime} language={language} timeZone={timeZone} />
				<h2 className="mt-3 text-2xl font-semibold lg:text-3xl">
					<a href={newsSource.homepageUrl} target="_blank" rel="noopener noreferrer" className="inline-block transition hover:text-white/70 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
						{newsSource.name}
					</a>
				</h2>
			</header>

			{status === 'loading' && <p className="py-6 text-center text-lg [text-shadow:0_2px_8px_rgba(0,0,0,0.45)]">{text.loading}</p>}
			{status === 'error' && <p className="py-6 text-center text-lg [text-shadow:0_2px_8px_rgba(0,0,0,0.45)]">{text.error}</p>}
			{status === 'ready' && <HeadlineList articles={articles} language={language} timeZone={timeZone} />}
		</section>
	);
};

export default NewsPanel;
