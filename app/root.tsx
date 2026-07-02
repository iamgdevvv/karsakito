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
} from 'react-router';
import theme from '~app-modules/theme';

import '@gfazioli/mantine-scene/styles.css';
import '@gfazioli/mantine-window/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/nprogress/styles.css';
import '@mantine/spotlight/styles.css';
import '@mantine/tiptap/styles.css';

import { ButtonLink } from '~app-ui/components/link';
import Footer from '~app-ui/layouts/footer';

import type { Route } from './+types/root';

import './styles/app.css';
import './styles/mantine.css';

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
	const navigation = useNavigation();
	// const isNavigating = useMemo(() => Boolean(navigation.location), [navigation.location]);

	useEffect(() => {
		notifications.clean();
		notifications.cleanQueue();

		if (navigation.state === 'loading' || navigation.state === 'submitting') {
			nprogress.start();
		} else {
			nprogress.complete();
		}
	}, [navigation.state]);

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
					<NavigationProgress />
					<Notifications position="bottom-center" />
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
	// let message = 'Oops!';
	// let details = 'An unexpected error occurred.';
	// let stack: string | undefined;
	let statusCode: number = 404;

	if (isRouteErrorResponse(error)) {
		statusCode = error.status;
		// message = error.status === 404 ? '404' : 'Error';
		// details =
		// 	error.status === 404
		// 		? 'The requested page could not be found.'
		// 		: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		// details = error.message;
		// stack = error.stack;
	}

	return (
		<div className="site">
			<Box
				component="main"
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
							{statusCode === 404
								? 'Halaman Tidak Ditemukan'
								: 'Something went wrong'}
						</Title>
						<Text>
							{statusCode === 404
								? 'Ups! Halaman yang Anda tuju tidak tersedia. Periksa kembali alamat URL atau kembali ke halaman sebelumnya untuk melanjutkan penjelajahan.'
								: 'Terjadi kesalahan saat memproses permintaan Anda. Silakan coba beberapa saat lagi. Jika masalah masih berlanjut, hubungi tim dukungan untuk mendapatkan bantuan.'}
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
										href="/hubungi-kami"
									>
										Laporkan Kesalahan
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
