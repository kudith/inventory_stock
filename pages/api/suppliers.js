import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const suppliers = await prisma.supplier.findMany();
        res.status(200).json(suppliers);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch suppliers" });
      }
      break;
    case "POST":
      const { nama, email, telepon, alamat } = req.body;
      try {
        const newSupplier = await prisma.supplier.create({
          data: { nama, email, telepon, alamat },
        });
        res.status(201).json(newSupplier);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create supplier" });
      }
      break;
    case "PUT":
      const { id_supplier } = req.query;
      const { nama: updatedNama, email: updatedEmail, telepon: updatedTelepon, alamat: updatedAlamat } = req.body;
      try {
        const updatedSupplier = await prisma.supplier.update({
          where: { id_supplier: parseInt(id_supplier) },
          data: { nama: updatedNama, email: updatedEmail, telepon: updatedTelepon, alamat: updatedAlamat },
        });
        res.status(200).json(updatedSupplier);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update supplier" });
      }
      break;
    case "DELETE":
      const { id: deleteId } = req.query;
      try {
        await prisma.supplier.delete({
          where: { id_supplier: parseInt(deleteId) },
        });
        res.status(204).end();
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete supplier" });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
