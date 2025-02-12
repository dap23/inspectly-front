import * as z from 'zod';

export const UpdateTitleSchema = z.object({
  title: z.string().min(1, {message: 'Title is required'})
});

export type UpdateTitleDto = z.infer<typeof UpdateTitleSchema>