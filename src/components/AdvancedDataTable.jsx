import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  TextField,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useTheme,
  useMediaQuery,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import {
  MoreVert,
  Search,
  ViewColumn,
  DragIndicator
} from '@mui/icons-material';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender
} from '@tanstack/react-table';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import {
  CSS
} from '@dnd-kit/utilities';
import React, { useState, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

// Компонент для перетаскиваемой колонки
function DraggableTableCell({ column, children, ...props }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableCell
      ref={setNodeRef}
      style={style}
      {...props}
      sx={{
        position: 'relative',
        ...props.sx
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton
          size="small"
          {...attributes}
          {...listeners}
          sx={{ cursor: 'grab', p: 0.5 }}
        >
          <DragIndicator fontSize="small" />
        </IconButton>
        {children}
      </Box>
    </TableCell>
  );
}

export default function AdvancedDataTable({
  data = [],
  columns: initialColumns = [],
  loading = false,
  totalCount = 0,
  page = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onSearchChange,
  searchValue = '',
  actions = [],
  selectable = false,
  onSelectionChange,
  virtualScrolling = false,
  fixedFirstColumn = false,
  title,
  ...props
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [columnOrder, setColumnOrder] = useState(() =>
    initialColumns.map(col => col.id || col.accessorKey)
  );
  const [columnVisibility, setColumnVisibility] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Пересортировка колонок согласно порядку
  const orderedColumns = useMemo(() => {
    const columnMap = new Map(initialColumns.map(col => [col.id || col.accessorKey, col]));
    return columnOrder.map(id => columnMap.get(id)).filter(Boolean);
  }, [initialColumns, columnOrder]);

  // Добавляем колонку для actions если есть
  const columns = useMemo(() => {
    let cols = [...orderedColumns];

    // Колонка выбора
    if (selectable) {
      cols.unshift({
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
        size: 50,
        enableSorting: false,
        enableHiding: false
      });
    }

    // Колонка действий
    if (actions.length > 0) {
      cols.push({
        id: 'actions',
        header: 'Действия',
        cell: ({ row }) => (
          <Box>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setAnchorEl({ element: e.currentTarget, row: row.original });
              }}
            >
              <MoreVert />
            </IconButton>
          </Box>
        ),
        size: 80,
        enableSorting: false,
        enableHiding: false
      });
    }

    return cols;
  }, [orderedColumns, actions, selectable]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount: Math.ceil(totalCount / pageSize),
    state: {
      pagination: {
        pageIndex: page,
        pageSize: pageSize,
      },
      columnVisibility,
      globalFilter: searchValue,
      rowSelection: Object.fromEntries(
        Array.from(selectedRows).map(id => [id, true])
      ),
    },
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: (updater) => {
      const newSelection = typeof updater === 'function'
        ? updater(Object.fromEntries(Array.from(selectedRows).map(id => [id, true])))
        : updater;

      const newSelectedRows = new Set(Object.keys(newSelection).filter(key => newSelection[key]));
      setSelectedRows(newSelectedRows);

      if (onSelectionChange) {
        onSelectionChange(Array.from(newSelectedRows));
      }
    },
    enableRowSelection: selectable,
  });

  // Виртуализация для больших таблиц
  const parentRef = React.useRef();
  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 53, // Примерная высота строки
    enabled: virtualScrolling && data.length > 100,
  });

  // Drag and Drop для колонок
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setColumnOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleActionClick = (action, row) => {
    setAnchorEl(null);
    if (action.onClick) {
      action.onClick(row);
    }
  };

  const handleSearchChange = (event) => {
    if (onSearchChange) {
      onSearchChange(event.target.value);
    }
  };

  const handleSortingChange = (column) => {
    if (onSortChange && column.getCanSort()) {
      const currentSort = column.getIsSorted();
      let newSort = 'asc';

      if (currentSort === 'asc') newSort = 'desc';
      if (currentSort === 'desc') newSort = false;

      onSortChange({
        id: column.id,
        desc: newSort === 'desc'
      });
    }
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Заголовок и поиск */}
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        {title && (
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Поиск..."
            value={searchValue}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{ minWidth: 200 }}
          />

          <IconButton
            onClick={(e) => setAnchorEl({ element: e.currentTarget, type: 'columns' })}
            title="Настройка колонок"
          >
            <ViewColumn />
          </IconButton>
        </Box>
      </Box>

      {/* Таблица */}
      <TableContainer
        ref={virtualScrolling ? parentRef : null}
        sx={{
          maxHeight: virtualScrolling ? 600 : 'none',
          overflowX: isMobile ? 'auto' : 'hidden'
        }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <Table
            stickyHeader={virtualScrolling}
            sx={{
              minWidth: isMobile ? 800 : 'auto',
              '& .MuiTableCell-root:first-of-type': fixedFirstColumn && isMobile ? {
                position: 'sticky',
                left: 0,
                backgroundColor: theme.palette.background.paper,
                zIndex: 1,
                borderRight: `1px solid ${theme.palette.divider}`
              } : {}
            }}
          >
            <TableHead>
              <TableRow>
                <SortableContext
                  items={columnOrder}
                  strategy={verticalListSortingStrategy}
                >
                  {table.getHeaderGroups().map(headerGroup =>
                    headerGroup.headers.map(header => {
                      const canSort = header.column.getCanSort();
                      const sorted = header.column.getIsSorted();

                      return (
                        <DraggableTableCell
                          key={header.id}
                          column={header.column}
                          sx={{
                            fontWeight: 'bold',
                            backgroundColor: theme.palette.grey[50],
                            minWidth: header.column.columnDef.size || 120
                          }}
                        >
                          {canSort ? (
                            <TableSortLabel
                              active={!!sorted}
                              direction={sorted || 'asc'}
                              onClick={() => handleSortingChange(header.column)}
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                            </TableSortLabel>
                          ) : (
                            flexRender(header.column.columnDef.header, header.getContext())
                          )}
                        </DraggableTableCell>
                      );
                    })
                  )}
                </SortableContext>
              </TableRow>
            </TableHead>

            <TableBody>
              {virtualScrolling && data.length > 100 ? (
                // Виртуализированные строки
                virtualizer.getVirtualItems().map((virtualRow) => {
                  const row = table.getRowModel().rows[virtualRow.index];
                  return (
                    <TableRow
                      key={row.id}
                      data-index={virtualRow.index}
                      ref={(node) => virtualizer.measureElement(node)}
                      sx={{
                        height: virtualRow.size,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      {row.getVisibleCells().map(cell => (
                        <TableCell
                          key={cell.id}
                          sx={{
                            minWidth: cell.column.columnDef.size || 120,
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              ) : (
                // Обычные строки
                table.getRowModel().rows.map(row => (
                  <TableRow
                    key={row.id}
                    hover
                    selected={row.getIsSelected()}
                    sx={{ cursor: selectable ? 'pointer' : 'default' }}
                    onClick={() => selectable && row.toggleSelected()}
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell
                        key={cell.id}
                        sx={{
                          minWidth: cell.column.columnDef.size || 120,
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}

              {data.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      Нет данных для отображения
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {loading && (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      Загрузка...
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DndContext>
      </TableContainer>

      {/* Пагинация */}
      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={(_, newPage) => onPageChange?.(newPage)}
        rowsPerPage={pageSize}
        onRowsPerPageChange={(e) => onPageSizeChange?.(parseInt(e.target.value, 10))}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        labelRowsPerPage="Строк на странице:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} из ${count !== -1 ? count : `более ${to}`}`
        }
      />

      {/* Меню действий */}
      <Menu
        anchorEl={anchorEl?.element}
        open={Boolean(anchorEl?.element && anchorEl?.type !== 'columns')}
        onClose={() => setAnchorEl(null)}
        onClick={() => setAnchorEl(null)}
      >
        {actions.map((action, index) => (
          <MenuItem
            key={index}
            onClick={() => handleActionClick(action, anchorEl?.row)}
            disabled={action.disabled?.(anchorEl?.row)}
          >
            {action.icon && <Box sx={{ mr: 2, display: 'flex' }}>{action.icon}</Box>}
            {action.label}
          </MenuItem>
        ))}
      </Menu>

      {/* Меню настройки колонок */}
      <Menu
        anchorEl={anchorEl?.element}
        open={Boolean(anchorEl?.element && anchorEl?.type === 'columns')}
        onClose={() => setAnchorEl(null)}
      >
        <Box sx={{ p: 2, minWidth: 200 }}>
          <Typography variant="subtitle2" gutterBottom>
            Видимость колонок
          </Typography>
          {table.getAllLeafColumns()
            .filter(column => column.getCanHide())
            .map(column => (
              <FormControlLabel
                key={column.id}
                control={
                  <Checkbox
                    checked={column.getIsVisible()}
                    onChange={column.getToggleVisibilityHandler()}
                  />
                }
                label={column.columnDef.header}
                sx={{ display: 'block' }}
              />
            ))}
        </Box>
      </Menu>
    </Paper>
  );
}
