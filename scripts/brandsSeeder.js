const { faker } = require('@faker-js/faker');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createDummyData() {
  try {
    // Membuat data dummy untuk model Merk
    for (let i = 0; i < 10; i++) {
      await prisma.merk.create({
        data: {
          nama: faker.company.name(), // Menggunakan faker untuk menghasilkan nama merk acak
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
