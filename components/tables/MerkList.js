// components/tables/MerkTable.js
import React, { useMemo, useCallback, useState, useEffect } from "react";
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
} from "@nextui-org/react";
import { PlusIcon } from "../icons/PlusIcon";
import { VerticalDotsIcon } from "../icons/vertical";
import { SearchIcon } from "../icons/SearchIcon";
import { ChevronDownIcon } from "../icons/chv";
import { capitalize } from "/utils/utils";

const MerkTable = ({ data = [], onAddItemClick, onDeleteItem, onEditItemClick }) => {
  const [filterValue, setFilterValue] = useState("");
  const [sortDescriptor, setSortDescriptor] = useState({ column: "nama", direction: "ascending" });
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [page, setPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState(new Set(["id_merk", "nama", "actions"]));
  const [tableData, setTableData] = useState(data);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const merkColumns = useMemo(() => [
    { id: "id_merk", label: "ID", sortable: true },
    { id: "nama", label: "Name", sortable: true },
    { id: "actions", label: "Actions", sortable: false },
  ], []);

  const filteredItems = useMemo(() => {
    return tableData.filter(item => item.nama?.toLowerCase().includes(filterValue.toLowerCase()));
  }, [tableData, filterValue]);

  const sortedItems = useMemo(() => {
    return filteredItems.sort((a, b) => {
      if (sortDescriptor.direction === "ascending") {
        return a[sortDescriptor.column] > b[sortDescriptor.column] ? 1 : -1;
      } else {
        return a[sortDescriptor.column] < b[sortDescriptor.column] ? 1 : -1;
      }
    });
  }, [filteredItems, sortDescriptor]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);
  const paginatedItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return sortedItems.slice(start, start + rowsPerPage);
  }, [page, rowsPerPage, sortedItems]);

  const handleDelete = useCallback(async (id) => {
    try {
      await onDeleteItem(id);
      // Refresh the table data after deletion
      const updatedData = tableData.filter(item => item.id_merk !== id);
      setTableData(updatedData);
      setSelectedKeys(new Set());
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  }, [onDeleteItem, tableData]);

  const handleEdit = useCallback(async (updatedItem) => {
    try {
      await onEditItemClick(updatedItem);
      // Update the table data with the updated item
      const updatedData = tableData.map(item => item.id_merk === updatedItem.id_merk ? updatedItem : item);
      setTableData(updatedData);
    } catch (error) {
      console.error('Failed to edit item:', error);
    }
  }, [onEditItemClick, tableData]);

  const renderCell = useCallback((item, columnKey) => {
    const cellValue = item[columnKey];
    switch (columnKey) {
      case "actions":
        return (
          <div className="flex gap-2">
            <Button auto color="primary" onClick={() => onEditItemClick(item)}>
              Edit
            </Button>
            <Button auto color="error" onClick={() => handleDelete(item.id_merk)}>
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
    if (value === "all") {
      setRowsPerPage(filteredItems.length);
    } else {
      setRowsPerPage(Number(value));
    }
    setPage(1);
  }, [filteredItems.length]);

  const onSearchChange = useCallback((value) => {
    setFilterValue(value);
    setPage(1);
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
        <span className="flex items-center text-default-400 text-sm ml-auto mr-4">Total {data.length} items</span>
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
            {merkColumns.map((column) => (
              <DropdownItem key={column.id} className="capitalize">
                {capitalize(column.label)}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        <Button color="primary" onClick={onAddItemClick} startIcon={<PlusIcon />}>
          Add Item
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
  }, [filterValue, visibleColumns, onRowsPerPageChange, data.length, onSearchChange]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected" : `${selectedKeys.size} of ${filteredItems.length} selected`}
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
      aria-label="Merk table with custom cells, pagination, and sorting"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{ wrapper: "max-h-[500px] overflow-auto" }}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={merkColumns}>
        {(column) => (
          <TableColumn
            key={column.id}
            align={column.id === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No items found"} items={paginatedItems}>
        {(item) => (
          <TableRow key={item.id_merk}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default MerkTable;
