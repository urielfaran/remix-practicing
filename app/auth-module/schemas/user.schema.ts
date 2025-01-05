import { z } from 'zod';

/////////////////////////////////////////
// USER SCHEMA for validation
/////////////////////////////////////////
export const baseUserSchema = z.object({
  username: z.string(),
  email: z.string().nullable(),
  password: z.string(),
  isDisabled: z.boolean(),
  isEditor: z.boolean(),
  isSystemAdmin: z.boolean(),
});

export const userCreateSchema = z
  .object({ generateSecret: z.boolean() })
  .merge(baseUserSchema);

export const userUpdateSchema = z
  .object({ id: z.number() })
  .merge(baseUserSchema);
