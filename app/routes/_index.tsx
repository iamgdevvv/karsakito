import { Text, Title } from '@mantine/core';
import { LuArrowRight } from 'react-icons/lu';
import { metaPublicRoute } from '~app-modules/meta';
import { cfContext } from '~app-server/context';
import { authGetSession } from '~app-server/session';
import Banner from '~app-ui/layouts/banner';
import Footer from '~app-ui/layouts/footer';
import { Header } from '~app-ui/layouts/header';

import type { Route } from './+types/_index';

export async function loader({ request, context }: Route.LoaderArgs) {
	const authSession = await authGetSession(request);
	const user = authSession.get('user');

	return {
		user,
		noIndex: cfContext(context).env.NODE_ENV !== 'production',
	};
}

export function meta({ loaderData }: Route.MetaArgs) {
	return metaPublicRoute({
		title: 'KarsaKito',
		description:
			'Platform AI untuk Mengakselerasi Pemanfaatan Bahasa dan Warisan Budaya Daerah',
		noIndex: loaderData.noIndex,
	});
}

export default function HomeRoute({ loaderData }: Route.ComponentProps) {
	return (
		<div className="site">
			<Header authUser={loaderData.user} />
			<main className="site-main">
				<Banner
					background="/images/karsakito-beranda-banner.jpg"
					ctas={[
						{
							label: 'Pelajari Selengkapnya',
							to: '/tentang',
							variant: 'light',
						},
						{
							label: 'Lihat Layanan',
							to: '/layanan',
							rightSection: <LuArrowRight size={20} />,
						},
					]}
				>
					<Text
						span
						size="xs"
						fw={700}
						c="primary"
						tt="uppercase"
					>
						KarsaKito
					</Text>
					<Title>
						Platform AI untuk Mengakselerasi Pemanfaatan Bahasa dan Warisan Budaya
						Daerah
					</Title>
					<Text>
						KarsaKito menghadirkan ekosistem AI yang mengintegrasikan pembelajaran
						bahasa daerah, pembuatan karya, penerjemahan, parafrase, analisis penggunaan
						bahasa, serta ensiklopedia budaya dalam satu platform.
					</Text>
				</Banner>
			</main>
			<Footer />
		</div>
	);
}
