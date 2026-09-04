type TimeApiResponse = {
	timezone: string;
	unix_timestamp: number;
};

const timeApiUrl = '/api/time';

const isTimeApiResponse = (value: unknown): value is TimeApiResponse => {
	if (typeof value !== 'object' || value === null) {
		return false;
	}

	const response = value as Record<string, unknown>;

	return (
		typeof response.timezone === 'string' &&
		typeof response.unix_timestamp === 'number'
	);
};

export const fetchCurrentTime = async (
	timeZone: string,
	signal: AbortSignal,
): Promise<number> => {
	const searchParameters = new URLSearchParams({ timeZone });

	const response = await fetch(`${timeApiUrl}?${searchParameters}`, {
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
