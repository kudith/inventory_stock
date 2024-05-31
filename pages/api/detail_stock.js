import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // Fetch detail_stock data
            const detailStocks = await prisma.detail_Stok.findMany({
                include: {
                    barang: true,
                },
            });
            res.status(200).json(detailStocks);
        } catch (error) {
            console.error('Error fetching detail stock data:', error);
            res.status(500).json({ error: 'Failed to fetch data', details: error.message });
        }
    } else if (req.method === 'POST') {
        try {
            const { id_barang, tanggal_update, stok_awal, stok_masuk, stok_keluar, stok_akhir } = req.body;

            // Validate the fields
            if (!id_barang || !tanggal_update || stok_awal == null || stok_masuk == null || stok_keluar == null || stok_akhir == null) {
                res.status(400).json({ error: 'Missing required fields' });
                return;
            }

            const newDetailStok = await prisma.detail_Stok.create({
                data: {
                    id_barang,
                    tanggal_update: new Date(tanggal_update),
                    stok_awal,
                    stok_masuk,
                    stok_keluar,
                    stok_akhir,
                    barang: {
                        connect: { id_barang: parseInt(id_barang) }
                    }
                }
            });

            res.status(201).json(newDetailStok);
        } catch (error) {
            console.error('Error creating detail stock:', error);
            res.status(500).json({ error: 'Failed to create data', details: error.message });
        }
    } else if (req.method === 'PUT') {
        try {
            const { id_detail_stok, ...data } = req.body;

            // Include tanggal_update if present in the request body
            if (data.tanggal_update) {
                data.tanggal_update = new Date(data.tanggal_update);
            }

            const updatedDetailStok = await prisma.detail_Stok.update({
                where: { id_detail_stok: parseInt(id_detail_stok) },
                data: {
                    ...data,
                    barang: data.id_barang ? { connect: { id_barang: parseInt(data.id_barang) } } : undefined,
                },
                include: {
                    barang: true,
                },
            });
            res.status(200).json(updatedDetailStok);
        } catch (error) {
            console.error('Error updating detail stock:', error);
            res.status(500).json({ error: 'Failed to update data', details: error.message });
        }
    } else if (req.method === 'DELETE') {
        try {
            const { id_detail_stok } = req.body;
            await prisma.detail_Stok.delete({
                where: { id_detail_stok: parseInt(id_detail_stok) },
            });
            res.status(204).end();
        } catch (error) {
            console.error('Error deleting detail stock:', error);
            res.status(500).json({ error: 'Failed to delete data', details: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
