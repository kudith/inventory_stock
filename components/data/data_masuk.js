export const transaksiMasukColumns = [
    { id: 'id_transaksi_masuk', label: 'ID', sortable: true },
    { id: 'nama_barang', label: 'Nama Barang', sortable: true },
    { id: 'nama_supplier', label: 'Supplier', sortable: true },
    { id: 'tanggal', label: 'Tanggal', sortable: true },
    { id: 'harga_satuan', label: 'Harga Satuan', sortable: true },
    { id: 'jumlah', label: 'Jumlah Masuk', sortable: true },
    { id: 'total_harga', label: 'Total Harga', sortable: true },
    { id: 'catatan', label: 'Catatan', sortable: false },
];


export const statusOptions = [
    { uid: 'available', name: 'Available' },
    { uid: 'out_of_stock', name: 'Out of Stock' },
    { uid: 'low_stock', name: 'Low Stock' },
];