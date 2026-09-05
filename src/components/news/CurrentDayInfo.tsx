import { useMemo, type ReactElement } from 'react';
import { languageLocales, type Language } from '../../config/languages';
import { getNameDayMessage } from '../../lib/nameDay';

/** Inputs required to derive day information in the selected timezone. */
type CurrentDayInfoProps = {
	currentTime: Date;
	language: Language;
	timeZone: string | null;
};

/** Calendar details derived from the current instant and selected timezone. */
type CurrentDateDetails = {
	day: number;
	month: number;
	weekNumber: number;
	weekday: string;
	year: number;
};

/** Calculates an ISO-8601 week number from Gregorian date parts. */
const getIsoWeekNumber = (year: number, month: number, day: number): number => {
	const date: Date = new Date(Date.UTC(year, month - 1, day));
	const weekday: number = date.getUTCDay() || 7;

	date.setUTCDate(date.getUTCDate() + 4 - weekday);

	const firstDayOfWeekYear: number = Date.UTC(date.getUTCFullYear(), 0, 1);

	return Math.ceil(((date.getTime() - firstDayOfWeekYear) / 86_400_000 + 1) / 7);
};

/** Extracts a required numeric part from an Intl-formatted date. */
const getNumericDatePart = (
	parts: Intl.DateTimeFormatPart[],
	type: 'day' | 'month' | 'year',
): number => {
	const value: string | undefined = parts.find(
		(part) => part.type === type,
	)?.value;

	if (value === undefined) {
		throw new Error(`The formatted date did not include ${type}.`);
	}

	return Number(value);
};

/** Displays the localized weekday, ISO week number, and Czech name day. */
const CurrentDayInfo = ({
	currentTime,
	language,
	timeZone,
}: CurrentDayInfoProps): ReactElement => {
	const weekdayFormatter = useMemo<Intl.DateTimeFormat>(
		() =>
			new Intl.DateTimeFormat(languageLocales[language], {
				timeZone: timeZone ?? undefined,
				weekday: 'long',
			}),
		[language, timeZone],
	);
	const datePartsFormatter = useMemo<Intl.DateTimeFormat>(
		() =>
			new Intl.DateTimeFormat('en-CA', {
				timeZone: timeZone ?? undefined,
				year: 'numeric',
				month: 'numeric',
				day: 'numeric',
			}),
		[timeZone],
	);
	const { day, month, weekNumber, weekday, year } = useMemo<CurrentDateDetails>(() => {
		const dateParts: Intl.DateTimeFormatPart[] =
			datePartsFormatter.formatToParts(currentTime);
		const selectedYear: number = getNumericDatePart(dateParts, 'year');
		const selectedMonth: number = getNumericDatePart(dateParts, 'month');
		const selectedDay: number = getNumericDatePart(dateParts, 'day');

		return {
			day: selectedDay,
			month: selectedMonth,
			weekNumber: getIsoWeekNumber(selectedYear, selectedMonth, selectedDay),
			weekday: weekdayFormatter.format(currentTime),
			year: selectedYear,
		};
	}, [currentTime, datePartsFormatter, weekdayFormatter]);
	const nameDayMessage: string = getNameDayMessage(month, day, language);
	const nameDaySentence: string = nameDayMessage
		? `${nameDayMessage}${/[.!?]$/.test(nameDayMessage) ? '' : '.'}`
		: '';
	const currentDayText: string =
		language === 'en'
			? `Today is ${weekday}, week number ${weekNumber}.`
			: `Dnes je ${weekday}, ${weekNumber}. týden.`;

	return (
		<div
			className="pr-10 text-lg leading-relaxed font-medium text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.45)] lg:text-xl"
			data-date={`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`}
		>
			<p>{currentDayText}</p>
			{nameDaySentence && <p>{nameDaySentence}</p>}
		</div>
	);
};

export default CurrentDayInfo;
