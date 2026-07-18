import { replace, type RouterContextProvider } from "react-router";
import { amountTokenDaily } from "~app-modules/enum-options";
import { PayloadLoginSchema, PayloadRegisterSchema } from "~app-modules/schema/auth";
import { parseFormData } from "~app-modules/utils";
import { prismaClient } from "~app-server/context";
import { authGetSession, authLoginSession } from "~app-server/session";
import { hashCreds, messageActionError, verifyCreds } from "~app-server/utils";

export const actionLogin = async ({
	request,
	context
}: {
	request: Request
	context: Readonly<RouterContextProvider>
}) => {
	try {
		const formData = await request.formData()
		const body = PayloadLoginSchema.parse(parseFormData(formData))

		const { password, _redirect, ...payload } = body;

		const recordUser = await prismaClient(context).user.findUniqueOrThrow({
			where: {
				email: payload.email
			},
			include: {
				auth: {
					select: {
						hash: true
					}
				}
			}
		});

		const { auth, ...user } = recordUser

		if (!user.isActive) {
			return {
				error: 'Akun ini tidak aktif.'
			}
		}

		if (!auth) {
			return {
				error: 'Akun ini menggunakan metode masuk lain.'
			}
		}

		const credValid = await verifyCreds(password, auth.hash);

		if (!credValid) {
			return {
				error: 'Email atau kata sandi tidak sesuai.'
			}
		}

		const authSession = await authGetSession(request);

		authSession.set('user', user);

		let redirectUrl = _redirect || new URL(request.url).searchParams.get('redirect');

		return replace(redirectUrl || '/', {
			headers: {
				'Set-Cookie': await authLoginSession(authSession),
			},
		});
	} catch (error) {
		console.log('actionLogin', error)

		return {
			error: messageActionError(error)
		}
	}
};

export const actionRegister = async ({
	request,
	context
}: {
	request: Request
	context: Readonly<RouterContextProvider>
}) => {
	try {
		const formData = await request.formData()
		const body = PayloadRegisterSchema.parse(parseFormData(formData))

		const { password, ...payload } = body;

		const hash = await hashCreds(password);

		const resultUser = await prismaClient(context).user.create({
			data: {
				...payload,
				isActive: true,
				role: 'CUSTOMER',
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
				id: true
			}
		})

		return {
			data: resultUser
		}
	} catch (error) {
		console.log('actionRegister', error)

		return {
			error: messageActionError(error)
		}
	}
};

export type ActionLogin = Awaited<ReturnType<typeof actionLogin>>;
export type ActionRegister = Awaited<ReturnType<typeof actionRegister>>;
