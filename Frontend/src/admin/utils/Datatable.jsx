import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Input } from "@admin/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@admin/components/ui/table";
import { useState } from "react";
import { Button } from "@admin/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@admin/components/ui/dropdown-menu";
import { useIsMobile } from "@admin/hooks/use-mobile";

const ACTION_KEYS = new Set(["actions", "action"]);

function isActionsColumn(column) {
  const id = column.id ?? column.columnDef?.accessorKey;
  return ACTION_KEYS.has(id);
}

function getHeaderLabel(column) {
  const header = column.columnDef?.header;
  if (typeof header === "string") return header;
  return column.id;
}

export function DataTable({
  columns,
  data,
  filterColumnId,
  filterPlaceholder = "Search...",
}) {
  const isMobile = useIsMobile();
  const [columnVisibility, setColumnVisibility] = useState({});
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const resolvedFilterId =
    filterColumnId ??
    (table.getColumn("title")
      ? "title"
      : table.getColumn("name")
        ? "name"
        : null);
  const filterColumn = resolvedFilterId ? table.getColumn(resolvedFilterId) : null;
  const rows = table.getRowModel().rows;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 py-4">
        {filterColumn && (
          <Input
            placeholder={filterPlaceholder}
            value={filterColumn.getFilterValue() ?? ""}
            onChange={(event) => filterColumn.setFilterValue(event.target.value)}
            className="w-full sm:max-w-sm"
          />
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="sm:ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isMobile ? (
        <div className="space-y-3">
          {rows.length ? (
            rows.map((row) => {
              const cells = row.getVisibleCells();
              const dataCells = cells.filter((c) => !isActionsColumn(c.column));
              const actionCells = cells.filter((c) => isActionsColumn(c.column));
              return (
                <div
                  key={row.id}
                  className="rounded-lg border bg-card p-4 shadow-sm"
                >
                  <dl className="space-y-2">
                    {dataCells.map((cell) => (
                      <div
                        key={cell.id}
                        className="flex items-start justify-between gap-3 text-sm"
                      >
                        <dt className="text-muted-foreground text-xs uppercase tracking-wide shrink-0 pt-1">
                          {getHeaderLabel(cell.column)}
                        </dt>
                        <dd className="text-right break-words font-medium">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  {actionCells.length > 0 && (
                    <div className="mt-3 flex justify-end gap-2 border-t pt-3">
                      {actionCells.map((cell) => (
                        <div key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="rounded-md border p-6 text-center text-sm text-muted-foreground">
              No results.
            </div>
          )}
        </div>
      ) : (
        <div className="w-full overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {rows.length ? (
                rows.map((row) => (
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
                    colSpan={columns?.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
