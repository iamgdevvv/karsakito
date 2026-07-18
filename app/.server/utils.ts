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

	return value ?? null;
};

export const messageActionError = (error: unknown) => {
	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		if (error.code === 'P2002') {
			return 'Data dengan informasi yang sama sudah ada.';
		}

		if (error.code === 'P2025') {
			return 'Data tidak ditemukan.';
		}
	}

	if (error instanceof ZodError) {
		return 'Data yang dikirim tidak valid.';
	}

	if (typeof error === 'object' && error && 'cause' in error && typeof error.cause === 'string') {
		if (error.cause === 'user_not_found') {
			return 'Silakan masuk untuk melanjutkan.';
		}

		if (error.cause === 'user_not_active') {
			return 'Akun Anda tidak aktif.';
		}

		if (error.cause === 'user_not_authorized') {
			return 'Anda tidak memiliki akses untuk tindakan ini.';
		}

		if (error.cause === 'user_not_authorized_role') {
			return 'Anda tidak memiliki akses untuk tindakan ini.';
		}
	}

	return 'Terjadi kesalahan. Silakan coba lagi.';
};
