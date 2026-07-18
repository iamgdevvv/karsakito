import { redirect, type RouterContextProvider } from "react-router";
import { amountTokenDaily } from "~app-modules/enum-options";
import { PayloadQueryBalanceUserSchema } from "~app-modules/schema/balance";
import { PayloadCreateUserSchema, PayloadQueryUsersSchema, PayloadUpdateProfilePasswordSchema, PayloadUpdateProfileSchema, PayloadUpdateUserPasswordSchema, PayloadUpdateUserSchema, type PayloadQueryUsers } from "~app-modules/schema/user";
import { dayjs, parseFormData, qsParse, valueBooleanOrFalse } from "~app-modules/utils";
import { prismaClient } from "~app-server/context";
import { authGetSession, authLoginSession, authMiddlewareSession } from "~app-server/session";
import { hashCreds, messageActionError, valueOrSkip, verifyCreds } from "~app-server/utils";
import { Prisma, type User } from "~generated/prisma/client";

export const actionCreateUser = async ({
	request,
	context
}: {
	request: Request
	context: Readonly<RouterContextProvider>
}) => {
	try {
		const authSession = await authMiddlewareSession({
			guard: {
				role: ['ADMIN'],
			},
			request,
		});

		if ('error' in authSession) {
			return {
				error: 'Anda tidak memiliki akses untuk tindakan ini.'
			}
		}

		const formData = await request.formData()
		const body = PayloadCreateUserSchema.parse(parseFormData(formData))

		const { password, ...payload } = body;

		const hash = await hashCreds(password);

		const resultUser = await prismaClient(context).user.create({
			data: {
				...payload,
				isActive: valueBooleanOrFalse(body.isActive),
				auth: {
					create: {
						hash
					}
				},
				balances: {
					create: {
						tokenDaily: amountTokenDaily,
						activities: {
							create: {
								type: 'DAILY_BONUS',
								token: amountTokenDaily,
								tokenDailyBefore: 0,
								tokenDailyAfter: amountTokenDaily
							}
						}
					}
				}
			},
			select: {
				name: true,
				isActive: true
			}
		})

		return {
			data: resultUser
		}
	} catch (error) {
		console.log('actionCreateUser', error)

		return {
			error: messageActionError(error)
		}
	}
};

export const actionUpdateUser = async ({
	request,
	context
}: {
	request: Request
	context: Readonly<RouterContextProvider>
}) => {
	try {
		const authSession = await authMiddlewareSession({
			guard: {
				role: ['ADMIN'],
			},
			request,
		});

		if ('error' in authSession) {
			return {
				error: 'Anda tidak memiliki akses untuk tindakan ini.'
			}
		}

		const formData = await request.formData()
		const { userId, ...body } = PayloadUpdateUserSchema.parse(parseFormData(formData))

		const resultUser = await prismaClient(context).user.update({
			where: {
				id: userId
			},
			data: body,
			select: {
				name: true
			}
		})

		return {
			data: resultUser
		}
	} catch (error) {
		console.log('actionUpdateUser', error)

		return {
			error: messageActionError(error)
		}
	}
};

export const actionUpdateUserPassword = async ({
	request,
	context
}: {
	request: Request
	context: Readonly<RouterContextProvider>
}) => {
	try {
		const authSession = await authMiddlewareSession({
			guard: {
				role: ['ADMIN'],
			},
			request,
		});

		if ('error' in authSession) {
			return {
				error: 'Anda tidak memiliki akses untuk tindakan ini.'
			}
		}

		const formData = await request.formData()
		const body = PayloadUpdateUserPasswordSchema.parse(parseFormData(formData))

		const { password, ...payload } = body;

		const hash = await hashCreds(password);

		const resultAuth = await prismaClient(context).auth.update({
			where: {
				userId: payload.userId
			},
			data: {
				hash
			},
			select: {
				userId: true
			}
		})

		return {
			data: resultAuth
		}
	} catch (error) {
		console.log('actionUpdateUserPassword', error)

		return {
			error: messageActionError(error)
		}
	}
};

export const actionDeleteUser = async ({
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
				role: ['ADMIN'],
			},
			request,
		});

		if ('error' in authSession) {
			return {
				error: 'Anda tidak memiliki akses untuk tindakan ini.'
			}
		}

		const resultUser = await prismaClient(context).user.delete({
			where: {
				id: userId
			},
			select: {
				name: true
			}
		})

		return {
			data: {
				name: resultUser.name
			}
		}
	} catch (error) {
		console.log('actionDeleteUser', error)

		return {
			error: messageActionError(error)
		}
	}
};

