import { useCallback, useEffect, type ReactElement, type ReactNode } from 'react';
import closeIcon from '../../assets/icons/settings/close-icon.svg';

/** Properties shared by every dashboard settings dialog. */
type SettingsDialogProps = {
	bodyClassName: string;
	children: ReactNode;
	closeButtonAutoFocus?: boolean;
	closeLabel: string;
	id: string;
	isOpen: boolean;
	onClose: () => void;
	returnFocusId: string;
	title: string;
};

/**
 * Provides the common responsive shell and keyboard behavior for settings.
 * Dialogs are viewport-fixed on mobile and anchored below the clock on desktop.
 */
const SettingsDialog = ({ bodyClassName, children, closeButtonAutoFocus = true, closeLabel, id, isOpen, onClose, returnFocusId, title }: SettingsDialogProps): ReactElement | null => {
	const closeDialog = useCallback((): void => {
		onClose();
		window.requestAnimationFrame(() => document.getElementById(returnFocusId)?.focus());
	}, [onClose, returnFocusId]);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const handleKeyDown = (event: KeyboardEvent): void => {
			if (event.key === 'Escape') {
				closeDialog();
			}
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [closeDialog, isOpen]);

	if (!isOpen) {
		return null;
	}

	const titleId: string = `${id}-title`;

	return (
		<div
			id={id}
			role="dialog"
			aria-labelledby={titleId}
			className="fixed top-1/2 left-1/2 z-30 w-[min(92vw,34rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-white/20 bg-slate-950/85 text-left text-white shadow-2xl backdrop-blur-xl lg:absolute lg:top-full lg:mt-4 lg:translate-y-0"
		>
			<header className="flex items-center justify-between border-b border-white/15 px-5 py-4">
				<h2 id={titleId} className="text-xl font-semibold">
					{title}
				</h2>
				<button
					type="button"
					autoFocus={closeButtonAutoFocus}
					aria-label={closeLabel}
					onClick={closeDialog}
					className="grid size-9 cursor-pointer place-items-center rounded-full opacity-70 transition hover:bg-white/10 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
				>
					<img src={closeIcon} alt="" className="size-4" />
				</button>
			</header>

			<div className={bodyClassName}>{children}</div>
		</div>
	);
};

export default SettingsDialog;
