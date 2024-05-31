import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // Handle GET request for fetching barang data
            if (!req.query.type) {
                const barang = await prisma.barang.findMany({
                    include: {
                        supplier: true,
                        kategori: true,
                        merk: true,
                    },
                });
                res.status(200).json(barang);
            }
            // Handle GET request for fetching merk data
            else if (req.query.type === 'merk') {
                const merk = await prisma.merk.findMany();
                res.status(200).json(merk);
            }
            // Handle GET request for fetching kategori data
            else if (req.query.type === 'kategori') {
                const kategori = await prisma.kategori.findMany();
                res.status(200).json(kategori);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'Failed to fetch data', details: error.message });
        }
    }
    // Handle POST request for creating new barang
    else if (req.method === 'POST') {
        try {
            const {
                kode,
                nama,
                supplier,
                kategori,
                merk,
                stok,
                harga,
                tanggal_masuk // Include tanggal_masuk
            } = req.body;

            // Validate the fields
            if (!kode || !nama || !supplier || !kategori || !merk || !stok || !harga || !tanggal_masuk) {
                res.status(400).json({ error: 'Missing required fields' });
                return;
            }

            const newBarang = await prisma.barang.create({
                data: {
                    kode,
                    nama,
                    stok: parseInt(stok),
                    harga: parseFloat(harga),
                    tanggal_masuk: new Date(tanggal_masuk), // Add tanggal_masuk
                    supplier: {
                        connect: { id_supplier: parseInt(supplier) }
                    },
                    kategori: {
                        connect: { id_kategori: parseInt(kategori) }
                    },
                    merk: {
                        connect: { id_merk: parseInt(merk) }
                    }
                }
            });

            res.status(201).json(newBarang);
        } catch (error) {
            console.error('Error creating barang:', error);
            res.status(500).json({ error: 'Failed to create data', details: error.message });
        }
    }
    // Handle PUT request for updating barang data
    else if (req.method === 'PUT') {
        try {
            const { id_barang, ...data } = req.body;

            // Include tanggal_masuk if present in the request body
            if (data.tanggal_masuk) {
                data.tanggal_masuk = new Date(data.tanggal_masuk);
            }

            const updatedBarang = await prisma.barang.update({
                where: { id_barang: parseInt(id_barang) },
                data: {
                    ...data,
                    // Update foreign key fields if they are present in the request body
                    merk: data.merk ? { connect: { id_merk: parseInt(data.merk) } } : undefined,
                    kategori: data.kategori ? { connect: { id_kategori: parseInt(data.kategori) } } : undefined,
                },
                include: {
                    supplier: true,
                    kategori: true,
                    merk: true,
                },
            });
            res.status(200).json(updatedBarang);
        } catch (error) {
            console.error('Error updating barang:', error);
            res.status(500).json({ error: 'Failed to update data', details: error.message });
        }
    }
    // Handle DELETE request for deleting barang data
    else if (req.method === 'DELETE') {
        try {
            const { id_barang } = req.body; // Ambil `id_barang` dari `req.body`
            await prisma.barang.delete({
                where: { id_barang: parseInt(id_barang) }, // Gunakan `id_barang`
            });
            res.status(204).end();
        } catch (error) {
            console.error('Error deleting barang:', error);
            res.status(500).json({ error: 'Failed to delete data', details: error.message });
        }
    }
    // Handle unsupported HTTP methods
    else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
