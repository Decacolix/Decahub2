import { useCallback, useEffect, useRef, useState } from 'react';
import closeIcon from '../../assets/icons/settings/close-icon.svg';
import searchIcon from '../../assets/icons/settings/search-icon.svg';
import type {
	TemperatureUnit,
	WeatherLocation,
	WindSpeedUnit,
} from '../../config/weather';
import { searchWeatherLocations } from '../../services/weatherLocationApi';

type WeatherSettingsProps = {
	isOpen: boolean;
	selectedLocation: WeatherLocation;
	temperatureUnit: TemperatureUnit;
	windSpeedUnit: WindSpeedUnit;
	onClose: () => void;
	onSelectLocation: (location: WeatherLocation) => void;
	onSelectTemperatureUnit: (temperatureUnit: TemperatureUnit) => void;
	onSelectWindSpeedUnit: (windSpeedUnit: WindSpeedUnit) => void;
};

type SearchStatus = 'idle' | 'searching' | 'found' | 'not-found' | 'error';

const coordinateFormatter = new Intl.NumberFormat('cs-CZ', {
	minimumFractionDigits: 2,
	maximumFractionDigits: 4,
});

const getLocationDetails = (location: WeatherLocation) => [location.adminArea, location.country].filter(Boolean).join(', ');

const windSpeedOptions: {
	value: WindSpeedUnit;
	label: string;
	description: string;
}[] = [
	{ value: 'kmh', label: 'km/h', description: 'Kilometry za hodinu' },
	{ value: 'ms', label: 'm/s', description: 'Metry za sekundu' },
	{ value: 'kn', label: 'kn', description: 'Uzly' },
	{ value: 'mph', label: 'mph', description: 'Míle za hodinu' },
];

