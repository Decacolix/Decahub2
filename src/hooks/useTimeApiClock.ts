import { useEffect, useRef, useState } from 'react';
import { fetchCurrentTime } from '../services/timeApi';

type TimeAnchor = {
	serverTime: number;
	clientTime: number;
};

const tickInterval = 1_000;
const syncInterval = 60_000;

export const useTimeApiClock = (timeZone: string | null) => {
	const anchor = useRef<TimeAnchor | null>(null);
	const [currentTime, setCurrentTime] = useState(() => new Date());

	useEffect(() => {
		const controller = new AbortController();
		const initialTime = Date.now();

		anchor.current = {
			serverTime: initialTime,
			clientTime: initialTime,
		};

		const updateClock = () => {
			if (!anchor.current) {
				return;
			}

			const elapsedTime = Date.now() - anchor.current.clientTime;
			setCurrentTime(new Date(anchor.current.serverTime + elapsedTime));
		};

		const synchronizeClock = async () => {
			if (!timeZone) {
				return;
			}

			const requestStartedAt = Date.now();

			try {
				const serverTime = await fetchCurrentTime(timeZone, controller.signal);
				const requestFinishedAt = Date.now();
				const estimatedNetworkDelay =
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

		const tickTimer = window.setInterval(updateClock, tickInterval);
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
