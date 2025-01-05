import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@remix-run/react';
import { useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form as ShadForm,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { resetPasswordFormSchema } from '../schemas/password.schema';

interface IChangePassword {
  id: number | undefined;
}

const resolver = zodResolver(resetPasswordFormSchema);
type ResetPasswordType = z.infer<typeof resetPasswordFormSchema>;

/**
 * `ResetPassword` is a form component used to allow users to reset their password.
 * It renders a form with two input fields: one for the new password and another to confirm the new password.
 * The form is submitted to an API endpoint, and validation is handled using Zod.
 *
 * @param {IChangePassword} props - The component props.
 * @param {number | undefined} props.id - The user ID for which the password is being reset. 
 *        It is required for the form submission.
 * 
 * @returns The rendered ResetPassword form component.
 * 
 * @example
 * ```tsx
 * <ResetPassword id={userId} />
 * ```
 */
function ResetPassword({ id }: IChangePassword) {
  const form = useRemixForm<ResetPasswordType>({
    resolver,
    submitData: {
      userId: id,
    },
    submitConfig: {
      method: 'POST',
      action: '/api/password-reset',
      navigate: false,
    },
    defaultValues: {
      newPassword: undefined,
      newPasswordRepeat: undefined,
    },
  });

  const { isSubmitting, errors } = form.formState;

  return (
    <div className="flex flex-col gap-5">
      <ShadForm {...form}>
        <Form onSubmit={form.handleSubmit} className="flex flex-col space-y-5">
          <p>על מנת לשנות את סיסמתך אנא הכנס את הסיסמה החדשה</p>
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{'הכנס סיסמה חדשה'}</FormLabel>
                <Input
                  {...field}
                  className="flex-grow"
                  placeholder={'הכנס סיסמה חדשה'}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPasswordRepeat"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{'הכנס סיסמה חדשה בשנית'}</FormLabel>
                <Input
                  {...field}
                  className="flex-grow"
                  placeholder={'הכנס סיסמה חדשה בשנית'}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button variant="default" type="submit">
            {isSubmitting ? (
              <span>
                שנה סיסמה<span className="animate-spin">...</span>
              </span>
            ) : (
              'שנה סיסמה'
            )}
          </Button>
        </Form>
      </ShadForm>
    </div>
  );
}

export default ResetPassword;
