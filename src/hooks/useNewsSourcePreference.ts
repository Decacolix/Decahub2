import type { NewsSourceId } from '../config/newsSources';
import {
	getNewsSourcePreference,
	setNewsSourcePreference,
} from '../lib/preferences';
import { usePersistentPreference } from './usePersistentPreference';

/** State and actions exposed by the news-source preference hook. */
type NewsSourcePreference = {
	newsSourceId: NewsSourceId;
	selectNewsSource: (newsSourceId: NewsSourceId) => void;
};

/** Restores and persists the selected RSS source. */
export const useNewsSourcePreference = (): NewsSourcePreference => {
	const [newsSourceId, selectNewsSource] = usePersistentPreference(
		getNewsSourcePreference,
		setNewsSourcePreference,
	);

	return { newsSourceId, selectNewsSource };
};
