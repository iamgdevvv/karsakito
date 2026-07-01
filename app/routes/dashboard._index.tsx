import { SimpleGrid, Text, ThemeIcon, Title } from '@mantine/core';
import { PiCoinsFill, PiHandCoinsFill } from 'react-icons/pi';
import { redirect } from 'react-router';
import { metaPublicRoute } from '~app-modules/meta';
import { authUserCtx } from '~app-server/context';
import { authGetSession } from '~app-server/session';
import { Link } from '~app-ui/components/link';
import Footer from '~app-ui/layouts/footer';
import { HeaderDashboard } from '~app-ui/layouts/header';
import { DashboardPanel } from '~app-ui/layouts/panel';

import type { Route } from './+types/dashboard._index';

const authMiddleware: Route.MiddlewareFunction = async ({ request, context }) => {
	const authSession = await authGetSession(request);
	const user = authSession.get('user');

	if (!user) {
		const sourceUrl = new URL(request.url);

		throw redirect(`/login?redirect=${sourceUrl.pathname}${sourceUrl.search}`);
	}

	context.set(authUserCtx, user);
};

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
	const user = context.get(authUserCtx)!;

	return {
		user,
	};
}

export function meta(_: Route.MetaArgs) {
	return metaPublicRoute({
		title: 'Dashboard KarsaKito',
		noIndex: true,
	});
}

export default function DashboardRoute({ loaderData }: Route.ComponentProps) {
	return (
		<div className="site">
			<HeaderDashboard authUser={loaderData.user} />
			<DashboardPanel className="site-main">
				<Title mb="lg">Quick Actions</Title>
				<SimpleGrid
					cols={{
						base: 2,
						md: 3,
					}}
				>
					<Link
						to="/dashboard/usage"
						pos="relative"
						bd="1px solid gray.2"
						bdrs="lg"
						bg="primary.0"
						mih={120}
						px={{
							base: 'sm',
							sm: 'md',
							lg: 'lg',
						}}
						py={{
							base: 'sm',
							md: 'md',
						}}
						className="group"
					>
						<Text
							pos="relative"
							span
							fw={500}
							fz={{
								base: 'sm',
								md: 'md',
							}}
							className="z-2"
						>
							Penggunaan Token
						</Text>
						<ThemeIcon
							variant="transparent"
							pos="absolute"
							bottom={0}
							right={8}
							p={0}
							radius={0}
							size="auto"
							className="z-1 translate-2 opacity-40 transition group-hover:translate-0 group-hover:opacity-100"
						>
							<PiCoinsFill size={100} />
						</ThemeIcon>
					</Link>
					<Link
						to="/dashboard/topup"
						pos="relative"
						bd="1px solid gray.2"
						bdrs="lg"
						bg="primary.0"
						mih={120}
						px={{
							base: 'sm',
							sm: 'md',
							lg: 'lg',
						}}
						py={{
							base: 'sm',
							md: 'md',
						}}
						className="group"
					>
						<Text
							pos="relative"
							span
							fw={500}
							fz={{
								base: 'sm',
								md: 'md',
							}}
							className="z-2"
						>
							Topup Token
						</Text>
						<ThemeIcon
							variant="transparent"
							pos="absolute"
							bottom={0}
							right={8}
							p={0}
							radius={0}
							size="auto"
							className="z-1 translate-2 opacity-40 transition group-hover:translate-0 group-hover:opacity-100"
						>
							<PiHandCoinsFill size={100} />
						</ThemeIcon>
					</Link>
				</SimpleGrid>
			</DashboardPanel>
			<Footer />
		</div>
	);
}
