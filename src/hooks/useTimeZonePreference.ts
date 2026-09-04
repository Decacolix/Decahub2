import { useState } from 'react';
import type { TimeZoneId } from '../config/timeZones';
import {
	getTimeZonePreference,
	setTimeZonePreference,
} from '../lib/preferences';

export const useTimeZonePreference = () => {
	const [timeZoneId, setTimeZoneId] = useState<TimeZoneId>(
		getTimeZonePreference,
	);

	const selectTimeZone = (nextTimeZoneId: TimeZoneId) => {
		setTimeZoneId(nextTimeZoneId);
		setTimeZonePreference(nextTimeZoneId);
	};

	return { timeZoneId, selectTimeZone };
};

