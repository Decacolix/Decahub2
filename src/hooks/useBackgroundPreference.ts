import { useState } from 'react';
import type { BackgroundId } from '../config/backgrounds';
import {
	getBackgroundPreference,
	setBackgroundPreference,
} from '../lib/preferences';

export const useBackgroundPreference = () => {
	const [backgroundId, setBackgroundId] = useState<BackgroundId>(
		getBackgroundPreference,
	);

	const selectBackground = (nextBackgroundId: BackgroundId) => {
		setBackgroundId(nextBackgroundId);
		setBackgroundPreference(nextBackgroundId);
	};

	return { backgroundId, selectBackground };
};

