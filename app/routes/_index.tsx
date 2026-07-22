import { Accordion, Badge, Box, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { LuArrowUpRight } from 'react-icons/lu';
import { PiCoinsFill } from 'react-icons/pi';
import { labelAppCategory } from '~app-modules/enum-options';
import { getPublicFaqs } from '~app-modules/faqs';
import { metaPublicRoute } from '~app-modules/meta';
import type { KarsaAppPlain } from '~app-modules/schema/app';
import {
	isCanonicalSiteRequest,
	organizationSchema,
	pageSchema,
	seoSchema,
	websiteSchema,
} from '~app-modules/seo';
import { actionGetKarsaAppsByCategory } from '~app-server/app';
import { authGetSession } from '~app-server/session';
import { Image } from '~app-ui/components/image';
import { ButtonLink, Link } from '~app-ui/components/link';
import VideoIframe from '~app-ui/components/video';
import AppPanel from '~app-ui/layouts/apps-panel';

import type { Route } from './+types/_index';

const pageTitle = 'KarsaKito | Produktivitas AI Bahasa Nusantara';
const pageDescription =
	'KarsaKito membantu Anda membuat, menyempurnakan, menerjemahkan, dan mengolah teks berbasis Bahasa Nusantara melalui alur kerja terstruktur.';

export async function loader({ request, context }: Route.LoaderArgs) {
	const authSession = await authGetSession(request);
	const user = authSession.get('user');
	const optionApps = await actionGetKarsaAppsByCategory({ context });

	return {
		optionApps,
		user,
		noIndex: !isCanonicalSiteRequest(request),
	};
}

export function meta({ loaderData }: Route.MetaArgs) {
	return metaPublicRoute({
		title: pageTitle,
		description: pageDescription,
		noIndex: loaderData.noIndex,
		canonicalPath: '/',
		structuredData: seoSchema(
			organizationSchema(),
			websiteSchema(),
			pageSchema({
				name: pageTitle,
				description: pageDescription,
				path: '/',
			}),
		),
	});
}

const faqs = getPublicFaqs(['tentang', 'layanan', 'token'], {
	featuredOnly: true,
});

export default function AppsRoute({ loaderData }: Route.ComponentProps) {
	return (
		<div className="site">
			<AppPanel className="site-main">
				<Group justify="center">
					<Stack
						w="100%"
						maw={560}
						gap="sm"
						align="center"
						justify="center"
						ta="center"
					>
						<Image
							src="/network.svg"
							w={{
								base: 72,
								sm: 86,
								lg: 100,
							}}
							h="auto"
						/>
						<Title
							fz={{
								base: 'xl',
								lg: 32,
							}}
						>
							Ekosistem Produktivitas AI untuk Bahasa Nusantara
						</Title>
						<Text
							c="gray.6"
							fz={{
								base: 'sm',
								lg: 'md',
							}}
						>
							Pilih tool dan isi kebutuhan Anda untuk memulai pekerjaan berbasis
							bahasa dengan lebih terarah.
						</Text>
						<Group
							gap="xs"
							mt={4}
						>
							<ButtonLink
								to="/workspace"
								size="md"
								radius="full"
								rightSection={<LuArrowUpRight size={18} />}
							>
								<Text
									hiddenFrom="lg"
									span
									inherit
								>
									Mulai
								</Text>
								<Text
									visibleFrom="lg"
									span
									inherit
								>
									Mulai Sekarang
								</Text>
							</ButtonLink>
							<ButtonLink
								to="/tentang"
								size="md"
								variant="light"
								radius="full"
							>
								Tentang KarsaKito
							</ButtonLink>
						</Group>
					</Stack>
				</Group>
				<SimpleGrid
					mt="xl"
					cols={{
						base: 1,
						sm: 2,
						md: 3,
						lg: 4,
					}}
				>
					{Object.entries(loaderData.optionApps).map(([category, apps]) =>
						apps.map((app, index) => {
							if (app.disabled) {
								return (
									<Stack
										key={`${app.value}-${index}`}
										gap="xs"
										py="lg"
										px={{
											base: 'md',
											sm: 'lg',
										}}
										bg="gray.1"
										bdrs="lg"
										bd="1px solid gray.3"
										className="group"
									>
										<Badge
											variant="light"
											fz={8}
										>
											{
												labelAppCategory[
													category as KarsaAppPlain['category']
												]
											}
										</Badge>
										<Title
											order={2}
											fz="md"
										>
											{app.label} (Segera)
										</Title>
										<Text
											fz="sm"
											lineClamp={4}
										>
											{app.description}
										</Text>
									</Stack>
								);
							}

							return (
								<Link
									key={`${app.value}-${index}`}
									to={`/workspace?app=${app.value}`}
									className="group"
								>
									<Stack
										gap="xs"
										h="100%"
										py="lg"
										px={{
											base: 'md',
											sm: 'lg',
										}}
										bg="gray.1"
										bdrs="lg"
										bd="1px solid gray.3"
									>
										<Badge
											variant="light"
											fz={8}
										>
											{
												labelAppCategory[
													category as KarsaAppPlain['category']
												]
											}
										</Badge>
										<Title
											order={2}
											fz="md"
										>
											{app.label}
											<Badge
												pos="relative"
												top={2}
												size="sm"
												px={6}
												fz="xs"
												fw={500}
												variant="light"
												color="yellow"
												tt="capitalize"
												ml={6}
												leftSection={<PiCoinsFill size={12} />}
											>
												<Text
													span
													inherit
													fw={700}
												>
													{app.tokenPromo || app.token}
												</Text>
											</Badge>
										</Title>
										<Text
											fz="sm"
											lineClamp={4}
										>
											{app.description}
										</Text>
										<Group
											gap={4}
											c="primary"
											mt="auto"
										>
											<Text
												span
												fz="sm"
												td="underline"
											>
												Mulai
											</Text>
											<LuArrowUpRight
												size={16}
												className="-translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100"
											/>
										</Group>
									</Stack>
								</Link>
							);
						}),
					)}
				</SimpleGrid>
				<Stack
					mt={{
						base: 48,
						md: 60,
					}}
				>
					<Title
						order={2}
						fz={{
							base: 'lg',
							lg: 20,
						}}
					>
						Panduan & Demo Penggunaan
					</Title>
					<SimpleGrid
						cols={{
							base: 1,
							sm: 2,
							md: 3,
						}}
					>
						<VideoIframe src="https://www.youtube.com/watch?v=J1DBfsJFaE8" />
						<VideoIframe src="https://www.youtube.com/watch?v=5py1dTzxWeM" />
					</SimpleGrid>
				</Stack>
				<Group
					id="faq"
					component="section"
					aria-labelledby="faq-title-home"
					gap={0}
					align="flex-start"
					mt={{
						base: 48,
						md: 60,
					}}
					bg="white"
					bd="1px solid gray.2"
					bdrs="xl"
					py={{
						base: 'lg',
						lg: 'xl',
					}}
					px={{
						base: 'md',
						sm: 'lg',
						lg: 'xl',
					}}
				>
					<Box
						w={{
							base: '100%',
							md: 280,
						}}
					>
						<Title
							id="faq-title-home"
							order={2}
							fz={{
								base: 'lg',
								lg: 20,
							}}
							mb="sm"
						>
							Pertanyaan umum
						</Title>
						<Text
							size="sm"
							mb="md"
						>
							Jawaban ringkas seputar KarsaKito, tool, dan Token.
						</Text>
						<ButtonLink
							to="/faq"
							size="sm"
							fz="xs"
							radius="full"
							rightSection={<LuArrowUpRight size={18} />}
						>
							Lihat semua FAQ
						</ButtonLink>
						<Text
							size="sm"
							mt="lg"
						>
							Butuh bantuan lain? <br />
							Kirim email ke{' '}
							<Link
								to="mailto:info@karsakito.web.id"
								c="primary"
								fw={600}
								td="underline"
							>
								info@karsakito.web.id
							</Link>
						</Text>
					</Box>
					<Accordion
						w={{
							base: '100%',
							md: 'calc(100% - 280px)',
						}}
						pl={{
							md: 'xl',
						}}
						mt={{
							base: 'lg',
							md: 0,
						}}
						order={3}
						defaultValue={faqs[0].title}
					>
						{faqs.map((faq, index) => (
							<Accordion.Item
								key={`faq-${index}`}
								value={faq.title}
							>
								<Accordion.Control>
									<Text
										span
										fz="sm"
										fw={500}
									>
										{faq.title}
									</Text>
								</Accordion.Control>
								<Accordion.Panel fz="sm">{faq.content}</Accordion.Panel>
							</Accordion.Item>
						))}
					</Accordion>
				</Group>
			</AppPanel>
		</div>
	);
}
