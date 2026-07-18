import { type RouterContextProvider } from 'react-router';
import {
    PayloadQueryBalanceUserSchema,
    PayloadUpdateBalanceSchema,
} from '~app-modules/schema/balance';
import { dayjs, parseFormData, qsParse } from '~app-modules/utils';
import { prismaClient } from '~app-server/context';
import { authMiddlewareSession } from '~app-server/session';
import { messageActionError } from '~app-server/utils';
import { Prisma } from '~generated/prisma/client';

export const actionUpdateBalanceUser = async ({
	userId,
	request,
	context,
}: {
	userId: string;
	request: Request;
	context: Readonly<RouterContextProvider>;
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
				error: 'Anda tidak memiliki akses untuk tindakan ini.',
			};
		}

		const formData = await request.formData();
		const body = PayloadUpdateBalanceSchema.parse(parseFormData(formData));

		const prisma = prismaClient(context);

		const userBalance = await prisma.balance.findUniqueOrThrow({
			where: {
				userId,
			},
			select: {
				token: true,
				tokenDaily: true,
			},
		});

		const newToken = userBalance.token + body.token;
		const newTokenDaily = userBalance.tokenDaily + body.token;

		return {
			data: await prisma.balance.update({
				where: {
					userId: userId,
				},
				data: {
					token: body.type !== 'DAILY_BONUS' ? newToken : Prisma.skip,
					tokenDaily:
						body.type === 'DAILY_BONUS'
							? newTokenDaily
							: Prisma.skip,
					activities: {
						create: {
							type: body.type,
							description: body.description,
							token: body.token,
							tokenBefore:
								body.type !== 'DAILY_BONUS'
									? userBalance.token
									: userBalance.token,
							tokenAfter:
								body.type !== 'DAILY_BONUS'
									? newToken
									: userBalance.token,
							tokenDailyBefore:
								body.type === 'DAILY_BONUS'
									? userBalance.tokenDaily
									: userBalance.tokenDaily,
							tokenDailyAfter:
								body.type === 'DAILY_BONUS'
									? newTokenDaily
									: userBalance.tokenDaily,
						},
					},
				},
				select: {
					userId: true,
				},
			}),
		};
	} catch (error) {
		console.log('actionUpdateBalanceUser', error);

		return {
			error: messageActionError(error),
		};
	}
};

export const actionGetBalanceUser = async ({
	request,
	context,
	withActivities,
}: {
	request: Request;
	context: Readonly<RouterContextProvider>;
	withActivities?: boolean;
}) => {
	try {
		const authSession = await authMiddlewareSession({
			request,
		});

		if ('error' in authSession) {
			return {
				error: 'Anda tidak memiliki akses untuk tindakan ini.',
			};
		}

		const searchPayload = qsParse(new URL(request.url).search);

		const queryParams = PayloadQueryBalanceUserSchema.parse(searchPayload);

		if (!queryParams.activityStartAt) {
			queryParams.activityStartAt = dayjs().startOf('week').toDate();
		}

		if (!queryParams.activityEndAt) {
			queryParams.activityEndAt = dayjs().endOf('week').toDate();
		}

		return {
			data: await prismaClient(context).balance.findUniqueOrThrow({
				where: {
					userId: authSession.user.id,
				},
				select: {
					token: true,
					tokenDaily: true,
					activities: withActivities
						? {
								where: {
									createdAt: {
										gte: queryParams.activityStartAt,
										lte: queryParams.activityEndAt,
									},
								},
								select: {
									id: true,
									type: true,
									token: true,
									tokenBefore: true,
									tokenAfter: true,
									tokenDailyBefore: true,
									tokenDailyAfter: true,
									description: true,
									createdAt: true,
									sender: {
										select: {
											id: true,
											name: true,
										},
									},
									karsa: {
										select: {
											app: true,
										},
									},
								},
								orderBy: {
									createdAt: 'desc',
								},
							}
						: Prisma.skip,
				},
			}),
            params: {
                ...queryParams,
                withActivities
            },
		};
	} catch (error) {
		console.log('actionGetBalanceUser', error);

		return {
			error: messageActionError(error),
		};
	}
};

export type ActionGetBalanceUser = Awaited<
	ReturnType<typeof actionGetBalanceUser>
>;

export type ActionUpdateBalanceUser = Awaited<
	ReturnType<typeof actionUpdateBalanceUser>
>;
