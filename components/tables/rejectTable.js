import React, {useEffect, useState, useMemo, useCallback} from "react";
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
import {PlusIcon} from "../icons/PlusIcon";
import {SearchIcon} from "../icons/SearchIcon";
import {ChevronDownIcon} from "../icons/chv";
import {VerticalDotsIcon} from "../icons/vertical";
import {rejectColumns} from "../data/rejectData";
import {capitalize} from "/utils/utils";

const INITIAL_VISIBLE_COLUMNS = ["id_reject", "id_barang", "tanggal", "jumlah", "alasan", "status", "actions"];

const statusColorMap = {
    pending: "warning",
    approved: "success",
    rejected: "danger",
};

const RejectApp = ({data, onAddItemClick, onEditItemClick}) => {
    const [filterValue, setFilterValue] = useState("");
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = useState(new Set(["all"]));
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [sortDescriptor, setSortDescriptor] = useState({column: "id_reject", direction: "ascending"});
    const [page, setPage] = useState(1);
    const [items, setItems] = useState(data);
    const [barangList, setBarangList] = useState([]);

    useEffect(() => {
        setItems(data);
    }, [data]);

    useEffect(() => {
        // Ambil daftar barang saat komponen dimuat
        const fetchBarangList = async () => {
            try {
                const response = await fetch('/api/barang');
                const barangData = await response.json();
                setBarangList(barangData);
            } catch (error) {
                console.error('Failed to fetch barang list:', error);
            }
        };
        fetchBarangList();
    }, []);

    const hasSearchFilter = Boolean(filterValue);

    const findBarangName = useCallback((idBarang) => {
        const rejectItem = items.find(item => item.id_barang === idBarang);
        return rejectItem ? rejectItem.barang.nama : 'Unknown';
    }, [items]);


    const headerColumns = useMemo(() => {
        if (visibleColumns === "all") return rejectColumns;
        return rejectColumns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const filteredItems = useMemo(() => {
        let filteredData = [...items];
        if (hasSearchFilter) {
            filteredData = filteredData.filter((item) => item.alasan.toLowerCase().includes(filterValue.toLowerCase()));
        }
        if (!statusFilter.has("all")) {
            filteredData = filteredData.filter((item) => statusFilter.has(item.status));
        }
        return filteredData;
    }, [items, filterValue, statusFilter]);

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

    const handleDelete = useCallback(async (id_reject) => {
        try {
            const response = await fetch(`/api/reject`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id_reject}) // Mengirim id_reject sebagai bagian dari body
            });

            if (response.ok) {
                setItems((prevItems) => prevItems.filter(item => item.id_reject !== id_reject));
            } else {
                const errorData = await response.json();
                console.error('Failed to delete item:', errorData);
            }
        } catch (error) {
            console.error('An error occurred while deleting the item:', error);
        }
    }, []);

    const handleBatchDelete = useCallback(async () => {
        const idsToDelete = Array.from(selectedKeys);
        if (idsToDelete.length > 1 && !window.confirm('Are you sure you want to delete the selected items?')) {
            return;
        }
        try {
            const response = await fetch(`/api/reject`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ids: idsToDelete}),
            });

            if (response.ok) {
                setItems((prevItems) => prevItems.filter(item => !idsToDelete.includes(item.id_reject)));
                setSelectedKeys(new Set());
            } else {
                const errorData = await response.json();
                console.error('Failed to delete items:', errorData);
            }
        } catch (error) {
            console.error('An error occurred while deleting the items:', error);
        }
    }, [selectedKeys]);

    const renderCell = useCallback((item, columnKey) => {
        const cellValue = item[columnKey];
        switch (columnKey) {
            case "alasan":
                return <div>{cellValue}</div>;
            case "status":
                return (
                    <Chip color={statusColorMap[item.status]}>
                        {cellValue}
                    </Chip>
                );
            case "id_barang": // Tampilkan nama barang
                return findBarangName(cellValue);
            case "tanggal": // Ubah format tanggal
                const formattedDate = new Date(cellValue).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                });
                return formattedDate;
            case "actions":
                return (
                    <div className="flex items-center gap-2">
                        <Button color="primary" onClick={() => onEditItemClick(item)}>
                            Edit
                        </Button>
                        <Button color="error" onClick={() => handleDelete(item.id_reject)}>
                            Delete
                        </Button>
                    </div>
                );
            default:
                return cellValue;
        }
    }, [handleDelete, onEditItemClick, findBarangName]);


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
                <span
                    className="flex items-center text-default-400 text-sm ml-auto mr-4">Total {items.length} items</span>
                <Input
                    isClearable
                    className="w-full sm:w-auto flex-grow"
                    placeholder="Search by reason..."
                    startContent={<SearchIcon/>}
                    value={filterValue}
                    onClear={onClear}
                    onValueChange={onSearchChange}
                />
                <Dropdown>
                    <DropdownTrigger>
                        <Button endContent={<ChevronDownIcon className="text-small"/>} variant="flat">
                            Status
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        disallowEmptySelection
                        aria-label="Table Columns"
                        closeOnSelect={false}
                        selectedKeys={statusFilter}
                        selectionMode="multiple"
                        onSelectionChange={setStatusFilter}
                    >
                        <DropdownItem key="all" className="capitalize">
                            All
                        </DropdownItem>
                        <DropdownItem key="pending" className="capitalize">
                            Pending
                        </DropdownItem>
                        <DropdownItem key="approved" className="capitalize">
                            Approved
                        </DropdownItem>
                        <DropdownItem key="rejected" className="capitalize">
                            Rejected
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown>
                    <DropdownTrigger>
                        <Button endContent={<ChevronDownIcon className="text-small"/>} variant="flat">
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
                        {rejectColumns.map((column) => (
                            <DropdownItem key={column.uid} className="capitalize">
                                {capitalize(column.name)}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>
                <Button color="primary" onClick={onAddItemClick} startIcon={<PlusIcon/>}>
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
    }, [filterValue, statusFilter, visibleColumns, onRowsPerPageChange, items.length, onSearchChange, hasSearchFilter]);

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
            aria-label="Reject table with custom cells, pagination and sorting"
            isHeaderSticky
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            classNames={{wrapper: "max-h-[500px] overflow-auto"}}
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
                    <TableRow key={item.id_reject}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

export default RejectApp;
