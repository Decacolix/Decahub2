import type { ReactElement } from 'react';
import type { Language } from '../../config/languages';
import { translations } from '../../config/translations';

/** Shared interaction styles for every footer link. */
const linkStyles: string =
	'underline underline-offset-4 transition hover:text-white/70 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

/** Inputs required by the localized footer. */
type AuthorFooterProps = {
	language: Language;
};

/** Displays author information and API attribution. */
const AuthorFooter = ({ language }: AuthorFooterProps): ReactElement => (
	<footer className="font-outfit mt-auto w-full text-center text-sm leading-relaxed text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.45)] lg:col-span-3 lg:row-start-3 lg:mt-0 lg:self-end lg:justify-self-center">
		<p>
			{translations[language].footer.createdBy} |{' '}
			<a href="mailto:davidtoman1997@gmail.com" className={linkStyles}>
				{translations[language].footer.email}
			</a>{' '}
			|{' '}
			<a
				href="https://www.linkedin.com/in/dtoman1997/"
				target="_blank"
				rel="noopener noreferrer"
				className={linkStyles}
			>
				LinkedIn
			</a>{' '}
			|{' '}
			<a
				href="https://github.com/Decacolix/"
				target="_blank"
				rel="noopener noreferrer"
				className={linkStyles}
			>
				GitHub
			</a>
		</p>
		<p className="mt-1">
			API:{' '}
			<a
				href="https://timeapi.io/"
				target="_blank"
				rel="noopener noreferrer"
				className={linkStyles}
			>
				TimeAPI
			</a>{' '}
			|{' '}
			<a
				href="https://open-meteo.com/"
				target="_blank"
				rel="noopener noreferrer"
				className={linkStyles}
			>
				Open-Meteo
			</a>
		</p>
	</footer>
);

export default AuthorFooter;