export const actionUpdateProfile = async ({
	request,
	context
}: {
	request: Request
	context: Readonly<RouterContextProvider>
}) => {
	try {
		const authSession = await authMiddlewareSession({
			request,
		});

		if ('error' in authSession) {
			return {
				error: 'Anda tidak memiliki akses untuk tindakan ini.'
			}
		}

		const userId = authSession.user.id

		const formData = await request.formData()
		const body = PayloadUpdateProfileSchema.parse(parseFormData(formData))

		const resultUser = await prismaClient(context).user.update({
			where: {
				id: userId
			},
			data: body,
		})

		const authNewSession = await authGetSession(request);

		authNewSession.set('user', resultUser);

		return redirect('/dashboard/profile', {
			headers: {
				'Set-Cookie': await authLoginSession(authNewSession),
			},
		});

	} catch (error) {
		console.log('actionUpdateProfile', error)

		return {
			error: messageActionError(error)
		}
	}
};

export const actionChangePassword = async ({
	request,
	context
}: {
	request: Request
	context: Readonly<RouterContextProvider>
}) => {
	try {
		const authSession = await authMiddlewareSession({
			request,
		});

		if ('error' in authSession) {
			return {
				error: 'Anda tidak memiliki akses untuk tindakan ini.'
			}
		}

		const userId = authSession.user.id

		const formData = await request.formData()
		const body = PayloadUpdateProfilePasswordSchema.parse(parseFormData(formData))

		const { password, curentPassword, confirmPassword } = body;

		if (password !== confirmPassword) {
			return {
				error: 'Konfirmasi kata sandi tidak sesuai.'
			}
		}

		const authRecord = await prismaClient(context).auth.findUniqueOrThrow({
			where: {
				userId
			},
			select: {
				hash: true
			}
		})

		const credValid = await verifyCreds(curentPassword, authRecord.hash);

		if (!credValid) {
			return {
				error: 'Kata sandi saat ini tidak sesuai.'
			}
		}

		const hash = await hashCreds(password);

		const resultAuth = await prismaClient(context).auth.update({
			where: {
				userId
			},
			data: {
				hash
			},
			select: {
				userId: true
			}
		})

		return {
			data: resultAuth
		}
	} catch (error) {
		console.log('actionChangePassword', error)

		return {
			error: messageActionError(error)
		}
	}
};

