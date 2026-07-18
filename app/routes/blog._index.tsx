import { Badge, Box, Container, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { LuBookOpen } from 'react-icons/lu';
import { metaPublicRoute } from '~app-modules/meta';
import { authGetSession } from '~app-server/session';
import { ButtonLink } from '~app-ui/components/link';
import Footer from '~app-ui/layouts/footer';
import { Header } from '~app-ui/layouts/header';

import type { Route } from './+types/blog._index';

export async function loader({ request }: Route.LoaderArgs) {
	const authSession = await authGetSession(request);

	return { user: authSession.get('user') };
}

export function meta() {
	return metaPublicRoute({
		title: 'Artikel KarsaKito',
		description: 'Artikel dan panduan KarsaKito sedang disiapkan.',
		noIndex: true,
	});
}

export default function BlogRoute({ loaderData }: Route.ComponentProps) {
	return (
		<div className="site">
			<Header authUser={loaderData.user} />
			<main className="site-main">
				<Box
					component="section"
					bg="gray.0"
					py={{
						base: 48,
						sm: 60,
						lg: 80,
					}}
				>
					<Container size="sm">
						<Stack
							align="center"
							gap="md"
							ta="center"
						>
							<ThemeIcon
								size={56}
								radius="xl"
								variant="light"
							>
								<LuBookOpen size={26} />
							</ThemeIcon>
							<Badge variant="light">Artikel KarsaKito</Badge>
							<Title order={1}>Artikel sedang disiapkan</Title>
							<Text c="gray.6">
								Kami sedang menyiapkan artikel dan panduan untuk membantu Anda
								menggunakan KarsaKito dengan lebih terarah.
							</Text>
							<ButtonLink to="/layanan">Jelajahi Layanan</ButtonLink>
						</Stack>
					</Container>
				</Box>
			</main>
			<Footer />
		</div>
	);
}
