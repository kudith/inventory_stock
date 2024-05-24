const {faker} = require('@faker-js/faker');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createDummyData() {
  try {
    // Membuat data dummy untuk model Barang
    for (let i = 0; i < 10; i++) {
      await prisma.barang.create({
        data: {
          kode: faker.string.sample(5), // Menggunakan faker untuk menghasilkan kode barang UUID
          nama: faker.commerce.product(), // Menggunakan faker untuk menghasilkan nama produk acak
          id_supplier: faker.number.int({ min: 1, max: 10 }), // Menggunakan faker untuk menghasilkan ID supplier acak
          stok: faker.number.int(100), // Menggunakan faker untuk menghasilkan jumlah stok acak
          harga: faker.finance.accountNumber(), // Menggunakan faker untuk menghasilkan harga acak
          tanggal_masuk: faker.date.anytime(),
          id_kategori: faker.number.int({ min: 3, max: 5 }), // Menggunakan faker untuk menghasilkan ID kategori acak
          id_merk: faker.number.int({ min: 1, max: 10 }), // Menggunakan faker untuk menghasilkan ID merk acak
        },
      });
    }
  } catch (error) {
    console.error('Error creating dummy data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDummyData();
