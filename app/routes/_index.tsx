import {
	Accordion,
	Badge,
	Box,
	DataList,
	Group,
	SimpleGrid,
	Stack,
	Text,
	Title,
} from '@mantine/core';
import { LuArrowUpRight } from 'react-icons/lu';
import { labelAppCategory } from '~app-modules/enum-options';
import { metaPublicRoute } from '~app-modules/meta';
import type { KarsaAppPlain } from '~app-modules/schema/app';
import { dayjs } from '~app-modules/utils';
import { actionGetKarsaAppsByCategory } from '~app-server/app';
import { cfContext } from '~app-server/context';
import { authGetSession } from '~app-server/session';
import { Image } from '~app-ui/components/image';
import { ButtonLink, Link } from '~app-ui/components/link';
import VideoIframe from '~app-ui/components/video';
import AppPanel from '~app-ui/layouts/apps-panel';

import type { Route } from './+types/_index';

export async function loader({ request, context }: Route.LoaderArgs) {
	const authSession = await authGetSession(request);
	const user = authSession.get('user');
	const optionApps = await actionGetKarsaAppsByCategory({ context });

	return {
		optionApps,
		user,
		noIndex: cfContext(context).env.NODE_ENV !== 'production',
	};
}

export function meta({ loaderData }: Route.MetaArgs) {
	return metaPublicRoute({
		title: 'Ekosistem Karsakito',
		description:
			'Temukan berbagai solusi AI dari KarsaKito yang siap membantu Anda bekerja lebih cepat, lebih cerdas, dan lebih efisien melalui satu platform terpadu.',
		noIndex: loaderData.noIndex,
	});
}

const faqs = [
	{
		title: 'How does the AI generate content?',
		content:
			'The AI generates content using a combination of natural language processing and machine learning algorithms.',
	},
	{
		title: 'Can i customize the AI-generated content?',
		content:
			'Yes, you can customize the AI-generated content to meet your specific needs untuk Mengakselerasi Pemanfaatan Bahasa dan Warisan Budaya Daerah',
	},
	{
		title: 'What types of content can the AI generate?',
		content:
			'The AI can generate a wide range of content types, including text, images, videos, and more.',
	},
	{
		title: 'Is the AI-generated content plagiarism-free?',
		content:
			'Yes, the AI-generated content is plagiarism-free and is not copied from other sources.',
	},
	{
		title: 'Does the tool have any limitations?',
		content: 'The tool has no limitations and can be used for any purpose.',
	},
];

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
								lg: 28,
							}}
						>
							Ekosistem Karsakito
						</Title>
						<Text
							c="gray.6"
							size="sm"
						>
							Temukan berbagai solusi AI dari KarsaKito yang siap membantu Anda
							bekerja lebih cepat, lebih cerdas, dan lebih efisien melalui satu
							platform terpadu.
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
								Pelajari Selengkapnya
							</ButtonLink>
						</Group>
					</Stack>
				</Group>
				<SimpleGrid
					mt="xl"
					cols={{
						base: 1,
						md: 4,
					}}
				>
					<SimpleGrid
						cols={{
							base: 1,
							sm: 2,
							md: 3,
						}}
						className="md:col-span-3"
					>
						{Object.entries(loaderData.optionApps).map(([category, apps]) =>
							apps.map((app, index) => (
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
							)),
						)}
					</SimpleGrid>
					<Box>
						<Stack
							pos="sticky"
							top={20}
							gap="xs"
							py="lg"
							px={{
								base: 'md',
								sm: 'lg',
							}}
							bg="white"
							bdrs="lg"
							bd="1px solid gray.3"
						>
							<Title
								order={2}
								fz="md"
							>
								Saved Workspace
							</Title>
							<DataList orientation="vertical">
								<DataList.Item
									component={Link}
									// @ts-expect-error
									to={`/workspace/1`}
									className="group"
								>
									<DataList.ItemLabel fz="xs">
										{dayjs().format('DD MMM YYYY')}
									</DataList.ItemLabel>
									<DataList.ItemValue
										fz="sm"
										fw={500}
										c="primary"
										className="group-hover:underline"
									>
										AI Bahan Ajar Budaya Minangkabau
									</DataList.ItemValue>
								</DataList.Item>
								<DataList.Item
									component={Link}
									// @ts-expect-error
									to={`/workspace/1`}
									className="group"
								>
									<DataList.ItemLabel fz="xs">
										{dayjs().format('DD MMM YYYY')}
									</DataList.ItemLabel>
									<DataList.ItemValue
										fz="sm"
										fw={500}
										c="primary"
										className="group-hover:underline"
									>
										Draft Konten Youtube XXYYZZZ
									</DataList.ItemValue>
								</DataList.Item>
								<DataList.Item
									component={Link}
									// @ts-expect-error
									to={`/workspace/1`}
									className="group"
								>
									<DataList.ItemLabel fz="xs">
										{dayjs().format('DD MMM YYYY')}
									</DataList.ItemLabel>
									<DataList.ItemValue
										fz="sm"
										fw={500}
										c="primary"
										className="group-hover:underline"
									>
										Pidato Kunjungan Daerah Bapak XXYYZZ
									</DataList.ItemValue>
								</DataList.Item>
							</DataList>
						</Stack>
					</Box>
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
						Tutorial & Dokumentasi
					</Title>
					<SimpleGrid
						cols={{
							base: 1,
							sm: 2,
							md: 3,
						}}
					>
						<VideoIframe src="https://www.youtube.com/watch?v=OIi9Gi6cNaA" />
						<VideoIframe src="https://www.youtube.com/watch?v=IRdBLrzlpag" />
						<VideoIframe src="https://www.youtube.com/watch?v=Exdoe-pa1kg" />
					</SimpleGrid>
				</Stack>
				<Group
					id="faq"
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
							order={2}
							fz={{
								base: 'lg',
								lg: 20,
							}}
							mb="sm"
						>
							FAQ's
						</Title>
						<Text
							size="sm"
							mb="md"
						>
							Everything you need to know about the product and other
							information.{' '}
						</Text>
						<ButtonLink
							to="/faq"
							target="_blank"
							size="sm"
							fz="xs"
							radius="full"
							rightSection={<LuArrowUpRight size={18} />}
						>
							FAQ Lengkap
						</ButtonLink>
						<Text
							size="sm"
							mt="lg"
						>
							Can't find the answer you're looking for? <br />
							Say hi at{' '}
							<Link
								to="mailto:info@karsakito.com"
								target="_blank"
								c="primary"
								fw={600}
								td="underline"
							>
								info@karsakito.com
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
