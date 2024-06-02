const prisma = require('../../prisma');

async function addBarang(data) {
    const newBarang = await prisma.barang.create({
        data: {
            kode: data.kode,
            nama: data.nama,
            id_supplier: data.id_supplier,
            stok: data.stok,
            harga: data.harga,
            tanggal_masuk: new Date(),
            id_kategori: data.id_kategori,
            id_merk: data.id_merk,
        },
    });

    // Menambahkan entri awal ke Detail_Stok
    await prisma.detail_Stok.create({
        data: {
            id_barang: newBarang.id_barang,
            tanggal_update: new Date(),
            stok_awal: data.stok,
            stok_masuk: 0,
            stok_keluar: 0,
            stok_akhir: data.stok,
        },
    });

    return newBarang;
}


async function addTransaksiMasuk(data) {
    const transaksiMasuk = await prisma.transaksi_Masuk.create({
        data: {
            id_barang: data.id_barang,
            id_supplier: data.id_supplier,
            tanggal: new Date(),
            harga_satuan: data.harga_satuan,
            jumlah: data.jumlah,
            total_harga: data.total_harga,
            catatan: data.catatan,
        },
    });

    // Trigger otomatis akan memperbarui Detail_Stok

    return transaksiMasuk;
}

async function addTransaksiKeluar(data) {
    const transaksiKeluar = await prisma.transaksi_Keluar.create({
        data: {
            id_barang: data.id_barang,
            tanggal: new Date(),
            harga_satuan: data.harga_satuan,
            jumlah: data.jumlah,
            total_harga: data.total_harga,
            catatan: data.catatan,
        },
    });

    // Trigger otomatis akan memperbarui Detail_Stok

    return transaksiKeluar;
}

module.exports = { addBarang, addTransaksiMasuk, addTransaksiKeluar };
