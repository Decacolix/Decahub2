import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	type ReactElement,
} from 'react';
import closeIcon from '../../assets/icons/settings/close-icon.svg';
import searchIcon from '../../assets/icons/settings/search-icon.svg';
import { languageLocales, type Language } from '../../config/languages';
import { translations } from '../../config/translations';
import type {
	TemperatureUnit,
	WeatherLocation,
	WindSpeedUnit,
} from '../../config/weather';
import { searchWeatherLocations } from '../../services/weatherLocationApi';
import BinarySwitch from '../settings/BinarySwitch';
import SettingsDialog from '../settings/SettingsDialog';

/** Inputs and preference callbacks required by the weather dialog. */
type WeatherSettingsProps = {
	isOpen: boolean;
	language: Language;
	selectedLocation: WeatherLocation;
	temperatureUnit: TemperatureUnit;
	windSpeedUnit: WindSpeedUnit;
	onClose: () => void;
	onSelectLocation: (location: WeatherLocation) => void;
	onSelectTemperatureUnit: (temperatureUnit: TemperatureUnit) => void;
	onSelectWindSpeedUnit: (windSpeedUnit: WindSpeedUnit) => void;
};

/** User-visible state of the location search. */
type SearchStatus = 'idle' | 'searching' | 'found' | 'not-found' | 'error';

/** Label and API value for a selectable wind-speed unit. */
type WindSpeedOption = {
	label: string;
	value: WindSpeedUnit;
};

/** Builds the optional administrative-area and country label. */
const getLocationDetails = (location: WeatherLocation): string =>
	[location.adminArea, location.country].filter(Boolean).join(', ');

/** Wind-speed choices supported by the weather API. */
const windSpeedOptions: readonly WindSpeedOption[] = [
	{ value: 'kmh', label: 'km/h' },
	{ value: 'ms', label: 'm/s' },
	{ value: 'kn', label: 'kn' },
	{ value: 'mph', label: 'mph' },
];

