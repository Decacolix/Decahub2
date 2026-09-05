import { isFiniteNumber, isRecord } from '../lib/typeGuards';

/** Minimal TimeAPI payload consumed by the clock. */
type TimeApiResponse = {
	timezone: string;
	unix_timestamp: number;
};

/** Local proxy route for TimeAPI. */
const timeApiUrl: string = '/api/time';

/** Validates the unknown JSON payload returned by TimeAPI. */
const isTimeApiResponse = (value: unknown): value is TimeApiResponse => {
	if (!isRecord(value)) {
		return false;
	}

	return (
		typeof value.timezone === 'string' &&
		isFiniteNumber(value.unix_timestamp)
	);
};

/** Returns the selected timezone's current Unix time in milliseconds. */
export const fetchCurrentTime = async (
	timeZone: string,
	signal: AbortSignal,
): Promise<number> => {
	const searchParameters: URLSearchParams = new URLSearchParams({ timeZone });

	const response: Response = await fetch(`${timeApiUrl}?${searchParameters}`, {
		headers: { Accept: 'application/json' },
		signal,
	});

	if (!response.ok) {
		throw new Error(`TimeAPI returned ${response.status}.`);
	}

	const data: unknown = await response.json();

	if (!isTimeApiResponse(data)) {
		throw new Error('TimeAPI returned an unexpected response.');
	}

	return data.unix_timestamp * 1_000;
};
