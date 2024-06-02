// pages/api/merk.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const merk = await prisma.merk.findMany();
      res.status(200).json(merk);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  } else if (req.method === 'POST') {
    const { nama } = req.body;
    try {
      const newMerk = await prisma.merk.create({
        data: { nama },
      });
      res.status(201).json(newMerk);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create merk' });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    try {
      await prisma.merk.delete({
        where: { id_merk: parseInt(id) },
      });
      res.status(204).end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete merk' });
    }
  } else if (req.method === 'PUT') {
    const { id_merk, nama } = req.body;
    try {
      const updatedMerk = await prisma.merk.update({
        where: { id_merk: parseInt(id_merk) },
        data: { nama },
      });
      res.status(200).json(updatedMerk);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update merk' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
