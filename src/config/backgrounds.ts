import blueBackground from '../assets/backgrounds/background-blue.svg';
import greenBackground from '../assets/backgrounds/background-green.svg';
import pinkBackground from '../assets/backgrounds/background-pink.svg';
import blueIcon from '../assets/icons/settings/switch-blue.svg';
import greenIcon from '../assets/icons/settings/switch-green.svg';
import pinkIcon from '../assets/icons/settings/switch-pink.svg';

/** Static assets required by one selectable dashboard background. */
type BackgroundOption = {
	backgroundImage: string;
	icon: string;
	id: string;
};

/** Backgrounds displayed by the top-level background picker. */
export const backgroundOptions = [
	{
		id: 'green',
		backgroundImage: greenBackground,
		icon: greenIcon,
	},
	{
		id: 'blue',
		backgroundImage: blueBackground,
		icon: blueIcon,
	},
	{
		id: 'pink',
		backgroundImage: pinkBackground,
		icon: pinkIcon,
	},
] as const satisfies readonly BackgroundOption[];

/** Identifier persisted for a selected background. */
export type BackgroundId = (typeof backgroundOptions)[number]['id'];

/** Background used when no valid saved preference exists. */
export const defaultBackgroundId: BackgroundId = 'green';

/** Checks unknown persisted data before treating it as a background ID. */
export const isBackgroundId = (value: unknown): value is BackgroundId =>
	backgroundOptions.some(({ id }) => id === value);
