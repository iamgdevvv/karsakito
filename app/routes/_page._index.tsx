import { Text, Title } from '@mantine/core';
import { LuArrowRight } from 'react-icons/lu';
import { metaPublicRoute } from '~app-modules/meta';
import Banner from '~app-ui/layouts/banner';
import { cloudflareContext } from '~workers/app';

import type { Route } from './+types/_page._index';

export function loader({ context }: Route.LoaderArgs) {
	return {
		noIndex: context.get(cloudflareContext).env.NODE_ENV !== 'production',
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

export default function HomeRoute(_: Route.ComponentProps) {
	return (
		<>
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
					Platform AI untuk Mengakselerasi Pemanfaatan Bahasa dan Warisan Budaya Daerah
				</Title>
				<Text>
					KarsaKito menghadirkan ekosistem AI yang mengintegrasikan pembelajaran bahasa
					daerah, pembuatan karya, penerjemahan, parafrase, analisis penggunaan bahasa,
					serta ensiklopedia budaya dalam satu platform.
				</Text>
			</Banner>
		</>
	);
}
