const {faker} = require('@faker-js/faker');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createDummyData() {
  try {
    // Membuat data dummy untuk model Supplier
    for (let i = 0; i < 10; i++) {
      await prisma.supplier.create({
        data: {
          nama: faker.company.name(),
          email: faker.internet.exampleEmail(),
          telepon: faker.phone.number(),
          alamat:faker.location.secondaryAddress(),
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
