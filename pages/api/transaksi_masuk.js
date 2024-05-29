import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const transaksiMasuk = await prisma.transaksi_Masuk.findMany({
            include: {
                barang: {select: {nama: true}},
                supplier: {select: {nama: true}},
            },
        });
        res.json(transaksiMasuk);
    } else if (req.method === 'POST') {
        const {nama_barang, tanggal, harga_satuan, jumlah, total_harga, catatan} = req.body;

        try {
            // Temukan barang berdasarkan nama yang diberikan
            const barang = await prisma.barang.findUnique({
                where: {
                    nama: nama_barang,
                },
                include: {
                    supplier: true,
                },
            });

            if (!barang) {
                return res.status(400).json({error: 'Barang tidak ditemukan'});
            }

            // Gunakan supplier dari barang yang ditemukan
            const {id_supplier} = barang.supplier;

            // Buat transaksi masuk baru dengan supplier dari barang
            const newTransaksiMasuk = await prisma.transaksi_Masuk.create({
                data: {
                    id_barang: barang.id_barang,
                    id_supplier,
                    tanggal,
                    harga_satuan,
                    jumlah,
                    total_harga,
                    catatan,
                },
            });

            res.json(newTransaksiMasuk);
        } catch (error) {
            console.error('Error creating new transaction:', error);
            res.status(500).json({error: 'Gagal menambahkan transaksi masuk'});
        }

    } else {
        res.status(405).json({message: 'Method not allowed'});
    }
}
