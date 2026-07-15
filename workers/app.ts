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
		const adapter = new PrismaD1(env.DB);
		const prisma = new PrismaClient({ adapter });

		const context = new RouterContextProvider();

		context.set(prismaContext, prisma);
		context.set(cloudflareContext, {
			env,
			ctx,
		});

		return requestHandler(request, context);
	},
} satisfies ExportedHandler<Env>;
