import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { nama } = req.body;

            const existingBarang = await prisma.barang.findUnique({
                where: { nama },
            });

            res.status(200).json({ exists: !!existingBarang });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to check nama' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
