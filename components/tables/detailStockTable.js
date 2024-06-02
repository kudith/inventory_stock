import React, { useEffect, useState, useMemo, useCallback } from "react";
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
    Chip,
    Pagination,
} from "@nextui-org/react";
import { PlusIcon } from "../icons/PlusIcon";
import { VerticalDotsIcon } from "../icons/vertical";
import { SearchIcon } from "../icons/SearchIcon";
import { ChevronDownIcon } from "../icons/chv";
import { columns } from "../data/detailStockData";
import { capitalize } from "/utils/utils";

const statusColorMap = {
    available: "success",
    out_of_stock: "danger",
    low_stock: "warning",
};

const INITIAL_VISIBLE_COLUMNS = ["id_detail_stok", "id_barang", "tanggal_update", "stok_awal", "stok_masuk", "stok_keluar", "stok_akhir", "actions"];

const DetailStockTable = ({ data, onAddItemClick, onEditItemClick }) => {
    const [filterValue, setFilterValue] = useState("");
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [sortDescriptor, setSortDescriptor] = useState({ column: "id_detail_stok", direction: "ascending" });
    const [page, setPage] = useState(1);
    const [items, setItems] = useState(data);

    useEffect(() => {
        setItems(data);
    }, [data]);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = useMemo(() => {
        if (visibleColumns === "all") return columns;
        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const filteredItems = useMemo(() => {
        let filteredData = [...items];
        if (hasSearchFilter) {
            filteredData = filteredData.filter((item) => item.id_barang.toLowerCase().includes(filterValue.toLowerCase()));
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
            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, paginatedItems]);

    const handleDelete = useCallback(async (id_detail_stok) => {
        try {
            const response = await fetch(`/api/detail_stok`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id_detail_stok })
            });

            if (response.ok) {
                setItems((prevItems) => prevItems.filter(item => item.id_detail_stok !== id_detail_stok));
            } else {
                const errorData = await response.json();
                console.error('Failed to delete item:', errorData);
            }
        } catch (error) {
            console.error('An error occurred while deleting the item:', error);
        }
    }, []);

    const renderCell = useCallback((item, columnKey) => {
        const cellValue = item[columnKey];
        switch (columnKey) {
            case "id_barang":
                return <div>{cellValue}</div>;
            case "tanggal_update":
                return <div>{new Date(cellValue).toLocaleDateString('id-ID')}</div>;
            case "stok_awal":
            case "stok_masuk":
            case "stok_keluar":
            case "stok_akhir":
                return <div>{cellValue}</div>;
            case "actions":
                return (
                    <div className="flex items-center gap-2">
                        <Button color="primary" onClick={() => onEditItemClick(item)}>
                            Edit
                        </Button>
                        <Button color="error" onClick={() => handleDelete(item.id_detail_stok)}>
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
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);

    const topContent = useMemo(() => {
        return (
            <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                <span className="flex items-center text-default-400 text-sm ml-auto mr-4">
                    Total {items.length} items
                </span>
                <Input
                    isClearable
                    className="w-full sm:w-auto flex-grow"
                    placeholder="Search by ID Barang..."
                    startContent={<SearchIcon />}
                    value={filterValue}
                    onClear={onClear}
                    onValueChange={onSearchChange}
                />
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
    }, [filterValue, visibleColumns, onRowsPerPageChange, items.length, onSearchChange, hasSearchFilter]);

    const bottomContent = useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400">
                    {selectedKeys === "all"
                        ? "All items selected"
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
    }, [selectedKeys, filteredItems.length, page, pages, hasSearchFilter]);

    return (
        <Table
            aria-label="Example table with custom cells, pagination and sorting"
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
            <TableHeader columns={headerColumns}>
                {(column) => (
                    <TableColumn
                        key={column.uid}
                        align={column.uid === "actions" ? "center" : "start"}
                        allowsSorting={column.sortable}
                    >
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody emptyContent={"No items found"} items={sortedItems}>
                {(item) => (
                    <TableRow key={item.id_detail_stok}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

export default DetailStockTable;
