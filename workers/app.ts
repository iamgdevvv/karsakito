import { PrismaD1 } from '@prisma/adapter-d1';
import { createContext, createRequestHandler, RouterContextProvider } from 'react-router';
import { PrismaClient } from '~generated/prisma/client';

export const prismaContext = createContext<PrismaClient>();

export const cloudflareContext = createContext<{
	env: Env;
	ctx: ExecutionContext;
}>();

export type PrismaContext = typeof prismaContext;
export type CloudflareContext = typeof cloudflareContext;

const requestHandler = createRequestHandler(
	() => import('virtual:react-router/server-build'),
	import.meta.env.MODE,
);

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);

		const adapter = new PrismaD1(env.DB);
		const prisma = new PrismaClient({ adapter });

		const context = new RouterContextProvider();

		context.set(prismaContext, prisma);
		context.set(cloudflareContext, {
			env,
			ctx,
		});

		if (
			(url.pathname.includes('/__scheduled') ||
				url.pathname.includes('/cdn-cgi/handler/scheduled')) &&
			this.scheduled
		) {
			// Manually execute the scheduled function
			await this.scheduled(
				{
					cron: 'local-test',
					scheduledTime: Date.now(),
					noRetry: function (): void {
						throw new Error('Function not implemented.');
					},
				},
				env,
				ctx,
			);
			return new Response('Local cron executed manually');
		}

		return requestHandler(request, context);
	},

	async scheduled(controller, env, ctx) {
		console.log(`Cron processed at ${new Date(controller.scheduledTime).toISOString()}`);
		console.log(`Triggered by cron pattern: ${controller.cron}`);

		const adapter = new PrismaD1(env.DB);
		const prisma = new PrismaClient({ adapter });

		const refillToken = async () => {
			const users = await prisma.user.findMany({
				where: {
					balanceActivities: {
						some: {
							type: 'DAILY_BONUS',
							// createdAt: dayjs().startOf('day').subtract(1, 'day').toDate(),
						},
					},
				},
			});

			console.log({ users });
		};

		ctx.waitUntil(refillToken());
	},
} satisfies ExportedHandler<Env>;
