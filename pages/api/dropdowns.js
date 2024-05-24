import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const suppliers = await prisma.supplier.findMany();
      const kategoris = await prisma.kategori.findMany();
      const merks = await prisma.merk.findMany();

      res.status(200).json({ suppliers, kategoris, merks });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch dropdown data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
