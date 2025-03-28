import {
  ColumnDef,
  Row,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { buttonVariants } from "~/components/ui/button";
import { setSearchParamsString } from "~/auth-module/utils";
import { Link, useSearchParams } from "react-router";

interface ItemsDataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  totalRowCount: number;
  idColName: keyof TData;
}

/**
 * A generic table component for displaying data with pagination. It is designed to be flexible
 * and can work with any data type (TData) by passing the appropriate columns and data. 
 * This component uses the `@tanstack/react-table` library for efficient table rendering and supports 
 * dynamic pagination. The table also includes functionality for rendering row and column data 
 * based on the provided column definitions.
 * 
 * @template TData - The type of data to be displayed in the table.
 * @template TValue - The type for individual values of each column.
 * 
 * @param {ItemsDataTableProps<TData, TValue>} props - The properties for configuring the table.
 * 
 * @param {TData[]} props.data - An array of data to be displayed in the table.
 * @param {ColumnDef<TData, TValue>[]} props.columns - An array of column definitions for rendering table headers and cells.
 * @param {number} props.totalRowCount - The total number of rows available for pagination.
 * @param {string} props.idColName - The name of the column to be used as the unique identifier for each row.
 * 
 * @returns {JSX.Element} - A table component displaying the given data with pagination controls.
 * 
 */
function UsersTable<TData, TValue>({
  data,
  columns,
  totalRowCount,
  idColName,
}: ItemsDataTableProps<TData, TValue>) {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 0;
  const pageSize = 8;
  const pageIndex = 0;
  const maxPage = Math.floor(totalRowCount / 8);

  const getRowId = (row: TData, relativeIndex: number, parent?: Row<TData>) => {
    // In row object you have access to data.
    // Yon choose parameter. In this example I used uniqueId
    // return parent ? [parent.id, row.id].join('.') : row.id.toString();
    return parent
      ? [parent.original[idColName], row[idColName]].join(".")
      : typeof row[idColName] === "number"
      ? row[idColName].toString()
      : (row[idColName] as string);
  };

  const table = useReactTable({
    data,
    columns,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize,
        pageIndex,
      },
    },
    meta: {
      removeRow: (rowIndex: number) => {
        const setFilterFunc = (old: TData[]) =>
          old.filter((_row: TData, index: number) => index !== rowIndex);
      },
      setEditRowId: (id: number) => {},
    },
  });

  return (
    <div>
      <div className="h-full rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  אין תוצאות
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-auto flex items-center justify-end space-x-2 py-4">
        <div className="mt-auto flex-1 text-sm text-muted-foreground">
          <p>
            עמוד {totalRowCount === 0 ? 0 : page + 1} מתוך{" "}
            {totalRowCount % pageSize !== 0
              ? Math.floor(totalRowCount / pageSize) + 1
              : Math.floor(totalRowCount / pageSize)}
          </p>
          בקשות {totalRowCount !== 0 ? page * 8 + 1 : 0} -{" "}
          {Math.min((page + 1) * 8, totalRowCount)} מתוך {totalRowCount}
        </div>
        <Link
          className={buttonVariants({ variant: "outline" })}
          prefetch="intent"
          preventScrollReset
          to={{
            search: setSearchParamsString(searchParams, {
              page: Math.max(page - 1, 0),
            }),
          }}
        >
          הקודם
        </Link>
        <Link
          className={buttonVariants({ variant: "outline" })}
          prefetch="intent"
          preventScrollReset
          to={{
            search: setSearchParamsString(searchParams, {
              page: Math.min(page + 1, maxPage),
            }),
          }}
        >
          הבא
        </Link>
      </div>
    </div>
  );
}

export default UsersTable;
