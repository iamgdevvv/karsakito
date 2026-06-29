import { createContext, type RouterContextProvider } from 'react-router';
import type { User } from "~generated/prisma/client";
import { prismaContext } from "~workers/app";

export const prismaClient = (ctx: Readonly<RouterContextProvider>) => ctx.get(prismaContext);

export const authUserCtx = createContext<User | null>(null);