import { Outlet } from 'react-router';
import Footer from '~app-ui/layouts/footer';
import Header from '~app-ui/layouts/header';

export default function Page() {
	return (
		<div className="site">
			<Header />
			<main className="site-main">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
}