export const actionGetUsers = async <T = User>({
	request,
	context
}: {
	request: Request
	context: Readonly<RouterContextProvider>
}): Promise<{
	data: T[];
	params: PayloadQueryUsers | null;
	nextCursor: User['id'] | null;
	previousCursor: User['id'] | null;
}> => {
	try {
		const authSession = await authMiddlewareSession({
			guard: {
				role: ['ADMIN'],
			},
			request,
		});

		if ('error' in authSession) {
			return {
				data: [],
				params: null,
				nextCursor: null,
				previousCursor: null,
			}
		}

		const searchPayload = qsParse(new URL(request.url).search);

		const queryParams = PayloadQueryUsersSchema.parse(searchPayload);

		const { nextCursor, previousCursor, total, search, asc, desc, select, ...params } = queryParams

		const argsOrderBy: Prisma.UserOrderByWithRelationInput[] = [];
		const argsSelect: Prisma.UserSelect = {};
		const whereSearch: Prisma.UserWhereInput['OR'] = []

		if (typeof desc === 'string') {
			argsOrderBy.push({
				[desc]: 'desc',
			});
		} else if (desc?.length) {
			desc.forEach((field) => {
				argsOrderBy.push({
					[field]: 'desc',
				});
			});
		}

		if (typeof asc === 'string') {
			argsOrderBy.push({
				[asc]: 'asc',
			});
		} else if (asc?.length) {
			asc.forEach((field) => {
				argsOrderBy.push({
					[field]: 'asc',
				});
			});
		}

		if (typeof select === 'string') {
			argsSelect[select] = true;
		} else if (select) {
			select.forEach((field) => {
				argsSelect[field] = true;
			});
		}

		if (search) {
			const searchFields = ['name', 'email'] satisfies Prisma.UserScalarFieldEnum[];

			whereSearch.push(...searchFields.map((field) => ({
				[field]: {
					contains: search,
				}
			})));
		}

		const pageSize = Number(total || 10);
		const takeAmount = pageSize + 1;
		let cursorId = nextCursor;
		let isBackward = false;

		if (previousCursor) {
			isBackward = true;
			cursorId = previousCursor;
		}

		const args = {
			take: isBackward ? -takeAmount : takeAmount,
			skip: cursorId ? 1 : Prisma.skip,
			cursor: cursorId ? { id: cursorId } : Prisma.skip,
			orderBy: argsOrderBy.length ? argsOrderBy : Prisma.skip,
			...(Object.keys(argsSelect).length ? { select: { ...argsSelect, id: true } } : {}),
			where: {
				OR: whereSearch.length ? whereSearch : Prisma.skip,
				id: valueOrSkip(params.id),
				name: valueOrSkip(params.name),
				email: valueOrSkip(params.email),
				role: valueOrSkip(params.role),
				isActive: valueOrSkip(params.isActive),
				createdAt: params.createdAt
					? {
						lte: dayjs(params.createdAt).endOf('day').toDate(),
						gte: dayjs(params.createdAt).startOf('day').toDate(),
					}
					: Prisma.skip,
				updatedAt: params.updatedAt
					? {
						lte: dayjs(params.updatedAt).endOf('day').toDate(),
						gte: dayjs(params.updatedAt).startOf('day').toDate(),
					}
					: Prisma.skip,
			}
		} as const satisfies Prisma.UserFindManyArgs

		const rawResultUsers = await prismaClient(context).user.findMany(args)

		let hasExtraRecord = rawResultUsers.length > pageSize;
		let resultUsers = [...rawResultUsers];

		let finalNextCursor: User['id'] | null = null;
		let finalPrevCursor: User['id'] | null = null;

		if (isBackward) {
			if (hasExtraRecord) {
				resultUsers.shift();
				finalPrevCursor = resultUsers[0]?.id || null;
			}

			if (resultUsers.length > 0) {
				finalNextCursor = resultUsers[resultUsers.length - 1].id;
			}
		} else {
			if (hasExtraRecord) {
				resultUsers.pop();
				finalNextCursor = resultUsers[resultUsers.length - 1]?.id || null;
			}

			if (cursorId && resultUsers.length > 0) {
				finalPrevCursor = resultUsers[0].id;
			}
		}

		return {
			data: resultUsers as T[],
			params: queryParams,
			nextCursor: finalNextCursor,
			previousCursor: finalPrevCursor
		}
	} catch (error) {
		console.log('actionGetUsers', error)

		return {
			data: [],
			params: null,
			nextCursor: null,
			previousCursor: null,
		}
	}
};

export const actionGetUser = async ({
	userId,
	withBalance,
	request,
	context
}: {
	userId: User['id']
	withBalance?: boolean
	request: Request
	context: Readonly<RouterContextProvider>
}) => {
	try {
		const authSession = await authMiddlewareSession({
			guard: {
				role: ['ADMIN'],
			},
			request,
		});

		if ('error' in authSession) {
			return {
				error: 'Anda tidak memiliki akses untuk tindakan ini.'
			}
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
			data: await prismaClient(context).user.findUniqueOrThrow({
				where: {
					id: userId
				},
				include: {
					balances: withBalance ? {
						select: {
							token: true,
							tokenDaily: true,
							activities: {
								where: {
									createdAt: {
										gte: queryParams.activityStartAt,
										lte: queryParams.activityEndAt
									}
								},
								select: {
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
											name: true
										}
									},
									karsa: {
										select: {
											app: true
										}
									}
								},
								orderBy: {
									createdAt: 'desc'
								}
							}
						},
					} : Prisma.skip
				}
			}),
			params: {
				...queryParams,
				withBalance
			}
		}
	} catch (error) {
		console.log('actionGetUser', error)

		return {
			error: messageActionError(error)
		}
	}
};

export type ActionCreateUser = Awaited<ReturnType<typeof actionCreateUser>>;
export type ActionUpdateUser = Awaited<ReturnType<typeof actionUpdateUser>>;
export type ActionUpdateUserPassword = Awaited<ReturnType<typeof actionUpdateUserPassword>>;
export type ActionDeleteUser = Awaited<ReturnType<typeof actionDeleteUser>>;
export type ActionUpdateProfile = Awaited<ReturnType<typeof actionUpdateProfile>>;
export type ActionChangePassword = Awaited<ReturnType<typeof actionChangePassword>>;
