import { Form, useFetcher } from '@remix-run/react';
import { ColumnDef } from '@tanstack/react-table';
import { Lock, QrCode, Trash } from 'lucide-react';
import { ComponentType } from 'react';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog';
import EditDialog from './EditDialog';
import ResetPassword from './ResetPassword';
import { User } from '@prisma/client';

export type UserWithQrCode = User & { qrCode: string | null };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface ActionColumnsProps<TData, C extends ComponentType<any>> {
  FormComponent: C;
  formComponentProps: React.ComponentProps<C>;
  typeName: keyof React.ComponentProps<C>;
  idColName: keyof TData;
}

// generic actions to take care the following operations
// create
// edit
export const actionColumns = <TData, C extends ComponentType<any>>({
  FormComponent,
  formComponentProps,
  typeName,
  idColName,
}: ActionColumnsProps<TData, C>): ColumnDef<TData>[] => [
  {
    accessorKey: 'select',
    header: '',
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const fetcher = useFetcher();
      const rowId = row.original[idColName] as string | number;
      const removeRow = () => {
        fetcher.submit({ id: rowId, _action: '"delete"' }, { method: 'POST' });
      };

      const additionalFromProps: React.ComponentProps<C> = {
        ...formComponentProps,
        [typeName]: row.original,
      } as React.ComponentProps<C>;

      return (
        <div className="flex justify-center">
          <EditDialog
            FormComponent={FormComponent}
            formComponentProps={additionalFromProps}
          />
          <Button
            key="delete"
            variant={'ghost'}
            onClick={removeRow}
            className="rounded-full"
          >
            <Trash />
          </Button>
        </div>
      );
    },
    size: 100,
  },
];

/**
 * Generates column definitions for the users table, including additional columns
 * passed as an argument. This function defines how user data is displayed and
 * provides interactive actions, such as resetting passwords and generating secrets.
 *
 * @param {ColumnDef<UserWithQrCode>[]} additionalColumns - An array of additional columns
 *        to be included in the table. These columns will be merged with the predefined
 *        user columns.
 *
 * @returns {ColumnDef<UserWithQrCode>[]} - Returns an array of column definitions
 *          for the table. This includes predefined columns like username, email,
 *          password reset, and secret generation, as well as any additional columns
 *          passed in the `additionalColumns` argument.
 *
 * @example
 * ```ts
 * const columns = usersColumns([
 *   {
 *     accessorKey: "customColumn",
 *     header: "Custom Header",
 *     cell: ({ cell }) => <span>{cell.getValue()}</span>,
 *   }
 * ]);
 * ```
 */
export function usersColumns(
  additionalColumns: ColumnDef<UserWithQrCode>[],
): ColumnDef<UserWithQrCode>[] {
  return [
    ...additionalColumns,
    {
      accessorKey: 'username',
      header: 'שם',
    },
    {
      accessorKey: 'email',
      header: 'מייל',
    },
    {
      accessorKey: 'password',
      header: 'סיסמה',
      cell: ({ row }) => {
        return (
          <Dialog>
            <DialogTrigger asChild>
              <div className="flex flex-row">
                <Lock />
                <p className="ms-3">אפס סיסמה</p>
              </div>
            </DialogTrigger>
            <DialogContent>
              <ResetPassword id={row.original.id} />
            </DialogContent>
          </Dialog>
        );
      },
      size: 100,
    },
    {
      accessorKey: 'isSystemAdmin',
      header: 'עורך',
      cell: ({ cell }) => {
        return JSON.stringify(cell.getValue());
      },
    },
    {
      accessorKey: 'isDisabled',
      header: 'משתמש מושבת',
      cell: ({ cell }) => {
        return JSON.stringify(cell.getValue());
      },
    },
    {
      accessorKey: 'id',
      header: 'צור secret',
      cell: ({ cell }) => {
        return (
          <Form method="post">
            <input
              type="text"
              hidden
              readOnly
              value={JSON.stringify(`${cell.getValue()}`)}
              name="id"
            />
            <Button
              type="submit"
              name="_action"
              value={JSON.stringify('generate-secret')}
            >
              genererate secret
            </Button>
          </Form>
        );
      },
    },
    {
      accessorKey: 'secret',
      header: 'קוד סודי',
      cell: ({ row }) => {
        return (
          <Dialog>
            <DialogTrigger asChild>
              <div className="flex flex-row">
                <QrCode /> <p className="ms-3">ברקוד</p>
              </div>
            </DialogTrigger>
            <DialogContent className="w-fit">
              {row.original.qrCode ? (
                <img
                  src={row.original.qrCode}
                  alt="Scan QR code to set up 2FA"
                />
              ) : (
                <span>2fa is not set</span>
              )}
            </DialogContent>
          </Dialog>
        );
      },
      size: 100,
    },
  ];
}
