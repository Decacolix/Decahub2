import type { Language } from '../../config/languages';
import { translations } from '../../config/translations';
import type { NewsArticle } from '../../types/news';
import HeadlineItem from './HeadlineItem';

/** Inputs required by the headline list. */
type HeadlineListProps = {
	articles: NewsArticle[];
	language: Language;
	timeZone: string | null;
};

/** Renders the normalized article collection in newest-first order. */
const HeadlineList = ({ articles, language, timeZone }: HeadlineListProps): ReactElement => (
	<ul aria-label={translations[language].news.latest}>
		{articles.map((article) => (
			<HeadlineItem key={article.id} article={article} timeZone={timeZone} />
		))}
	</ul>
);

export default HeadlineList;
import type { ReactElement } from 'react';
