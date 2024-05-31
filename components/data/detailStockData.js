export const columns = [
    { uid: 'id_detail_stok', name: 'ID Detail Stok', sortable: true },
    { uid: 'id_barang', name: 'ID Barang', sortable: true },
    { uid: 'tanggal_update', name: 'Tanggal Update', sortable: true },
    { uid: 'stok_awal', name: 'Stok Awal', sortable: true },
    { uid: 'stok_masuk', name: 'Stok Masuk', sortable: true },
    { uid: 'stok_keluar', name: 'Stok Keluar', sortable: true },
    { uid: 'stok_akhir', name: 'Stok Akhir', sortable: true },
    { uid: 'actions', name: 'Actions', sortable: false },
];

export const statusOptions = [
    { key: 'available', name: 'Available' },
    { key: 'out_of_stock', name: 'Out of Stock' },
    { key: 'low_stock', name: 'Low Stock' },
];
