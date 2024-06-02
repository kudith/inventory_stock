import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const barang = await prisma.barang.findMany({
                include: {
                    supplier: true,
                    kategori: true,
                    merk: true,
                },
            });
            res.status(200).json(barang);
        } catch (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'Failed to fetch data', details: error.message });
        }
    } else if (req.method === 'POST') {
        try {
            const { kode, nama, supplier, kategori, merk, stok, harga } = req.body;

            const existingBarang = await prisma.barang.findUnique({
                where: { nama },
            });

            if (existingBarang) {
                return res.status(400).json({ error: 'Nama barang sudah ada' });
            }

            const newItem = await prisma.barang.create({
                data: {
                    kode,
                    nama,
                    supplier: { connect: { id_supplier: parseInt(supplier) } },
                    kategori: { connect: { id_kategori: parseInt(kategori) } },
                    merk: { connect: { id_merk: parseInt(merk) } },
                    stok: parseInt(stok, 10),
                    harga: parseFloat(harga),
                    tanggal_masuk: new Date(),
                },
            });
            res.status(201).json(newItem);
        } catch (error) {
            console.error('Error adding item:', error);
            res.status(500).json({ error: 'Failed to add item', details: error.message });
        }
    } else if (req.method === 'DELETE') {
        try {
            if (req.query.id) {
                const id_barang = parseInt(req.query.id);
                await prisma.barang.delete({
                    where: { id_barang }
                });
                res.status(204).end();
            } else {
                const { ids } = req.body;
                if (!Array.isArray(ids)) {
                    return res.status(400).json({ error: 'Payload must be an array of IDs' });
                }

                await prisma.barang.deleteMany({
                    where: {
                        id_barang: {
                            in: ids.map(id => parseInt(id)),
                        },
                    },
                });
                res.status(204).end();
            }
        } catch (error) {
            console.error('Error deleting items:', error);
            res.status(500).json({ error: 'Failed to delete items', details: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}