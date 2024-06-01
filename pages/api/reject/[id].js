import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const reject = await prisma.reject.findUnique({
        where: { id_reject: parseInt(id) },
        include: { barang: true },
      });
      if (reject) {
        res.status(200).json(reject);
      } else {
        res.status(404).json({ error: 'Reject not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch reject' });
    }
  } else if (req.method === 'PUT') {
    const { id_barang, tanggal, jumlah, alasan, status } = req.body;
    try {
      const updatedReject = await prisma.reject.update({
        where: { id_reject: parseInt(id) },
        data: {
          id_barang,
          tanggal: new Date(tanggal),
          jumlah,
          alasan,
          status,
        },
      });
      res.status(200).json(updatedReject);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update reject' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.reject.delete({
        where: { id_reject: parseInt(id) },
      });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete reject' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
