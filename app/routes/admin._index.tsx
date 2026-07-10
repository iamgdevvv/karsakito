import { SimpleGrid, Text, ThemeIcon } from '@mantine/core';
import { FaUsersCog } from 'react-icons/fa';
import { TbApiApp } from 'react-icons/tb';
import { redirect } from 'react-router';
import { metaPublicRoute } from '~app-modules/meta';
import { authUserCtx } from '~app-server/context';
import { authMiddlewareSession } from '~app-server/session';
import { Link } from '~app-ui/components/link';
import Footer from '~app-ui/layouts/footer';
import { HeaderAdmin } from '~app-ui/layouts/header';
import { AdminPanel } from '~app-ui/layouts/panel';

import type { Route } from './+types/admin._index';

const authMiddleware: Route.MiddlewareFunction = async ({ request, context }) => {
	const authSession = await authMiddlewareSession({
		guard: {
			role: ['ADMIN'],
		},
		request,
	});

	if ('error' in authSession) {
		if (authSession.cause === 'user_not_authorized_role') {
			throw redirect('/');
		}

		throw redirect('/login?redirect=/admin');
	}

	context.set(authUserCtx, authSession.user);
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
		title: 'Admin KarsaKito',
		noIndex: true,
	});
}

export default function AdminRoute({ loaderData }: Route.ComponentProps) {
	return (
		<div className="site">
			<HeaderAdmin authUser={loaderData.user} />
			<AdminPanel
				authUser={loaderData.user}
				className="site-main"
			>
				<SimpleGrid
					cols={{
						base: 2,
						md: 3,
					}}
				>
					<Link
						to="/admin/apps"
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
							Manage Apps
						</Text>
						<ThemeIcon
							variant="transparent"
							pos="absolute"
							bottom={0}
							right={16}
							p={0}
							radius={0}
							size="auto"
							className="z-1 translate-2 opacity-40 transition group-hover:translate-0 group-hover:opacity-100"
						>
							<TbApiApp size={100} />
						</ThemeIcon>
					</Link>
					<Link
						to="/admin/users"
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
							Manage Users
						</Text>
						<ThemeIcon
							variant="transparent"
							pos="absolute"
							bottom={0}
							right={16}
							p={0}
							radius={0}
							size="auto"
							className="z-1 translate-2 opacity-40 transition group-hover:translate-0 group-hover:opacity-100"
						>
							<FaUsersCog size={100} />
						</ThemeIcon>
					</Link>
				</SimpleGrid>
			</AdminPanel>
			<Footer />
		</div>
	);
}
