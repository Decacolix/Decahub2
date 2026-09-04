import blueBackground from '../assets/backgrounds/background-blue.svg';
import greenBackground from '../assets/backgrounds/background-green.svg';
import pinkBackground from '../assets/backgrounds/background-pink.svg';
import blueIcon from '../assets/icons/settings/switch-blue.svg';
import greenIcon from '../assets/icons/settings/switch-green.svg';
import pinkIcon from '../assets/icons/settings/switch-pink.svg';

export const backgroundOptions = [
	{
		id: 'green',
		label: 'Green',
		backgroundImage: greenBackground,
		icon: greenIcon,
	},
	{
		id: 'blue',
		label: 'Blue',
		backgroundImage: blueBackground,
		icon: blueIcon,
	},
	{
		id: 'pink',
		label: 'Pink',
		backgroundImage: pinkBackground,
		icon: pinkIcon,
	},
] as const;

export type BackgroundId = (typeof backgroundOptions)[number]['id'];

export const defaultBackgroundId: BackgroundId = 'green';

export const isBackgroundId = (value: unknown): value is BackgroundId =>
	backgroundOptions.some(({ id }) => id === value);
