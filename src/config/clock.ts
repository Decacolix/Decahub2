/** Clock formats available in the settings dialog. */
export const timeFormats: readonly ['12-hour', '24-hour'] = [
	'12-hour',
	'24-hour',
];

/** Identifier persisted for the selected clock format. */
export type TimeFormat = (typeof timeFormats)[number];

/** Clock format used when no valid saved preference exists. */
export const defaultTimeFormat: TimeFormat = '24-hour';

/** Checks unknown persisted data before treating it as a clock format. */
export const isTimeFormat = (value: unknown): value is TimeFormat =>
	timeFormats.some((timeFormat) => timeFormat === value);
