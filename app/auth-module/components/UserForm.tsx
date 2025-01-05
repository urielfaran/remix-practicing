import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client';
import { Form, useFetcher } from '@remix-run/react';
import { Loader2Icon } from 'lucide-react';
import { useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import FormInput, { FormInputProps } from './FormInput';
import { userCreateSchema, userUpdateSchema } from '../schemas/user.schema';
import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form as ShadForm,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';

// base user fields and their type extracted from the user type
type FormUser = Pick<
  User,
  'username' | 'password' | 'email' | 'isDisabled' | 'isSystemAdmin'
>;

// make add optional to the fields
type UserWithOptionalFields = {
  [K in keyof FormUser]: Exclude<FormUser[K], null> | undefined;
};

// utility type for a generic zod schema to be used as the schema passed in the props for adding additional fields
type GenericZodSchemaType = z.ZodObject<
  any,
  any,
  any,
  { [x: string]: any },
  { [x: string]: any }
>;

// base form props without the additional form fields
interface BaseFormProps<T extends GenericZodSchemaType> {
  additionalFieldsSchema?: T; // The Zod schema itself
  user?: User | null;
  create: boolean;
}

// the form props combined with the additional fields
type UserFormProps<
  D extends Record<string, any>,
  T extends GenericZodSchemaType,
> = BaseFormProps<T> & {
  [key in keyof D]: D[keyof D];
} & {
  additionalFieldsDefaultValues: Partial<{
    [key in keyof z.infer<T>]: z.infer<T>[key] | undefined;
  }>;
  fields?: FormInputProps[];
};

// base default values for the base form fields
const baseDefaultValues: UserWithOptionalFields = {
  username: undefined,
  password: undefined,
  email: undefined,
  isDisabled: false,
  isSystemAdmin: false,
};

/**
 * A form component used for creating or updating user details. It supports dynamic fields, Zod-based schema validation,
 * and can be configured to create or update a user based on the `create` flag.
 *
 * @template D - The type of additional fields' data.
 * @template T - The type of the Zod schema used for validation of additional fields.
 *
 * @param {UserFormProps<D, T>} props - The properties for the user form.
 * @param {User | null} [props.user] - The user data to populate the form for editing. If `null`, the form is used for creating a new user0.
 * @param {boolean} props.create - Determines whether the form is for creating (`true`) or updating (`false`) a user.
 * @param {FormInputProps[]} [props.fields] - An optional array of additional fields to display, along with their validation schema.
 * @param {T} [props.additionalFieldsSchema] - An optional Zod schema to validate additional dynamic fields.
 * @param {Partial<z.infer<T>>} props.additionalFieldsDefaultValues - Default values for the additional dynamic fields, if applicable.
 *
 * @returns {JSX.Element} The rendered user form with input fields for user information, including username, password, email,
 * and options for system admin and disabled status. It also includes dynamic fields based on the provided schema.
 *
 * @example
 * ```ts
 * <UserForm
 *   create={true}
 *   fields={[{ label: "Custom Field", name: "customField", type: "text" }]}
 *   additionalFieldsSchema={z.object({customField: z.string()})}
 *   additionalFieldsDefaultValues={{ customField: "Default Value" }}
 * />
 * ```
 */
function UserForm<
  D extends Record<string, any>,
  T extends GenericZodSchemaType,
>({
  user,
  create,
  fields = [],
  additionalFieldsSchema,
  additionalFieldsDefaultValues,
}: UserFormProps<D, T>) {
  const fetcher = useFetcher();
  const schema = create ? userCreateSchema : userUpdateSchema;
  const mergedSchema = additionalFieldsSchema
    ? schema.and(additionalFieldsSchema)
    : schema;
  const resolver = zodResolver(mergedSchema);

  const mergedDefaultValues = {
    ...baseDefaultValues,
    ...additionalFieldsDefaultValues,
  };
  const form = useRemixForm<z.infer<typeof mergedSchema>>({
    resolver,
    submitConfig: {
      method: 'POST',
    },
    defaultValues: user ?? mergedDefaultValues,
    submitData: {
      _action: user ? 'update' : 'create',
    },
    fetcher: fetcher,
  });
  const { isSubmitting } = form.formState;
  return (
    <ShadForm {...form}>
      <Form
        onSubmit={form.handleSubmit}
        className="flex w-full flex-col space-y-3 p-4"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>שם</FormLabel>
              <Input {...field} className="flex-grow" placeholder={'שם'} />
              <FormMessage />
            </FormItem>
          )}
        />
        {create && (
          <>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>סיסמה</FormLabel>
                  <Input
                    {...field}
                    className="flex-grow"
                    placeholder={'סיסמה'}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="generateSecret"
              defaultValue={true}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>generateSecret</FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>מייל</FormLabel>
              <Input
                {...field}
                value={field.value || undefined}
                className="flex-grow"
                placeholder={'מייל'}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isDisabled"
          defaultValue={true}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>לא פעיל</FormLabel>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isSystemAdmin"
          defaultValue={true}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>מנהל מערכת</FormLabel>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {additionalFieldsSchema
          ? fields.map((item) => (
              <FormField
                key={item.name as string}
                control={form.control}
                name={item.name as keyof z.infer<typeof mergedSchema>}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{item.label}</FormLabel>
                    <FormControl>
                      <FormInput
                        {...item}
                        {...field}
                        // todo add type casting to the correct value
                        value={field.value as any}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))
          : null}
        <Button
          variant="default"
          className="m-1 w-full"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              {create ? 'מוסיף משתמש' : 'מעדכן משתמש'}{' '}
              <span>
                <Loader2Icon className="animate-spin" />
              </span>
            </span>
          ) : create ? (
            'הוסף משתמש'
          ) : (
            'עדכן משתמש'
          )}
        </Button>
        <Button
          variant={'outline'}
          className="m-1 w-full"
          type="reset"
          onClick={() => {
            form.reset(mergedDefaultValues);
          }}
        >
          אפס
        </Button>
      </Form>
    </ShadForm>
  );
}

export default UserForm;
