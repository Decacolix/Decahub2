import type { ReactNode } from 'react';

type DashboardLayoutProps = {
	backgroundImage: string;
	children: ReactNode;
};

const DashboardLayout = ({ backgroundImage, children }: DashboardLayoutProps) => (
	<div className="relative min-h-screen w-full overflow-x-hidden bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${backgroundImage})` }}>
		{children}
	</div>
);

export default DashboardLayout;
