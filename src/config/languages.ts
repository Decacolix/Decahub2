/** Languages exposed by the dashboard language switcher. */
export const languageOptions: readonly ['cs', 'en'] = ['cs', 'en'];

/** Supported interface-language identifier. */
export type Language = (typeof languageOptions)[number];

/** Language used when no valid saved preference exists. */
export const defaultLanguage: Language = 'cs';

/** Checks unknown persisted data before treating it as a language. */
export const isLanguage = (value: unknown): value is Language =>
	languageOptions.some((language) => language === value);

/** BCP 47 locales used by the browser's internationalization APIs. */
export const languageLocales: Readonly<Record<Language, string>> = {
	cs: 'cs-CZ',
	en: 'en-GB',
};
