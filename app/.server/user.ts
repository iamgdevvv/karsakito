import { type RouterContextProvider } from "react-router";
import { PayloadCreateUserSchema, PayloadDeleteUserSchema, PayloadUpdateProfilePasswordSchema, PayloadUpdateProfileSchema, PayloadUpdateUserPasswordSchema, PayloadUpdateUserSchema } from "~app-modules/schema/user";
import { prismaClient } from "~app-server/context";
import { authMiddlewareSession } from "~app-server/session";
import { hashCreds, messageActionError, valueOrSkip, verifyCreds } from "~app-server/utils";

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
				error: 'Unauthorized'
			}
		}

		const formData = await request.formData()
		const body = PayloadCreateUserSchema.parse(Object.fromEntries(formData))

		const { password, ...payload } = body;

		const hash = await hashCreds(password);

		const resultUser = await prismaClient(context).user.create({
			data: {
				...payload,
				auth: {
					create: {
						hash
					}
				}
			},
			select: {
				id: true
			}
		})

		return {
			data: resultUser
		}
	} catch (error) {
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
				error: 'Unauthorized'
			}
		}

		const formData = await request.formData()
		const body = PayloadUpdateUserSchema.parse(Object.fromEntries(formData))

		const resultUser = await prismaClient(context).user.update({
			where: {
				id: body.userId
			},
			data: {
				name: valueOrSkip(body.name),
				email: valueOrSkip(body.email),
				role: valueOrSkip(body.role),
				isActive: valueOrSkip(body.isActive),
			},
			select: {
				id: true
			}
		})

		return {
			data: resultUser
		}
	} catch (error) {
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
				error: 'Unauthorized'
			}
		}

		const formData = await request.formData()
		const body = PayloadUpdateUserPasswordSchema.parse(Object.fromEntries(formData))

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
		return {
			error: messageActionError(error)
		}
	}
};

export const actionDeleteUser = async ({
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
				error: 'Unauthorized'
			}
		}

		const formData = await request.formData()
		const body = PayloadDeleteUserSchema.parse(Object.fromEntries(formData))

		const resultUser = await prismaClient(context).user.delete({
			where: {
				id: body.userId
			},
			select: {
				id: true
			}
		})

		return {
			data: resultUser
		}
	} catch (error) {
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
				error: 'Unauthorized'
			}
		}

		const userId = authSession.user.id

		const formData = await request.formData()
		const body = PayloadUpdateProfileSchema.parse(Object.fromEntries(formData))

		const resultUser = await prismaClient(context).user.update({
			where: {
				id: userId
			},
			data: {
				name: valueOrSkip(body.name),
				email: valueOrSkip(body.email),
			},
			select: {
				id: true
			}
		})

		return {
			data: resultUser
		}
	} catch (error) {
		return {
			error: messageActionError(error)
		}
	}
};

export const actionUserProfilePassword = async ({
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
				error: 'Unauthorized'
			}
		}

		const userId = authSession.user.id

		const formData = await request.formData()
		const body = PayloadUpdateProfilePasswordSchema.parse(Object.fromEntries(formData))

		const { password, curentPassword, confirmPassword } = body;

		if (password !== confirmPassword) {
			return {
				error: 'Confirm password incorrect'
			}
		}

		const authRecord = await prismaClient(context).auth.findUnique({
			where: {
				userId
			},
			select: {
				hash: true
			}
		})

		if (!authRecord) {
			return {
				error: 'User oauth without password'
			}
		}

		const credValid = await verifyCreds(curentPassword, authRecord.hash);

		if (!credValid) {
			return {
				error: 'Current password incorrect'
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
export type ActionUserProfilePassword = Awaited<ReturnType<typeof actionUserProfilePassword>>;