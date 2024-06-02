import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
} from '@nextui-org/react';
import { PlusIcon } from '../icons/PlusIcon';
import { SearchIcon } from '../icons/SearchIcon';
import { ChevronDownIcon } from '../icons/chv';
import { capitalize } from '/utils/utils';

const supplierColumns = [
  { id: 'id_supplier', label: 'ID' },
  { id: 'nama', label: 'Nama' },
  { id: 'email', label: 'Email' },
  { id: 'telepon', label: 'Telepon' },
  { id: 'alamat', label: 'Alamat' },
  { id: 'actions', label: 'Actions' },
];

const INITIAL_VISIBLE_COLUMNS = ['id_supplier', 'nama', 'email', 'telepon', 'alamat', 'actions'];

const SupplierTable = ({ data, onAddItemClick, onEditItemClick }) => {
  const [filterValue, setFilterValue] = useState('');
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [sortDescriptor, setSortDescriptor] = useState({ column: 'id_supplier', direction: 'ascending' });
  const [page, setPage] = useState(1);
  const [items, setItems] = useState(data || []);

  useEffect(() => {
    setItems(data);
  }, [data]);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    return supplierColumns.filter((column) => visibleColumns.has(column.id));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredData = [...items];
    if (hasSearchFilter) {
      filteredData = filteredData.filter((item) =>
        item.nama.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    return filteredData;
  }, [items, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...paginatedItems].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [sortDescriptor, paginatedItems]);

  const handleDelete = useCallback(async (id) => {
    try {
      const response = await fetch(`/api/suppliers?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setItems((prevItems) => prevItems.filter((item) => item.id_supplier !== id));
      } else {
        console.error('Failed to delete supplier');
      }
    } catch (error) {
      console.error('An error occurred while deleting the supplier:', error);
    }
  }, []);

  const renderCell = useCallback((item, columnKey) => {
    const cellValue = item[columnKey];
    switch (columnKey) {
      case 'actions':
        return (
          <div className="flex gap-2">
            <Button color="primary" onClick={() => onEditItemClick(item)}>
              Edit
            </Button>
            <Button color="error" onClick={() => handleDelete(item.id_supplier)}>
              Delete
            </Button>
          </div>
        );
      default:
        return cellValue;
    }
  }, [handleDelete, onEditItemClick]);

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback((e) => {
    const value = e.target.value;
    setRowsPerPage(value === 'all' ? filteredItems.length : Number(value));
    setPage(1);
  }, [filteredItems.length]);

  const onSearchChange = useCallback((value) => {
    setFilterValue(value);
    setPage(1);
  }, []);

  const onClear = useCallback(() => {
    setFilterValue('');
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
        <span className="flex items-center text-default-400 text-sm ml-auto mr-4">Total {items.length} suppliers</span>
        <Input
          isClearable
          className="w-full sm:w-auto flex-grow"
          placeholder="Search by name..."
          startContent={<SearchIcon />}
          value={filterValue}
          onClear={onClear}
          onValueChange={onSearchChange}
        />
        <Dropdown>
          <DropdownTrigger>
            <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
              Columns
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Table Columns"
            closeOnSelect={false}
            selectedKeys={visibleColumns}
            selectionMode="multiple"
            onSelectionChange={setVisibleColumns}
          >
            {supplierColumns.map((column) => (
              <DropdownItem key={column.id} className="capitalize">
                {capitalize(column.label)}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        <Button color="primary" onClick={onAddItemClick} startIcon={<PlusIcon />}>
          Add Supplier
        </Button>
        <div className="flex items-center text-default-400 text-sm ml-auto">
          <label className="flex items-center">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-sm ml-2"
              onChange={onRowsPerPageChange}
            >
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
              <option value="50">50</option>
              <option value="all">All</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [filterValue, visibleColumns, onRowsPerPageChange, items.length, onSearchChange]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === 'all'
            ? 'All items selected'
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Previous
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, filteredItems.length, page, pages]);

  return (
    <Table
      aria-label="Supplier table with custom cells, pagination, and sorting"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{ wrapper: 'max-h-[500px] overflow-auto' }}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.id}
            align={column.id === 'actions' ? 'center' : 'start'}
            allowsSorting={column.sortable}
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={'No suppliers found'} items={sortedItems}>
        {(item) => (
          <TableRow key={item.id_supplier}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default SupplierTable;
