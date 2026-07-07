import * as z from 'zod';

export const KarsaAppsNameSchema = z.enum(['pidato', 'pantun', 'syair', 'puisi', 'hymne', 'ceritapendek', 'ceritapanjang', 'doabersama', 'petuah', 'tagline', 'slogan', 'motto', 'tekateki', 'parafrase', 'adaptasidialek', 'rangkuman', 'analisakalimat', 'analisadokumen', 'terjemahankalimat', 'terjemahandokumen', 'peribahasa', 'adatistiadat', 'sejarah', 'artefak'])

export type KarsaAppsName = z.infer<typeof KarsaAppsNameSchema>;