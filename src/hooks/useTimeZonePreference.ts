import type { TimeZoneId } from '../config/timeZones';
import {
	getTimeZonePreference,
	setTimeZonePreference,
} from '../lib/preferences';
import { usePersistentPreference } from './usePersistentPreference';

/** State and actions exposed by the timezone-preference hook. */
type TimeZonePreference = {
	selectTimeZone: (timeZoneId: TimeZoneId) => void;
	timeZoneId: TimeZoneId;
};

/** Restores and persists the selected timezone. */
export const useTimeZonePreference = (): TimeZonePreference => {
	const [timeZoneId, selectTimeZone] = usePersistentPreference(
		getTimeZonePreference,
		setTimeZonePreference,
	);

	return { timeZoneId, selectTimeZone };
};
