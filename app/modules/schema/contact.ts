import * as z from 'zod';

export const PayloadContactSchema = z.object({
	name: z.string().nonempty(),
	email: z.email(),
	phone: z.union([z.string().nonempty(), z.number()]),
	organization: z.string().optional(),
	message: z.string().nonempty(),
});

export type PayloadContact = z.infer<typeof PayloadContactSchema>;
