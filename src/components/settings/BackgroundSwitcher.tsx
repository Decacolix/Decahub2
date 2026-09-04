import { backgroundOptions, type BackgroundId } from '../../config/backgrounds';

type BackgroundSwitcherProps = {
	selectedBackgroundId: BackgroundId;
	onSelect: (backgroundId: BackgroundId) => void;
};

const BackgroundSwitcher = ({
	selectedBackgroundId,
	onSelect,
}: BackgroundSwitcherProps) => (
	<nav
		aria-label="Background color"
		className="absolute top-4 left-4 z-10 flex items-center gap-2 lg:top-6 lg:right-6 lg:left-auto lg:flex-col"
	>
		{backgroundOptions.map(({ id, icon, label }) => {
			const isSelected = id === selectedBackgroundId;

			return (
				<button
					key={id}
					type="button"
					aria-label={`Use ${label.toLowerCase()} background`}
					aria-pressed={isSelected}
					title={`${label} background`}
					onClick={() => onSelect(id)}
					className={`grid size-8 cursor-pointer place-items-center rounded-full border-2 transition duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
						isSelected
							? 'border-white bg-white/15 shadow-lg'
							: 'border-transparent bg-black/10 hover:border-white/60 hover:bg-white/10'
					}`}
				>
					<img src={icon} alt="" className="size-5" />
				</button>
			);
		})}
	</nav>
);

export default BackgroundSwitcher;
