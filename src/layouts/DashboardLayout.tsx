import type { ReactElement, ReactNode } from 'react';

/** Inputs required by the page-level dashboard layout. */
type DashboardLayoutProps = {
	backgroundImage: string;
	children: ReactNode;
};

/** Applies the selected full-page background around dashboard content. */
const DashboardLayout = ({ backgroundImage, children }: DashboardLayoutProps): ReactElement => (
	<div className="relative min-h-screen w-full overflow-x-hidden bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${backgroundImage})` }}>
		{children}
	</div>
);

export default DashboardLayout;
