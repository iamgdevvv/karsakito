import { type RouterContextProvider } from "react-router";
import { PayloadUpdateBalanceSchema } from "~app-modules/schema/balance";
import { parseFormData } from "~app-modules/utils";
import { prismaClient } from "~app-server/context";
import { authMiddlewareSession } from "~app-server/session";
import { messageActionError } from "~app-server/utils";
import { Prisma } from "~generated/prisma/client";

export const actionUpdateBalanceUser = async ({
    userId,
    request,
    context
}: {
    userId: string
    request: Request
    context: Readonly<RouterContextProvider>
}) => {
    try {
        const authSession = await authMiddlewareSession({
            guard: {
                role: ['ADMIN', 'STAFF'],
            },
            request,
        });

        if ('error' in authSession) {
            return {
                error: 'Forbidden'
            }
        }

        const formData = await request.formData()
        const body = PayloadUpdateBalanceSchema.parse(parseFormData(formData))

        const prisma = prismaClient(context)

        const userBalance = await prisma.balance.findUniqueOrThrow({
            where: {
                userId
            },
            select: {
                token: true,
                tokenDaily: true
            }
        })

        const newToken = userBalance.token + body.token
        const newTokenDaily = userBalance.tokenDaily + body.token

        return {
            data: await prisma.balance.update({
                where: {
                    userId: userId,
                },
                data: {
                    token: body.type !== 'DAILY_BONUS' ? newToken : Prisma.skip,
                    tokenDaily: body.type === 'DAILY_BONUS' ? newTokenDaily : Prisma.skip,
                    activities: {
                        create: {
                            type: body.type,
                            description: body.description,
                            token: body.token,
                            tokenBefore: body.type !== 'DAILY_BONUS' ? userBalance.token : Prisma.skip,
                            tokenAfter: body.type !== 'DAILY_BONUS' ? newToken : Prisma.skip,
                            tokenDailyBefore: body.type === 'DAILY_BONUS' ? userBalance.tokenDaily : Prisma.skip,
                            tokenDailyAfter: body.type === 'DAILY_BONUS' ? newTokenDaily : Prisma.skip,
                        }
                    }
                },
                select: {
                    userId: true
                }
            })
        }
    } catch (error) {
        console.log('actionUpdateBalanceUser', error)

        return {
            error: messageActionError(error)
        }
    }
};

export const actionGetBalanceUser = async ({
    userId,
    context
}: {
    userId: string
    context: Readonly<RouterContextProvider>
}) => {
    try {
        return {
            data: await prismaClient(context).balance.findUniqueOrThrow({
            where: {
                userId
            },
            select: {
                token: true,
                tokenDaily: true
            }
        })
        }
    } catch (error) {
        console.log('actionGetBalanceUser', error)

        return {
            error: messageActionError(error)
        }
    }
};


export type ActionUpdateBalanceUser = Awaited<ReturnType<typeof actionUpdateBalanceUser>>;