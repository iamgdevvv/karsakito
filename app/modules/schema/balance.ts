import * as z from 'zod';
import { BalanceActivitySchema } from '~generated/prisma-zod/schemas/models';

export const PayloadQueryBalanceUserSchema = z.object({
	activityStartAt: z.union([z.coerce.date(), z.date()]).nullish(),
	activityEndAt: z.union([z.coerce.date(), z.date()]).nullish(),
});

export const PayloadUpdateBalanceSchema = BalanceActivitySchema.pick({
	description: true,
}).extend({
	token: z.coerce.number(),
	type: BalanceActivitySchema.shape.type.extract(['DAILY_BONUS', 'GIVEAWAY', 'PURCHASE']),
});

export type PayloadQueryBalanceUser = z.infer<typeof PayloadQueryBalanceUserSchema>;
export type PayloadUpdateBalance = z.infer<typeof PayloadUpdateBalanceSchema>;
