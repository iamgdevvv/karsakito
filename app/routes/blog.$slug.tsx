import { Badge, Box, Container, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { LuArrowLeft, LuFileQuestion } from 'react-icons/lu';
import { metaPublicRoute } from '~app-modules/meta';
import { authGetSession } from '~app-server/session';
import { ButtonLink } from '~app-ui/components/link';
import Footer from '~app-ui/layouts/footer';
import { Header } from '~app-ui/layouts/header';

import type { Route } from './+types/blog.$slug';

export async function loader({ request }: Route.LoaderArgs) {
	const authSession = await authGetSession(request);

	return { user: authSession.get('user') };
}

export function meta() {
	return metaPublicRoute({
		title: 'Artikel Belum Tersedia | KarsaKito',
		description: 'Artikel KarsaKito yang Anda buka belum tersedia.',
		noIndex: true,
	});
}

export default function DetailBlogRoute({ loaderData }: Route.ComponentProps) {
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
								<LuFileQuestion size={26} />
							</ThemeIcon>
							<Badge variant="light">Artikel KarsaKito</Badge>
							<Title order={1}>Artikel belum tersedia</Title>
							<Text c="gray.6">
								Halaman artikel yang Anda buka belum dapat ditampilkan. Kembali ke
								daftar artikel untuk melihat pembaruan berikutnya.
							</Text>
							<ButtonLink
								to="/blog"
								leftSection={<LuArrowLeft size={18} />}
							>
								Kembali ke Artikel
							</ButtonLink>
						</Stack>
					</Container>
				</Box>
			</main>
			<Footer />
		</div>
	);
}
