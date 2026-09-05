import { useEffect, useState } from 'react';
import type { NewsSourceId } from '../config/newsSources';
import { fetchNews } from '../services/newsApi';
import type { NewsArticle } from '../types/news';

/** Loading state returned by the news hook. */
type NewsState = {
	articles: NewsArticle[];
	sourceId: NewsSourceId | null;
	status: 'loading' | 'ready' | 'error';
};

/** Refresh headlines every ten minutes. */
const refreshInterval: number = 10 * 60 * 1_000;

/** Loads one RSS source immediately and refreshes it in the background. */
export const useNews = (newsSourceId: NewsSourceId): NewsState => {
	const [newsState, setNewsState] = useState<NewsState>({
		articles: [],
		sourceId: null,
		status: 'loading',
	});

	useEffect(() => {
		const controller: AbortController = new AbortController();

		const loadNews = async (): Promise<void> => {
			try {
				const articles: NewsArticle[] = await fetchNews(
					newsSourceId,
					controller.signal,
				);
				setNewsState({ articles, sourceId: newsSourceId, status: 'ready' });
			} catch (error) {
				if (error instanceof DOMException && error.name === 'AbortError') {
					return;
				}

				setNewsState({
					articles: [],
					sourceId: newsSourceId,
					status: 'error',
				});
			}
		};

		void loadNews();
		const refreshTimer: number = window.setInterval(
			() => void loadNews(),
			refreshInterval,
		);

		return () => {
			controller.abort();
			window.clearInterval(refreshTimer);
		};
	}, [newsSourceId]);

	if (newsState.sourceId === newsSourceId) {
		return newsState;
	}

	return { articles: [], sourceId: newsSourceId, status: 'loading' };
};
