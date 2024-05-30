import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method, query } = req;

  switch (method) {
    case "GET":
      try {
        const transaksiKeluar = await prisma.transaksi_Keluar.findMany({
          include: {
            barang: true,
          },
        });
        res.status(200).json(transaksiKeluar);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch transaksi keluar" });
      }
      break;

    case "POST":
      const { id_barang, tanggal, harga_satuan, jumlah, total_harga, catatan } = req.body;
      try {
        const newTransaksiKeluar = await prisma.transaksi_Keluar.create({
          data: {
            id_barang,
            tanggal: new Date(tanggal),
            harga_satuan,
            jumlah,
            total_harga,
            catatan,
          },
        });
        res.status(201).json(newTransaksiKeluar);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create transaksi keluar" });
      }
      break;

    case "PUT":
      const { id_transaksi_keluar, ...updateData } = req.body;
      try {
        const updatedTransaksiKeluar = await prisma.transaksi_Keluar.update({
          where: { id_transaksi_keluar },
          data: updateData,
        });
        res.status(200).json(updatedTransaksiKeluar);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update transaksi keluar" });
      }
      break;

    case "DELETE":
      const { id: deleteId } = query;
      try {
        await prisma.transaksi_Keluar.delete({
          where: { id_transaksi_keluar: parseInt(deleteId) },
        });
        res.status(204).end();
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete transaksi keluar" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
