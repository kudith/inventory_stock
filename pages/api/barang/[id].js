import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
    const {id} = req.query;

    if (req.method === 'GET') {
        try {
            const barang = await prisma.barang.findUnique({
                where: {
                    id_barang: parseInt(id),
                },
                include: {
                    supplier: true, // Mengambil data supplier
                    kategori: true, // Mengambil data kategori
                    merk: true, // Mengambil data merk
                },
            });

            const suppliers = await prisma.supplier.findMany();
            const categories = await prisma.kategori.findMany();
            const brands = await prisma.merk.findMany();

            res.status(200).json({
                barang,
                suppliers,
                categories,
                brands,
            });
        } catch (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({error: 'Failed to fetch data'});
        }
    } else if (req.method === 'PUT') {
        const {kode, nama, stok, harga, tanggal_masuk, id_supplier, id_kategori, id_merk} = req.body;

        try {
            const updatedBarang = await prisma.barang.update({
                where: {
                    id_barang: parseInt(id),
                },
                data: {
                    kode,
                    nama,
                    stok,
                    harga,
                    tanggal_masuk,
                    id_supplier,
                    id_kategori,
                    id_merk,
                },
            });
            res.status(200).json(updatedBarang);
        } catch (error) {
            console.error('Error updating barang:', error);
            res.status(500).json({error: 'Failed to update barang'});
        }
    } else if (req.method === 'DELETE') {
        try {
            await prisma.barang.delete({
                where: {
                    id_barang: parseInt(id),
                },
            });
            res.status(200).json({message: 'Barang deleted successfully'});
        } catch (error) {
            console.error('Error deleting barang:', error);
            res.status(500).json({error: 'Failed to delete barang'});
        }
    }// Handle PUT request for updating barang data
    else if (req.method === 'PUT') {
        const {kode, nama, stok, harga, tanggal_masuk, id_supplier, id_kategori, id_merk} = req.body;

        // Validate the fields
        if (!kode || !nama || !stok || !harga || !tanggal_masuk || !id_supplier || !id_kategori || !id_merk) {
            res.status(400).json({error: 'Missing required fields'});
            return;
        }

        try {
            const updatedBarang = await prisma.barang.update({
                where: {
                    id_barang: parseInt(id),
                },
                data: {
                    kode,
                    nama,
                    stok,
                    harga,
                    tanggal_masuk,
                    id_supplier: parseInt(id_supplier),
                    id_kategori: parseInt(id_kategori),
                    id_merk: parseInt(id_merk),
                },
            });
            res.status(200).json(updatedBarang);
        } catch (error) {
            console.error('Error updating barang:', error);
            res.status(500).json({error: 'Failed to update barang'});
        }
    } else {
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
