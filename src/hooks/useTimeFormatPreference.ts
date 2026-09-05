import type { TimeFormat } from '../config/clock';
import {
	getTimeFormatPreference,
	setTimeFormatPreference,
} from '../lib/preferences';
import { usePersistentPreference } from './usePersistentPreference';

/** State and actions exposed by the time-format preference hook. */
type TimeFormatPreference = {
	selectTimeFormat: (timeFormat: TimeFormat) => void;
	timeFormat: TimeFormat;
};

/** Restores and persists the selected 12/24-hour clock format. */
export const useTimeFormatPreference = (): TimeFormatPreference => {
	const [timeFormat, selectTimeFormat] = usePersistentPreference(
		getTimeFormatPreference,
		setTimeFormatPreference,
	);

	return { timeFormat, selectTimeFormat };
};