/** Provides location search and weather-unit preferences. */
const WeatherSettings = ({
	isOpen,
	language,
	selectedLocation,
	temperatureUnit,
	windSpeedUnit,
	onClose,
	onSelectLocation,
	onSelectTemperatureUnit,
	onSelectWindSpeedUnit,
}: WeatherSettingsProps): ReactElement => {
	const [query, setQuery] = useState('');
	const [suggestions, setSuggestions] = useState<WeatherLocation[]>([]);
	const [searchStatus, setSearchStatus] = useState<SearchStatus>('idle');
	const activeSearchController = useRef<AbortController | null>(null);
	const autocompleteTimer = useRef<number | null>(null);
	const searchInput = useRef<HTMLInputElement>(null);
	const skipNextAutocomplete = useRef<boolean>(false);
	const text = translations[language].weatherSettings;
	const coordinateFormatter = useMemo<Intl.NumberFormat>(
		() =>
			new Intl.NumberFormat(languageLocales[language], {
				minimumFractionDigits: 2,
				maximumFractionDigits: 4,
			}),
		[language],
	);
	const cancelPendingSearch = useCallback((): void => {
		activeSearchController.current?.abort();
		activeSearchController.current = null;

		if (autocompleteTimer.current !== null) {
			window.clearTimeout(autocompleteTimer.current);
			autocompleteTimer.current = null;
		}
	}, []);

	const chooseLocation = useCallback(
		(location: WeatherLocation): void => {
			cancelPendingSearch();
			skipNextAutocomplete.current = true;
			setQuery(location.name);
			setSuggestions([]);
			setSearchStatus('found');
			onSelectLocation(location);
		},
		[cancelPendingSearch, onSelectLocation],
	);

	const runSearch = useCallback(
		async (
			searchTerm: string,
			selectFirstResult = false,
		): Promise<void> => {
			cancelPendingSearch();
			const controller: AbortController = new AbortController();
			activeSearchController.current = controller;
			setSearchStatus('searching');

			try {
				const locations: WeatherLocation[] = await searchWeatherLocations(
					searchTerm,
					language,
					controller.signal,
				);

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
		[cancelPendingSearch, chooseLocation, language],
	);

	useEffect(() => {
		const searchTerm: string = query.trim();

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
			cancelPendingSearch();
		};
	}, [cancelPendingSearch, isOpen, query, runSearch]);

	const isFahrenheit: boolean = temperatureUnit === 'fahrenheit';
	const selectedLocationDetails: string = getLocationDetails(selectedLocation);

	return (
		<SettingsDialog
			bodyClassName="max-h-[min(72vh,38rem)] space-y-5 overflow-y-auto p-5"
			closeButtonAutoFocus={false}
			closeLabel={text.close}
			id="weather-settings"
			isOpen={isOpen}
			onClose={onClose}
			returnFocusId="weather-settings-button"
			title={text.title}
		>
				<form
					onSubmit={event => {
						event.preventDefault();
						const searchTerm: string = query.trim();
						if (searchTerm.length < 2) {
							setSuggestions([]);
							setSearchStatus('not-found');
							return;
						}

						void runSearch(searchTerm, true);
					}}
				>
					<label htmlFor="weather-location-search" className="mb-2 block text-sm font-medium text-white/80">
						{text.searchLocation}
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
							placeholder={text.placeholder}
							onChange={event => {
								cancelPendingSearch();
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
								aria-label={text.clearSearch}
								onClick={() => {
									cancelPendingSearch();
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
						<button type="submit" aria-label={text.search} className="grid w-12 shrink-0 cursor-pointer place-items-center rounded-r-xl opacity-70 transition hover:bg-white/10 hover:opacity-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white">
							<img src={searchIcon} alt="" className="size-5" />
						</button>
					</div>
				</form>

				{suggestions.length > 0 && (
					<ul id="weather-location-suggestions" role="listbox" aria-label={text.results} className="-mt-3 max-h-56 space-y-1 overflow-y-auto rounded-xl border border-white/15 bg-black/20 p-2">
						{suggestions.map(location => {
							const details: string = getLocationDetails(location);

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
						{searchStatus === 'searching' && text.searching}
						{searchStatus === 'found' && text.found}
						{searchStatus === 'not-found' && text.notFound}
						{searchStatus === 'error' && text.searchError}
					</p>
				)}

				<section className="rounded-xl border border-white/15 bg-white/5 p-4" aria-labelledby="selected-weather-location">
					<p id="selected-weather-location" className="text-sm text-white/60">
						{text.selectedLocation}
					</p>
					<p className="mt-1 text-lg font-semibold">{selectedLocation.name}</p>
					{selectedLocationDetails && <p className="text-sm text-white/70">{selectedLocationDetails}</p>}
					<p className="mt-2 text-sm tabular-nums text-white/70">
						{text.latitude}: {coordinateFormatter.format(selectedLocation.latitude)}° | {text.longitude}: {coordinateFormatter.format(selectedLocation.longitude)}°
					</p>
				</section>

				<div className="flex items-center justify-between gap-4 rounded-xl border border-white/15 bg-white/5 p-4">
					<div>
						<p className="font-semibold">{text.temperatureUnit}</p>
						<p className="text-sm text-white/60">{text.temperatureUnitDescription}</p>
					</div>
					<BinarySwitch
						ariaLabel={text.fahrenheit}
						isRightSelected={isFahrenheit}
						leftLabel="°C"
						onToggle={() =>
							onSelectTemperatureUnit(
								isFahrenheit ? 'celsius' : 'fahrenheit',
							)
						}
						rightLabel="°F"
					/>
				</div>

				<div
					role="radiogroup"
					aria-labelledby="wind-speed-unit-title"
					className="rounded-xl border border-white/15 bg-white/5 p-4"
				>
					<p id="wind-speed-unit-title" className="font-semibold">
						{text.windSpeedUnit}
					</p>
					<div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-2">
						{windSpeedOptions.map(({ value, label }) => {
							const isSelected: boolean = value === windSpeedUnit;

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
										<span className="block text-sm text-white/60">{text.windUnits[value]}</span>
									</span>
								</label>
							);
						})}
					</div>
				</div>
		</SettingsDialog>
	);
};

export default WeatherSettings;
