import type { ReactElement } from 'react';

/** Inputs required by a two-value settings switch. */
type BinarySwitchProps = {
	ariaLabel: string;
	isRightSelected: boolean;
	leftLabel: string;
	onToggle: () => void;
	rightLabel: string;
};

/** Renders two labels around the shared dashboard switch control. */
const BinarySwitch = ({
	ariaLabel,
	isRightSelected,
	leftLabel,
	onToggle,
	rightLabel,
}: BinarySwitchProps): ReactElement => (
	<div className="flex items-center gap-2 font-semibold">
		<span>{leftLabel}</span>
		<button
			type="button"
			role="switch"
			aria-checked={isRightSelected}
			aria-label={ariaLabel}
			onClick={onToggle}
			className="relative h-8 w-14 cursor-pointer rounded-full border border-white/30 bg-white/20 p-1 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
		>
			<span
				className={`block size-6 rounded-full bg-white shadow transition-transform ${isRightSelected ? 'translate-x-6' : 'translate-x-0'}`}
			/>
		</button>
		<span>{rightLabel}</span>
	</div>
);

export default BinarySwitch;
