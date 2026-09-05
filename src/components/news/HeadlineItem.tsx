import { useMemo, type ReactElement } from 'react';
import type { NewsArticle } from '../../types/news';

/** Inputs required to display one normalized headline. */
type HeadlineItemProps = {
	article: NewsArticle;
	timeZone: string | null;
};

/** Displays a linked headline and its publication timestamp. */
const HeadlineItem = ({ article, timeZone }: HeadlineItemProps): ReactElement => {
	const dateFormatter = useMemo<Intl.DateTimeFormat>(
		() =>
			new Intl.DateTimeFormat('cs-CZ', {
				timeZone: timeZone ?? undefined,
				day: 'numeric',
				month: 'numeric',
				year: 'numeric',
			}),
		[timeZone],
	);
	const timeFormatter = useMemo<Intl.DateTimeFormat>(
		() =>
			new Intl.DateTimeFormat('cs-CZ', {
				timeZone: timeZone ?? undefined,
				hour: '2-digit',
				minute: '2-digit',
				hourCycle: 'h23',
			}),
		[timeZone],
	);
	const publishedAt: Date = new Date(article.publishedAt);

	return (
		<li className="border-t border-white/50 first:border-t-0">
			<a href={article.url} target="_blank" rel="noopener noreferrer" className="group/headline block py-3 transition hover:text-white/75 focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
				<h3 className="text-base leading-snug font-semibold lg:text-lg">{article.title}</h3>
				<time dateTime={article.publishedAt} className="mt-1 block text-sm font-normal text-white/65 group-hover/headline:text-white/55">
					{dateFormatter.format(publishedAt)}, {timeFormatter.format(publishedAt)}
				</time>
			</a>
		</li>
	);
};

export default HeadlineItem;
