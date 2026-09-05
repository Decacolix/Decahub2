import { useEffect, useRef, useState } from 'react';
import { fetchCurrentTime } from '../services/timeApi';

/** Server/client timestamps used to keep the clock ticking between API syncs. */
type TimeAnchor = {
	serverTime: number;
	clientTime: number;
};

/** Clock UI update frequency. */
const tickInterval: number = 1_000;

/** TimeAPI resynchronization frequency. */
const syncInterval: number = 60_000;

/**
 * Maintains a ticking clock, anchored to TimeAPI when a named timezone is used.
 * Local client time remains available as a fallback when synchronization fails.
 */
export const useTimeApiClock = (timeZone: string | null): Date => {
	const anchor = useRef<TimeAnchor | null>(null);
	const [currentTime, setCurrentTime] = useState<Date>(() => new Date());

	useEffect(() => {
		const controller: AbortController = new AbortController();
		const initialTime: number = Date.now();

		anchor.current = {
			serverTime: initialTime,
			clientTime: initialTime,
		};

		const updateClock = (): void => {
			if (!anchor.current) {
				return;
			}

			const elapsedTime: number = Date.now() - anchor.current.clientTime;
			setCurrentTime(new Date(anchor.current.serverTime + elapsedTime));
		};

		const synchronizeClock = async (): Promise<void> => {
			if (!timeZone) {
				return;
			}

			const requestStartedAt: number = Date.now();

			try {
				const serverTime: number = await fetchCurrentTime(
					timeZone,
					controller.signal,
				);
				const requestFinishedAt: number = Date.now();
				const estimatedNetworkDelay: number =
					(requestFinishedAt - requestStartedAt) / 2;

				anchor.current = {
					serverTime: serverTime + estimatedNetworkDelay,
					clientTime: requestFinishedAt,
				};

				updateClock();
			} catch (error) {
				if (error instanceof DOMException && error.name === 'AbortError') {
					return;
				}
			}
		};

		const tickTimer: number = window.setInterval(updateClock, tickInterval);
		let syncTimer: number | undefined;

		if (timeZone) {
			void synchronizeClock();
			syncTimer = window.setInterval(
				() => void synchronizeClock(),
				syncInterval,
			);
		}

		return () => {
			controller.abort();
			window.clearInterval(tickTimer);

			if (syncTimer !== undefined) {
				window.clearInterval(syncTimer);
			}
		};
	}, [timeZone]);

	return currentTime;
};
