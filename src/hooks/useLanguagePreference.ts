import { useEffect } from 'react';
import type { Language } from '../config/languages';
import {
	getLanguagePreference,
	setLanguagePreference,
} from '../lib/preferences';
import { usePersistentPreference } from './usePersistentPreference';

/** State and actions exposed by the language-preference hook. */
type LanguagePreference = {
	language: Language;
	selectLanguage: (language: Language) => void;
};

/** Restores and persists the language while keeping the document locale current. */
export const useLanguagePreference = (): LanguagePreference => {
	const [language, selectLanguage] = usePersistentPreference(
		getLanguagePreference,
		setLanguagePreference,
	);

	useEffect(() => {
		document.documentElement.lang = language;
	}, [language]);

	return { language, selectLanguage };
};
