import * as z from 'zod';
import { BalanceActivitySchema } from '~generated/prisma-zod/schemas/models';

export const PayloadUpdateBalanceSchema = BalanceActivitySchema.pick({
	description: true,
}).extend({
	token: z.coerce.number(),
	type: BalanceActivitySchema.shape.type.extract(['DAILY_BONUS', 'GIVEAWAY', 'PURCHASE']),
});

export type PayloadUpdateBalance = z.infer<typeof PayloadUpdateBalanceSchema>;
