import { z } from "zod";
/////////////////////////////////////////
// reset password SCHEMA for validation
/////////////////////////////////////////
export const resetPasswordBaseSchema = z.object({
  newPassword: z
    .string({ required_error: "required_value" })
    .min(8, "password_must_be_8_charts"),
  newPasswordRepeat: z
    .string({ required_error: "required_value" })
    .min(8, "password_must_be_8_charts"),
});

export const resetPasswordFormSchema = resetPasswordBaseSchema
  .merge(z.object({}))
  .refine((data) => data.newPassword === data.newPasswordRepeat, {
    message: "passwords_not_identical",
    path: ["newPasswordRepeat"],
  });
