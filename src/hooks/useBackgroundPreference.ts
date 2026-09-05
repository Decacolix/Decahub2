import type { BackgroundId } from '../config/backgrounds';
import {
	getBackgroundPreference,
	setBackgroundPreference,
} from '../lib/preferences';
import { usePersistentPreference } from './usePersistentPreference';

/** State and actions exposed by the background-preference hook. */
type BackgroundPreference = {
	backgroundId: BackgroundId;
	selectBackground: (backgroundId: BackgroundId) => void;
};

/** Restores and persists the selected dashboard background. */
export const useBackgroundPreference = (): BackgroundPreference => {
	const [backgroundId, selectBackground] = usePersistentPreference(
		getBackgroundPreference,
		setBackgroundPreference,
	);

	return { backgroundId, selectBackground };
};