const WeatherSettings = ({
	isOpen,
	selectedLocation,
	temperatureUnit,
	windSpeedUnit,
	onClose,
	onSelectLocation,
	onSelectTemperatureUnit,
	onSelectWindSpeedUnit,
}: WeatherSettingsProps) => {
	const [query, setQuery] = useState('');
	const [suggestions, setSuggestions] = useState<WeatherLocation[]>([]);
	const [searchStatus, setSearchStatus] = useState<SearchStatus>('idle');
	const activeSearchController = useRef<AbortController | null>(null);
	const autocompleteTimer = useRef<number | null>(null);
	const searchInput = useRef<HTMLInputElement>(null);
	const skipNextAutocomplete = useRef(false);

	const chooseLocation = useCallback(
		(location: WeatherLocation) => {
			activeSearchController.current?.abort();
			activeSearchController.current = null;
			skipNextAutocomplete.current = true;
			setQuery(location.name);
			setSuggestions([]);
			setSearchStatus('found');
			onSelectLocation(location);
		},
		[onSelectLocation],
	);

	const runSearch = useCallback(
		async (searchTerm: string, selectFirstResult = false) => {
			activeSearchController.current?.abort();
			const controller = new AbortController();
			activeSearchController.current = controller;
			setSearchStatus('searching');

			try {
				const locations = await searchWeatherLocations(searchTerm, controller.signal);

				if (activeSearchController.current !== controller) {
					return;
				}

				activeSearchController.current = null;

				if (selectFirstResult && locations[0]) {
					chooseLocation(locations[0]);
					return;
				}

				setSuggestions(locations);
				setSearchStatus(locations.length > 0 ? 'idle' : 'not-found');
			} catch (error) {
				if (error instanceof DOMException && error.name === 'AbortError') {
					return;
				}

				if (activeSearchController.current === controller) {
					activeSearchController.current = null;
					setSuggestions([]);
					setSearchStatus('error');
				}
			}
		},
		[chooseLocation],
	);

	useEffect(() => {
		const searchTerm = query.trim();

		if (skipNextAutocomplete.current) {
			skipNextAutocomplete.current = false;
			return;
		}

		if (!isOpen || searchTerm.length < 2) {
			return;
		}

		autocompleteTimer.current = window.setTimeout(() => {
			autocompleteTimer.current = null;
			void runSearch(searchTerm);
		}, 300);

		return () => {
			if (autocompleteTimer.current !== null) {
				window.clearTimeout(autocompleteTimer.current);
				autocompleteTimer.current = null;
			}
			activeSearchController.current?.abort();
		};
	}, [isOpen, query, runSearch]);

	useEffect(
		() => () => {
			activeSearchController.current?.abort();
		},
		[],
	);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose();
			}
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, onClose]);

	if (!isOpen) {
		return null;
	}

	const isFahrenheit = temperatureUnit === 'fahrenheit';
	const selectedLocationDetails = getLocationDetails(selectedLocation);

	return (
		<div
			id="weather-settings"
			role="dialog"
			aria-labelledby="weather-settings-title"
			className="absolute top-[50%] left-1/2 z-30 mt-4 w-[min(92vw,34rem)] -translate-x-1/2 overflow-hidden rounded-2xl border border-white/20 bg-slate-950/85 text-left text-white shadow-2xl backdrop-blur-xl lg:top-full"
		>
			<header className="flex items-center justify-between border-b border-white/15 px-5 py-4">
				<h2 id="weather-settings-title" className="text-xl font-semibold">
					Nastavení počasí
				</h2>
				<button type="button" aria-label="Zavřít nastavení počasí" onClick={onClose} className="grid size-9 cursor-pointer place-items-center rounded-full opacity-70 transition hover:bg-white/10 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
					<img src={closeIcon} alt="" className="size-4" />
				</button>
			</header>

			<div className="max-h-[min(72vh,38rem)] space-y-5 overflow-y-auto p-5">
				<form
					onSubmit={event => {
						event.preventDefault();
						const searchTerm = query.trim();
						if (autocompleteTimer.current !== null) {
							window.clearTimeout(autocompleteTimer.current);
							autocompleteTimer.current = null;
						}

						if (searchTerm.length < 2) {
							setSuggestions([]);
							setSearchStatus('not-found');
							return;
						}

						void runSearch(searchTerm, true);
					}}
				>
					<label htmlFor="weather-location-search" className="mb-2 block text-sm font-medium text-white/80">
						Vyhledat místo
					</label>
					<div className="flex rounded-xl border border-white/25 bg-white/10 focus-within:border-white/70">
						<input
							ref={searchInput}
							id="weather-location-search"
							type="text"
							inputMode="search"
							enterKeyHint="search"
							autoFocus
							autoComplete="off"
							value={query}
							role="combobox"
							aria-autocomplete="list"
							aria-expanded={suggestions.length > 0}
							aria-controls="weather-location-suggestions"
							placeholder="Praha, New York, Sydney…"
							onChange={event => {
								activeSearchController.current?.abort();
								skipNextAutocomplete.current = false;
								setQuery(event.target.value);
								setSuggestions([]);
								setSearchStatus('idle');
							}}
							className="min-w-0 flex-1 bg-transparent px-4 py-3 text-base outline-none placeholder:text-white/45"
						/>
						{query && (
							<button
								type="button"
								aria-label="Vymazat hledání"
								onClick={() => {
									activeSearchController.current?.abort();
									activeSearchController.current = null;
									if (autocompleteTimer.current !== null) {
										window.clearTimeout(autocompleteTimer.current);
										autocompleteTimer.current = null;
									}
									skipNextAutocomplete.current = false;
									setQuery('');
									setSuggestions([]);
									setSearchStatus('idle');
									window.requestAnimationFrame(() => searchInput.current?.focus());
								}}
								className="grid w-10 shrink-0 cursor-pointer place-items-center opacity-60 transition hover:bg-white/10 hover:opacity-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white"
							>
								<img src={closeIcon} alt="" className="size-3" />
							</button>
						)}
						<button type="submit" aria-label="Vyhledat místo" className="grid w-12 shrink-0 cursor-pointer place-items-center rounded-r-xl opacity-70 transition hover:bg-white/10 hover:opacity-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white">
							<img src={searchIcon} alt="" className="size-5" />
						</button>
					</div>
				</form>

				{suggestions.length > 0 && (
					<ul id="weather-location-suggestions" role="listbox" aria-label="Nalezená místa" className="-mt-3 max-h-56 space-y-1 overflow-y-auto rounded-xl border border-white/15 bg-black/20 p-2">
						{suggestions.map(location => {
							const details = getLocationDetails(location);

							return (
								<li key={`${location.latitude}-${location.longitude}-${location.name}`}>
									<button type="button" role="option" aria-selected="false" onClick={() => chooseLocation(location)} className="w-full cursor-pointer rounded-lg px-3 py-2 text-left transition hover:bg-white/10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white">
										<span className="block font-semibold">{location.name}</span>
										{details && <span className="block text-sm text-white/65">{details}</span>}
									</button>
								</li>
							);
						})}
					</ul>
				)}

				{searchStatus !== 'idle' && (
					<p role="status" className={`-mt-3 text-sm ${searchStatus === 'found' ? 'text-emerald-300' : searchStatus === 'not-found' || searchStatus === 'error' ? 'text-rose-300' : 'text-white/65'}`}>
						{searchStatus === 'searching' && 'Vyhledávání…'}
						{searchStatus === 'found' && 'Místo bylo nalezeno.'}
						{searchStatus === 'not-found' && 'Místo nebylo nalezeno.'}
						{searchStatus === 'error' && 'Vyhledávání se nepodařilo. Zkuste to prosím znovu.'}
					</p>
				)}

				<section className="rounded-xl border border-white/15 bg-white/5 p-4" aria-labelledby="selected-weather-location">
					<p id="selected-weather-location" className="text-sm text-white/60">
						Aktuálně vybrané místo
					</p>
					<p className="mt-1 text-lg font-semibold">{selectedLocation.name}</p>
					{selectedLocationDetails && <p className="text-sm text-white/70">{selectedLocationDetails}</p>}
					<p className="mt-2 text-sm tabular-nums text-white/70">
						Zeměpisná šířka: {coordinateFormatter.format(selectedLocation.latitude)}° | Zeměpisná délka: {coordinateFormatter.format(selectedLocation.longitude)}°
					</p>
				</section>

				<div className="flex items-center justify-between gap-4 rounded-xl border border-white/15 bg-white/5 p-4">
					<div>
						<p className="font-semibold">Jednotka teploty</p>
						<p className="text-sm text-white/60">Celsius nebo Fahrenheit</p>
					</div>
					<div className="flex items-center gap-2 font-semibold">
						<span>°C</span>
						<button
							type="button"
							role="switch"
							aria-checked={isFahrenheit}
							aria-label="Používat stupně Fahrenheita"
							onClick={() => onSelectTemperatureUnit(isFahrenheit ? 'celsius' : 'fahrenheit')}
							className="relative h-8 w-14 cursor-pointer rounded-full border border-white/30 bg-white/20 p-1 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
						>
							<span className={`block size-6 rounded-full bg-white shadow transition-transform ${isFahrenheit ? 'translate-x-6' : 'translate-x-0'}`} />
						</button>
						<span>°F</span>
					</div>
				</div>

				<div
					role="radiogroup"
					aria-labelledby="wind-speed-unit-title"
					className="rounded-xl border border-white/15 bg-white/5 p-4"
				>
					<p id="wind-speed-unit-title" className="font-semibold">
						Jednotka rychlosti větru
					</p>
					<div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-2">
						{windSpeedOptions.map(({ value, label, description }) => {
							const isSelected = value === windSpeedUnit;

							return (
								<label
									key={value}
									className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition ${isSelected ? 'border-white/60 bg-white/10' : 'border-white/15 hover:bg-white/5'}`}
								>
									<input
										type="radio"
										name="wind-speed-unit"
										value={value}
										checked={isSelected}
										onChange={() => onSelectWindSpeedUnit(value)}
										className="size-4 shrink-0 cursor-pointer accent-white"
									/>
									<span>
										<span className="block font-semibold">{label}</span>
										<span className="block text-sm text-white/60">{description}</span>
									</span>
								</label>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default WeatherSettings;
