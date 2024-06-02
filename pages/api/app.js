const express = require('express');
const { addBarang, addTransaksiMasuk, addTransaksiKeluar } = require('./services');

const app = express();
app.use(express.json());

app.post('/barang', async (req, res) => {
    try {
        const newBarang = await addBarang(req.body);
        res.json(newBarang);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint untuk transaksi masuk
app.post('/transaksi_masuk', async (req, res) => {
    const data = req.body;

    try {
        const transaksiMasuk = await prisma.transaksi_Masuk.create({
            data: {
                id_barang: data.id_barang,
                id_supplier: data.id_supplier,
                tanggal: new Date(),
                harga_satuan: data.harga_satuan,
                jumlah: data.jumlah,
                total_harga: data.harga_satuan * data.jumlah,
                catatan: data.catatan,
            },
        });

        res.json(transaksiMasuk);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Endpoint untuk transaksi keluar
app.post('/transaksi_keluar', async (req, res) => {
    const data = req.body;

    try {
        const transaksiKeluar = await prisma.transaksi_Keluar.create({
            data: {
                id_barang: data.id_barang,
                tanggal: new Date(),
                harga_satuan: data.harga_satuan,
                jumlah: data.jumlah,
                total_harga: data.harga_satuan * data.jumlah,
                catatan: data.catatan,
            },
        });

        res.json(transaksiKeluar);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
