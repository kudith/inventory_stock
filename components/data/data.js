// data.js

export const columns = [
    { uid: 'id_barang', name: 'ID', sortable: true },
    { uid: 'nama', name: 'Nama', sortable: true },
    { uid: 'stok', name: 'Stok', sortable: true },
    { uid: 'harga', name: 'Harga', sortable: true },
    { uid: 'merk', name: 'Merk', sortable: true },
    { uid: 'kategori', name: 'Kategori', sortable: true },
    { uid: 'actions', name: 'Aksi', sortable: false },
];

export const statusOptions = [
    { uid: 'available', name: 'Available' },
    { uid: 'out_of_stock', name: 'Out of Stock' },
    { uid: 'low_stock', name: 'Low Stock' },
];
