"use client";

import * as React from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Columns3, GripVertical } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface AdvancedDataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  searchableColumnId?: string;
  initialVisibility?: VisibilityState;
  pageSizeOptions?: number[];
  initialPageSize?: number;
  withSelection?: boolean;
  getRowId?: (row: TData, index: number) => string;
  enableRowReorder?: boolean;
  onReorder?: (newData: TData[]) => void;
}

export function AdvancedDataTable<TData extends object, TValue = unknown>({
  data,
  columns,
  searchableColumnId,
  initialVisibility,
  pageSizeOptions = [5, 10, 20],
  initialPageSize = 5,
  withSelection = false,
  getRowId,
  enableRowReorder = false,
  onReorder,
}: AdvancedDataTableProps<TData, TValue>) {
  const uid = React.useId();
  const searchInputId = `${uid}-search`;
  const rowsPerPageId = `${uid}-rows-per-page`;
  const [localData, setLocalData] = React.useState<TData[]>(data);
  React.useEffect(() => {
    setLocalData(data);
  }, [data]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(initialVisibility || {});
  const [rowSelection, setRowSelection] = React.useState({});

  const selectionColumn: ColumnDef<TData> | null = withSelection
    ? {
        id: "select",
        header: ({ table }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="Select all"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
        size: 32,
      }
    : null;

  const dragColumn: ColumnDef<TData> | null = enableRowReorder
    ? {
        id: "drag",
        header: () => null,
        cell: () => null,
        enableSorting: false,
        enableHiding: false,
        size: 32,
      }
    : null;

  const table = useReactTable({
    data: enableRowReorder ? localData : data,
    columns: [selectionColumn, dragColumn, ...columns].filter(Boolean) as ColumnDef<TData, TValue>[],
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    getRowId,
    enableRowSelection: withSelection,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: initialPageSize } },
  });

  const searchValue = (table.getColumn(searchableColumnId || "")?.getFilterValue() as string) ?? "";

  // DnD setup
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const dataIds = React.useMemo(() => {
    return (enableRowReorder ? localData : data).map((row, index) => (getRowId ? getRowId(row, index) : String(index)));
  }, [enableRowReorder, localData, data, getRowId]);

  function handleDragEnd(event: DragEndEvent) {
    if (!enableRowReorder) return;
    const { active, over } = event;
    if (!active || !over || active.id === over.id) return;
    const oldIndex = dataIds.indexOf(String(active.id));
    const newIndex = dataIds.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;
    setLocalData((prev) => {
      const next = arrayMove(prev, oldIndex, newIndex);
      onReorder?.(next);
      return next;
    });
  }

  interface RowLike {
    id: string
    getIsSelected: () => boolean
    getVisibleCells: () => Array<{
      id: string
      column: { id: string; columnDef: unknown }
      getContext: () => unknown
    }>
  }

  function DraggableRow({ row }: { row: RowLike }) {
    const id = row.id as string;
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const style: React.CSSProperties = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
    return (
      <TableRow
        ref={setNodeRef}
        style={style}
        data-state={row.getIsSelected() && "selected"}
        data-dragging={isDragging}
        className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            {cell.column.id === "drag" ? (
              <Button variant="ghost" size="icon" className="text-muted-foreground size-7 hover:bg-transparent" {...attributes} {...listeners}>
                <GripVertical className="w-3 h-3" />
                <span className="sr-only">Drag to reorder</span>
              </Button>
            ) : (
              (() => {
                const colDef = cell.column.columnDef as { cell?: unknown };
                const renderer = (colDef.cell ?? null) as unknown;
                const ctx = cell.getContext() as unknown;
                return flexRender(renderer as never, ctx as never);
              })()
            )}
          </TableCell>
        ))}
      </TableRow>
    );
  }

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between gap-2">
        {searchableColumnId ? (
          <div className="flex items-center gap-2">
            <Label htmlFor={searchInputId} className="sr-only">Search</Label>
            <Input
              id={searchInputId}
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => table.getColumn(searchableColumnId)?.setFilterValue(e.target.value)}
              className="h-9 w-48"
            />
          </div>
        ) : <div />}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Columns3 className="w-4 h-4" />
                <span className="ml-2">Columns</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {table
                .getAllColumns()
                .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
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
      </div>

      <div className="rounded-lg border overflow-hidden">
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <Table>
            <TableHeader className="bg-muted">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                enableRowReorder ? (
                  <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DndContext>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-muted-foreground hidden text-sm lg:flex">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor={rowsPerPageId} className="text-sm font-medium">Rows per page</Label>
            <Select value={`${table.getState().pagination.pageSize}`} onValueChange={(value) => table.setPageSize(Number(value))}>
              <SelectTrigger size="sm" className="w-24" id={rowsPerPageId}>
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={`${size}`}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">First page</span>
            <ChevronsLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Previous page</span>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Next page</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Last page</span>
            <ChevronsRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}


