import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/suppliers
export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const suppliers = await prisma.supplier.findMany();
            res.status(200).json(suppliers);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    } else if (req.method === 'POST') {
        // Handle POST request to create a new supplier
        try {
            const { nama, email, telepon, alamat } = req.body;
            const newSupplier = await prisma.supplier.create({
                data: {
                    nama,
                    email,
                    telepon,
                    alamat,
                },
            });
            res.status(201).json(newSupplier);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
