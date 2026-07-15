import dayjs from 'dayjs';
import dayjsTimezone from 'dayjs/plugin/timezone';
import dayjsUTC from 'dayjs/plugin/utc';
import { amountTokenDaily } from '~app-modules/enum-options';
import { cfContext, prismaClient } from '~app-server/context';
import { messageActionError } from '~app-server/utils';

import type { Route } from './+types/cron.refill-dailytoken';

dayjs.extend(dayjsUTC);
dayjs.extend(dayjsTimezone);

export async function loader({ context, request }: Route.LoaderArgs) {
	try {
		if (request.headers.get('Authorization') !== cfContext(context).env.API_AI_KEY) {
			throw new Error('Unauthorized');
		}

		const prisma = prismaClient(context);

		const uniqueTimezones = await prisma.user.findMany({
			select: { timezone: true },
			distinct: ['timezone'],
		});

		console.log({ uniqueTimezones });

		const targetTimezones = uniqueTimezones
			.map((u) => u.timezone)
			.filter((tz) => {
				try {
					return dayjs().tz(tz).hour() === 0;
				} catch (e) {
					console.error(`Invalid timezone in DB: ${tz}`, e);
					return false;
				}
			});

		console.log({ targetTimezones });

		if (targetTimezones.length === 0) {
			console.log('Tidak ada timezone yang sedang tengah malam. Skip refill.');

			return {
				result: 'Tidak ada timezone yang sedang tengah malam. Skip refill',
			};
		}

		const targetUsers = await prisma.user.findMany({
			where: {
				timezone: {
					in: targetTimezones,
				},
				balances: {
					tokenDaily: {
						lt: amountTokenDaily,
					},
				},
			},
			select: {
				id: true,
				balances: {
					select: {
						tokenDaily: true,
					},
				},
			},
		});

		console.log({ targetUsers });

		const transactions = [];

		for (const user of targetUsers) {
			const balance = user.balances;

			if (!balance) continue;

			const addedDailyToken = amountTokenDaily - balance.tokenDaily;

			const updateBalance = prisma.balance.update({
				where: {
					userId: user.id,
				},
				data: {
					tokenDaily: amountTokenDaily,
					activities: {
						create: {
							type: 'DAILY_BONUS',
							token: addedDailyToken,
							tokenDailyBefore: balance.tokenDaily,
							tokenDailyAfter: amountTokenDaily,
						},
					},
				},
			});

			transactions.push(updateBalance);
		}

		// PENTING: Cloudflare D1 memiliki batas limit statement per transaksi (biasanya ~1000).
		// Jika data sangat besar, lakukan pemotongan chunk per 100 user (200 query).
		if (transactions.length) {
			const CHUNK_SIZE = 100;
			for (let i = 0; i < transactions.length; i += CHUNK_SIZE) {
				const chunk = transactions.slice(i, i + CHUNK_SIZE);
				await prisma.$transaction(chunk);
			}
		}

		console.log(`Berhasil melakukan refill daily token untuk ${transactions.length} users.`);

		return {
			result: `Berhasil melakukan refill daily token untuk ${transactions.length} users.`,
		};
	} catch (error) {
		console.error('Error saat menjalankan refillToken:', error);

		// oxlint-disable-next-line preserve-caught-error
		throw new Error(messageActionError(error));
	}
}
