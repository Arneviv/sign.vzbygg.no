import { z } from 'zod';

export const submissionSchema = z.object({
  text: z.string().min(3, 'Skriv litt mer.').max(10_000, 'For langt (max 10k tegn).'),
  // honeypot: bots fyller ofte skjulte felt
  website: z.string().optional()
});
