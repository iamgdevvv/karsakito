import {
	Box,
	Button,
	ColorSchemeScript,
	Container,
	Group,
	mantineHtmlProps,
	MantineProvider,
	Stack,
	Text,
	Title,
} from '@mantine/core';
import { notifications, Notifications } from '@mantine/notifications';
import { NavigationProgress, nprogress } from '@mantine/nprogress';
import { useEffect } from 'react';
import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useNavigation,
	useSearchParams,
} from 'react-router';
import theme from '~app-modules/theme';
import { ButtonLink } from '~app-ui/components/link';
import Footer from '~app-ui/layouts/footer';

import '@gfazioli/mantine-scene/styles.css';
import '@gfazioli/mantine-window/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/nprogress/styles.css';
import '@mantine/spotlight/styles.css';

import type { Route } from './+types/root';

import './styles/app.css';

export const links: Route.LinksFunction = () => [
	{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
	{
		rel: 'preconnect',
		href: 'https://fonts.gstatic.com',
		crossOrigin: 'anonymous',
	},
	{
		rel: 'stylesheet',
		href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200..800&display=swap',
	},
	{
		rel: 'icon',
		type: 'image/svg+xml',
		href: '/favicon.svg',
	},
];

export function Layout({ children }: { children: React.ReactNode }) {
	const [searchParams, setSearchParams] = useSearchParams();
	const navigation = useNavigation();

	useEffect(() => {
		notifications.clean();
		notifications.cleanQueue();

		if (navigation.state === 'loading' || navigation.state === 'submitting') {
			nprogress.start();
		} else {
			nprogress.complete();
		}

		const successMessage = searchParams.get('successMessage');
		const errorMessage = searchParams.get('errorMessage');

		if (successMessage) {
			notifications.show({
				title: 'Berhasil',
				message: successMessage,
				position: 'top-center',
				autoClose: 1000,
				onClose: () => {
					searchParams.delete('successMessage');
					setSearchParams(searchParams, {
						defaultShouldRevalidate: false,
					});
				},
			});
		}

		if (errorMessage) {
			notifications.show({
				title: 'Terjadi kendala',
				color: 'red',
				message: errorMessage,
				position: 'top-center',
				autoClose: 1000,
				onClose: () => {
					searchParams.delete('errorMessage');
					setSearchParams(searchParams, {
						defaultShouldRevalidate: false,
					});
				},
			});
		}
	}, [navigation]);

	return (
		<html
			lang="id"
			{...mantineHtmlProps}
		>
			<head>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<ColorSchemeScript />
				<Meta />
				<Links />
			</head>
			<body>
				<MantineProvider theme={theme}>
					<a
						href="#main-content"
						className="skip-link"
					>
						Langsung ke konten utama
					</a>
					<NavigationProgress />
					<Notifications position="top-center" />
					{children}
				</MantineProvider>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let statusCode: number = 404;

	if (isRouteErrorResponse(error)) {
		statusCode = error.status;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		console.log('ErrorBoundary', error);
	}

	return (
		<div className="site">
			<Box
				component="main"
				id="main-content"
				tabIndex={-1}
				bg="primary.1"
				py="xl"
				className="site-main"
			>
				<Container size="xs">
					<Stack
						gap="xs"
						align="center"
						justify="center"
						ta="center"
						mih="60vh"
					>
						<Title
							fz={{
								lg: 40,
							}}
						>
							{statusCode === 404 ? 'Halaman tidak ditemukan' : 'Terjadi kesalahan'}
						</Title>
						<Text>
							{statusCode === 404
								? 'Halaman yang Anda tuju tidak tersedia. Periksa kembali alamatnya atau kembali ke halaman sebelumnya.'
								: 'Permintaan Anda belum dapat diproses. Silakan coba lagi beberapa saat lagi. Jika kendala berlanjut, hubungi Kito.'}
						</Text>
						<Group
							justify="center"
							gap="xs"
						>
							{statusCode === 404 ? (
								<ButtonLink to="/">Halaman Utama</ButtonLink>
							) : (
								<>
									<ButtonLink
										to="/"
										variant="light"
									>
										Halaman Utama
									</ButtonLink>
									<Button
										component="a"
										href="/hubungi"
									>
										Laporkan kendala
									</Button>
								</>
							)}
						</Group>
					</Stack>
				</Container>
			</Box>
			<Footer />
		</div>
	);
}

const loggingMiddleware: Route.MiddlewareFunction = async ({ request }, next) => {
	const start = performance.now();
	const response = await next();
	const duration = performance.now() - start;
	console.info(
		`${new Date().toISOString()} ${request.method} ${request.url} Response ${response.status} (${duration}ms)`,
	);
	return response;
};

export const middleware: Route.MiddlewareFunction[] = [loggingMiddleware];
