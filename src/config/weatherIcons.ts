import cloudIcon from '../assets/icons/weather/cloud.svg';
import rainIcon from '../assets/icons/weather/rain.svg';
import snowIcon from '../assets/icons/weather/snow.svg';
import sunCloudIcon from '../assets/icons/weather/sun-cloud.svg';
import sunIcon from '../assets/icons/weather/sun.svg';
import thunderIcon from '../assets/icons/weather/thunder.svg';
import type { Language } from './languages';

/** Icon and accessible description displayed for a weather code. */
type WeatherVisual = {
	icon: string;
	description: string;
};

/** Keys shared by both localized weather-description dictionaries. */
type WeatherDescription =
	| 'clear'
	| 'cloudy'
	| 'fog'
	| 'rain'
	| 'snow'
	| 'thunder'
	| 'unknown';

/** Localized descriptions shared by all weather-code lookups. */
const weatherDescriptions: Readonly<
	Record<Language, Readonly<Record<WeatherDescription, string>>>
> = {
	cs: {
		clear: 'Jasno',
		cloudy: 'Oblačno',
		fog: 'Mlha nebo mrholení',
		rain: 'Déšť',
		snow: 'Sněžení',
		thunder: 'Bouřky',
		unknown: 'Neznámé počasí',
	},
	en: {
		clear: 'Clear sky',
		cloudy: 'Cloudy',
		fog: 'Fog or drizzle',
		rain: 'Rain',
		snow: 'Snow',
		thunder: 'Thunderstorm',
		unknown: 'Unknown weather',
	},
};

/** Maps a WMO weather code to its icon and localized description. */
export const getWeatherVisual = (
	weatherCode: number,
	language: Language,
): WeatherVisual => {
	const descriptions: Readonly<Record<WeatherDescription, string>> =
		weatherDescriptions[language];

	switch (weatherCode) {
		case 0:
			return { icon: sunIcon, description: descriptions.clear };
		case 1:
		case 2:
		case 3:
			return { icon: sunCloudIcon, description: descriptions.cloudy };
		case 45:
		case 48:
		case 51:
		case 53:
		case 55:
		case 56:
		case 57:
			return { icon: cloudIcon, description: descriptions.fog };
		case 61:
		case 63:
		case 65:
		case 66:
		case 67:
		case 80:
		case 81:
		case 82:
			return { icon: rainIcon, description: descriptions.rain };
		case 71:
		case 73:
		case 75:
		case 77:
		case 85:
		case 86:
			return { icon: snowIcon, description: descriptions.snow };
		case 95:
		case 96:
		case 99:
			return { icon: thunderIcon, description: descriptions.thunder };
		default:
			return { icon: cloudIcon, description: descriptions.unknown };
	}
};
