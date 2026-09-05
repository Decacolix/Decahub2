import type { ReactElement } from 'react';
import settingsIcon from '../../assets/icons/settings/settings-icon.svg';

/** Inputs required by a panel's settings trigger. */
type PanelSettingsButtonProps = {
	controls: string;
	id: string;
	isOpen: boolean;
	label: string;
	onToggle: () => void;
};

/** Renders the shared hover/focus treatment for panel settings buttons. */
const PanelSettingsButton = ({
	controls,
	id,
	isOpen,
	label,
	onToggle,
}: PanelSettingsButtonProps): ReactElement => (
	<button
		id={id}
		type="button"
		aria-label={label}
		aria-expanded={isOpen}
		aria-controls={controls}
		onClick={onToggle}
		className={`absolute -top-4 right-0 z-10 grid size-6 cursor-pointer place-items-center rounded-full transition-all duration-150 hover:opacity-100! focus-visible:opacity-100! focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
			isOpen
				? 'bg-white/10 opacity-100'
				: 'opacity-50 lg:opacity-0 lg:group-hover:opacity-60'
		}`}
	>
		<img src={settingsIcon} alt="" className="size-6" />
	</button>
);

export default PanelSettingsButton;
