import { Badge, Box, Container, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { LuArrowLeft, LuCircleAlert } from 'react-icons/lu';
import { metaPublicRoute } from '~app-modules/meta';
import { authGetSession } from '~app-server/session';
import { ButtonLink } from '~app-ui/components/link';
import Footer from '~app-ui/layouts/footer';
import { Header } from '~app-ui/layouts/header';

import type { Route } from './+types/layanan.$fitur';

export async function loader({ request }: Route.LoaderArgs) {
	const authSession = await authGetSession(request);

	return { user: authSession.get('user') };
}

export function meta() {
	return metaPublicRoute({
		title: 'Detail Layanan Belum Tersedia | KarsaKito',
		description: 'Halaman detail layanan KarsaKito belum tersedia.',
		noIndex: true,
	});
}

export default function DetailLayananRoute({ loaderData }: Route.ComponentProps) {
	return (
		<div className="site">
			<Header authUser={loaderData.user} />
			<main
				id="main-content"
				tabIndex={-1}
				className="site-main"
			>
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
								<LuCircleAlert size={26} />
							</ThemeIcon>
							<Badge variant="light">Detail layanan</Badge>
							<Title order={1}>Detail layanan belum tersedia</Title>
							<Text c="gray.6">
								Halaman ini belum memiliki informasi yang dapat ditampilkan.
								Kunjungi daftar layanan untuk melihat tool KarsaKito.
							</Text>
							<ButtonLink
								to="/layanan"
								leftSection={<LuArrowLeft size={18} />}
							>
								Kembali ke Layanan
							</ButtonLink>
						</Stack>
					</Container>
				</Box>
			</main>
			<Footer />
		</div>
	);
}
