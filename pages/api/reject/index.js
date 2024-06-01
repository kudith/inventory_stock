import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const rejects = await prisma.reject.findMany({
                include: {
                    barang: true,
                },
            });
            res.status(200).json(rejects);
        } catch (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'Failed to fetch data', details: error.message });
        }
    } else if (req.method === 'POST') {
        try {
            const { id_barang, tanggal, jumlah, alasan, status } = req.body;

            if (!id_barang || !tanggal || !jumlah || !alasan || !status) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const barang = await prisma.barang.findUnique({
                where: { id_barang: parseInt(id_barang) },
            });

            if (!barang) {
                return res.status(404).json({ error: 'Barang not found' });
            }

            const newReject = await prisma.reject.create({
                data: {
                    id_barang: parseInt(id_barang),
                    tanggal: new Date(tanggal),
                    jumlah: parseInt(jumlah),
                    alasan,
                    status,
                },
            });

            await prisma.barang.update({
                where: { id_barang: parseInt(id_barang) },
                data: {
                    stok: barang.stok - parseInt(jumlah),
                },
            });

            res.status(201).json(newReject);
        } catch (error) {
            console.error('Error creating reject:', error);
            res.status(500).json({ error: 'Failed to create reject', details: error.message });
        }
    } else if (req.method === 'PUT') {
        try {
            const { id_reject, id_barang, tanggal, jumlah, alasan, status } = req.body;

            if (!id_reject || !id_barang || !tanggal || !jumlah || !alasan || !status) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const reject = await prisma.reject.findUnique({
                where: { id_reject: parseInt(id_reject) },
            });

            if (!reject) {
                return res.status(404).json({ error: 'Reject not found' });
            }

            const barang = await prisma.barang.findUnique({
                where: { id_barang: parseInt(id_barang) },
            });

            if (!barang) {
                return res.status(404).json({ error: 'Barang not found' });
            }

            const difference = parseInt(jumlah) - reject.jumlah;

            const updatedReject = await prisma.reject.update({
                where: { id_reject: parseInt(id_reject) },
                data: {
                    id_barang: parseInt(id_barang),
                    tanggal: new Date(tanggal),
                    jumlah: parseInt(jumlah),
                    alasan,
                    status,
                },
            });

            await prisma.barang.update({
                where: { id_barang: parseInt(id_barang) },
                data: {
                    stok: barang.stok - difference,
                },
            });

            res.status(200).json(updatedReject);
        } catch (error) {
            console.error('Error updating reject:', error);
            res.status(500).json({ error: 'Failed to update reject', details: error.message });
        }
    } else if (req.method === 'DELETE') {
        try {
            const { id_reject } = req.body;

            if (!id_reject) {
                return res.status(400).json({ error: 'Missing required id_reject field' });
            }

            const reject = await prisma.reject.findUnique({
                where: { id_reject: parseInt(id_reject) },
            });

            if (!reject) {
                return res.status(404).json({ error: 'Reject not found' });
            }

            const barang = await prisma.barang.findUnique({
                where: { id_barang: reject.id_barang },
            });

            if (!barang) {
                return res.status(404).json({ error: 'Barang not found' });
            }

            await prisma.reject.delete({
                where: { id_reject: parseInt(id_reject) },
            });

            await prisma.barang.update({
                where: { id_barang: reject.id_barang },
                data: {
                    stok: barang.stok + reject.jumlah,
                },
            });

            res.status(204).end();
        } catch (error) {
            console.error('Error deleting reject:', error);
            res.status(500).json({ error: 'Failed to delete reject', details: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
