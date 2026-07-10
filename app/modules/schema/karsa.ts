import * as z from 'zod';
import { KarsaSchema } from '~generated/prisma-zod/schemas/models';

export const KarsaSchemaPlain = KarsaSchema.omit({
	promptJson: true,
}).extend({
	promptJson: z.record(z.string(), z.unknown()).nullish(),
});
