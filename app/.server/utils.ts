import { compare, hash } from 'bcryptjs';
import { ZodError } from 'zod';
import { Prisma } from '~generated/prisma/client';

export function hashCreds(password: string) {
	return hash(password, 10);
}

export function verifyCreds(password: string, hashSecret: string) {
	return compare(password, hashSecret);
}

export const valueOrSkip = <T>(value?: T | null | undefined): T | typeof Prisma.skip => {
	return value ?? Prisma.skip;
};

export const valueNullOrSkip = <T>(value?: T | null | undefined): T | null | typeof Prisma.skip => {
	if (typeof value === 'undefined') {
		return Prisma.skip;
	}

	return value ?? Prisma.skip;
};

export const messageActionError = (error: unknown) => {
	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		if (error.code === 'P2002') {
			return 'Email already in use'
		}
	}

	if (error instanceof ZodError) {
		return 'Payload invalid'
	}

	return 'Something went wrong'
};