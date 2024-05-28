import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const transaksiMasuk = await prisma.transaksi_Masuk.findMany({
            include: {
                barang: true,
                supplier: true,
            },
        });
        res.json(transaksiMasuk);
    } else if (req.method === 'POST') {
        const { id_barang, id_supplier, tanggal, harga_satuan, jumlah, total_harga, catatan } = req.body;
        const newTransaksiMasuk = await prisma.transaksi_Masuk.create({
            data: {
                id_barang,
                id_supplier,
                tanggal,
                harga_satuan,
                jumlah,
                total_harga,
                catatan,
            },
        });
        res.json(newTransaksiMasuk);
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
