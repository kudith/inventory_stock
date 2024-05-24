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
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  } else if (req.method === 'POST') {
    try {
      const { kode, nama, supplier, kategori, merk, stok, harga } = req.body;
      const newItem = await prisma.barang.create({
        data: {
          kode,
          nama,
          supplier: { connect: { id_supplier: parseInt(supplier) } },
          kategori: { connect: { id_kategori: parseInt(kategori) } },
          merk: { connect: { id_merk: parseInt(merk) } },
          stok: parseInt(stok, 10),
          harga: parseFloat(harga),
          tanggal_masuk: new Date(), // Set tanggal masuk otomatis
        },
      });
      res.status(201).json(newItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to add item' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.body; // Assuming you are sending the ID in the request body
      await prisma.barang.delete({
        where: {
          id_barang: parseInt(id),
        },
      });
      res.status(204).end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete item' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
