import cloudIcon from '../assets/icons/weather/cloud.svg';
import rainIcon from '../assets/icons/weather/rain.svg';
import snowIcon from '../assets/icons/weather/snow.svg';
import sunCloudIcon from '../assets/icons/weather/sun-cloud.svg';
import sunIcon from '../assets/icons/weather/sun.svg';
import thunderIcon from '../assets/icons/weather/thunder.svg';

type WeatherVisual = {
	icon: string;
	description: string;
};

export const getWeatherVisual = (weatherCode: number): WeatherVisual => {
	switch (weatherCode) {
		case 0:
			return { icon: sunIcon, description: 'Jasno' };
		case 1:
		case 2:
		case 3:
			return { icon: sunCloudIcon, description: 'Oblačno' };
		case 45:
		case 48:
		case 51:
		case 53:
		case 55:
		case 56:
		case 57:
			return { icon: cloudIcon, description: 'Mlha nebo mrholení' };
		case 61:
		case 63:
		case 65:
		case 66:
		case 67:
		case 80:
		case 81:
		case 82:
			return { icon: rainIcon, description: 'Déšť' };
		case 71:
		case 73:
		case 75:
		case 77:
		case 85:
		case 86:
			return { icon: snowIcon, description: 'Sněžení' };
		case 95:
		case 96:
		case 99:
			return { icon: thunderIcon, description: 'Bouřky' };
		default:
			return { icon: cloudIcon, description: 'Neznámé počasí' };
	}
};

