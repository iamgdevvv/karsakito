import { createContext, type RouterContextProvider } from 'react-router';
import type { User } from "~generated/prisma/client";
import { brevoContext, cloudflareContext, prismaContext } from "~workers/app";

export const prismaClient = (ctx: Readonly<RouterContextProvider>) => ctx.get(prismaContext);
export const brevoMailer = (ctx: Readonly<RouterContextProvider>) => ctx.get(brevoContext);
export const cfContext = (ctx: Readonly<RouterContextProvider>) => ctx.get(cloudflareContext);

export const authUserCtx = createContext<User | null>(null);