import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import { NavigationProgress } from '@mantine/nprogress';
import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useNavigation,
} from 'react-router';

import '@mantine/nprogress/styles.css';

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
		href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
	},
];

export function Layout({ children }: { children: React.ReactNode }) {
	const navigation = useNavigation();
	const isNavigating = Boolean(navigation.location);

	return (
		<html lang="id" {...mantineHtmlProps}>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<ColorSchemeScript />
				<Meta />
				<Links />
			</head>
			<body>
				<MantineProvider>
					{children}
					{isNavigating ? <NavigationProgress /> : null}
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
	let message = 'Oops!';
	let details = 'An unexpected error occurred.';
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? '404' : 'Error';
		details =
			error.status === 404
				? 'The requested page could not be found.'
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className="pt-16 p-4 container mx-auto">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full p-4 overflow-x-auto">
					<code>{stack}</code>
				</pre>
			)}
		</main>
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
