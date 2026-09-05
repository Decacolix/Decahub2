import { useCallback, useState } from 'react';

/** Setter returned by {@link usePersistentPreference}. */
export type SelectPreference<Value> = (nextValue: Value) => void;

/**
 * Keeps one preference in React state and mirrors changes to persistent storage.
 * The supplied reader is used lazily, so local storage is read only on first render.
 */
export const usePersistentPreference = <Value>(
	readPreference: () => Value,
	writePreference: (value: Value) => void,
): readonly [Value, SelectPreference<Value>] => {
	const [value, setValue] = useState<Value>(readPreference);

	const selectValue = useCallback(
		(nextValue: Value): void => {
			setValue(nextValue);
			writePreference(nextValue);
		},
		[writePreference],
	);

	return [value, selectValue];
};
