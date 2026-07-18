import { Accordion, Anchor, Badge, Box, Container, Stack, Text, Title } from '@mantine/core';
import { faqCategories, getPublicFaqs } from '~app-modules/faqs';
import { metaPublicRoute } from '~app-modules/meta';
import { breadcrumbSchema, faqSchema, isCanonicalSiteRequest, seoSchema } from '~app-modules/seo';
import { authGetSession } from '~app-server/session';
import Footer from '~app-ui/layouts/footer';
import { Header } from '~app-ui/layouts/header';

import type { Route } from './+types/faq';

const pageTitle = 'FAQ KarsaKito';
const pageDescription =
	'Temukan jawaban tentang KarsaKito, layanan, Kreator, Token, dan penggunaan hasil tool.';
const allFaqs = getPublicFaqs();

const faqGroups = faqCategories
	.map((category) => ({
		...category,
		faqs: allFaqs.filter((faq) => faq.category === category.id),
	}))
	.filter((category) => category.faqs.length > 0);

export async function loader({ request }: Route.LoaderArgs) {
	const authSession = await authGetSession(request);

	return {
		user: authSession.get('user'),
		noIndex: !isCanonicalSiteRequest(request),
	};
}

export function meta({ loaderData }: Route.MetaArgs) {
	return metaPublicRoute({
		title: pageTitle,
		description: pageDescription,
		noIndex: loaderData.noIndex,
		canonicalPath: '/faq',
		structuredData: seoSchema(
			faqSchema(allFaqs, {
				name: pageTitle,
				description: pageDescription,
				path: '/faq',
				hasBreadcrumb: true,
			}),
			breadcrumbSchema('/faq', [
				{ name: 'KarsaKito', path: '/' },
				{ name: 'FAQ', path: '/faq' },
			]),
		),
	});
}

export default function FaqRoute({ loaderData }: Route.ComponentProps) {
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
					id="faq"
					aria-labelledby="faq-page-title"
					py={{
						base: 48,
						sm: 60,
						lg: 80,
					}}
				>
					<Container size="md">
						<Stack
							gap="md"
							mb={{
								base: 36,
								lg: 48,
							}}
						>
							<Badge
								variant="light"
								w="fit-content"
							>
								FAQ
							</Badge>
							<Title
								id="faq-page-title"
								order={1}
							>
								Pertanyaan yang sering ditanyakan
							</Title>
							<Text c="gray.6">
								Temukan informasi tentang KarsaKito, Layanan, Kreator, Token, dan
								cara menggunakan hasil tool.
							</Text>
						</Stack>

						<Stack gap={32}>
							{faqGroups.map((group) => (
								<Stack
									key={group.id}
									gap="md"
								>
									<Stack gap={4}>
										<Title order={2}>{group.label}</Title>
										<Text
											size="sm"
											c="gray.6"
										>
											{group.description}
										</Text>
									</Stack>

									<Accordion variant="separated">
										{group.faqs.map((faq) => (
											<Accordion.Item
												key={faq.title}
												value={faq.title}
											>
												<Accordion.Control>{faq.title}</Accordion.Control>
												<Accordion.Panel>{faq.content}</Accordion.Panel>
											</Accordion.Item>
										))}
									</Accordion>
								</Stack>
							))}
						</Stack>

						<Text
							mt={{ base: 36, lg: 48 }}
							c="gray.6"
							size="sm"
						>
							Belum menemukan jawaban? Hubungi Kito melalui{' '}
							<Anchor href="mailto:info@karsakito.web.id">
								info@karsakito.web.id
							</Anchor>
							.
						</Text>
					</Container>
				</Box>
			</main>
			<Footer />
		</div>
	);
}
