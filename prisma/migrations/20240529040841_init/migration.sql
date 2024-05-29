-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Admin" (
    "id_admin" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id_admin")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id_supplier" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telepon" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id_supplier")
);

-- CreateTable
CREATE TABLE "Kategori" (
    "id_kategori" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "Kategori_pkey" PRIMARY KEY ("id_kategori")
);

-- CreateTable
CREATE TABLE "Merk" (
    "id_merk" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "Merk_pkey" PRIMARY KEY ("id_merk")
);

-- CreateTable
CREATE TABLE "Barang" (
    "id_barang" SERIAL NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "id_supplier" INTEGER NOT NULL,
    "stok" INTEGER NOT NULL,
    "harga" DECIMAL(65,30) NOT NULL,
    "tanggal_masuk" TIMESTAMP(3) NOT NULL,
    "id_kategori" INTEGER NOT NULL,
    "id_merk" INTEGER NOT NULL,

    CONSTRAINT "Barang_pkey" PRIMARY KEY ("id_barang")
);

-- CreateTable
CREATE TABLE "Transaksi_Masuk" (
    "id_transaksi_masuk" SERIAL NOT NULL,
    "id_barang" INTEGER NOT NULL,
    "id_supplier" INTEGER NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "harga_satuan" DECIMAL(65,30) NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "total_harga" DECIMAL(65,30) NOT NULL,
    "catatan" TEXT,

    CONSTRAINT "Transaksi_Masuk_pkey" PRIMARY KEY ("id_transaksi_masuk")
);

-- CreateTable
CREATE TABLE "Transaksi_Keluar" (
    "id_transaksi_keluar" SERIAL NOT NULL,
    "id_barang" INTEGER NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "harga_satuan" DECIMAL(65,30) NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "total_harga" DECIMAL(65,30) NOT NULL,
    "catatan" TEXT,

    CONSTRAINT "Transaksi_Keluar_pkey" PRIMARY KEY ("id_transaksi_keluar")
);

-- CreateTable
CREATE TABLE "Detail_Stok" (
    "id_detail_stok" SERIAL NOT NULL,
    "id_barang" INTEGER NOT NULL,
    "tanggal_update" TIMESTAMP(3) NOT NULL,
    "stok_awal" INTEGER NOT NULL,
    "stok_masuk" INTEGER NOT NULL,
    "stok_keluar" INTEGER NOT NULL,
    "stok_akhir" INTEGER NOT NULL,

    CONSTRAINT "Detail_Stok_pkey" PRIMARY KEY ("id_detail_stok")
);

-- CreateTable
CREATE TABLE "Stok_Rendah" (
    "id_stok_rendah" SERIAL NOT NULL,
    "id_barang" INTEGER NOT NULL,
    "minimum_stok" INTEGER NOT NULL,
    "stok_sekarang" INTEGER NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stok_Rendah_pkey" PRIMARY KEY ("id_stok_rendah")
);

-- CreateTable
CREATE TABLE "Reject" (
    "id_reject" SERIAL NOT NULL,
    "id_barang" INTEGER NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "alasan" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Reject_pkey" PRIMARY KEY ("id_reject")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Barang_kode_key" ON "Barang"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "Barang_nama_key" ON "Barang"("nama");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Barang" ADD CONSTRAINT "Barang_id_supplier_fkey" FOREIGN KEY ("id_supplier") REFERENCES "Supplier"("id_supplier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Barang" ADD CONSTRAINT "Barang_id_kategori_fkey" FOREIGN KEY ("id_kategori") REFERENCES "Kategori"("id_kategori") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Barang" ADD CONSTRAINT "Barang_id_merk_fkey" FOREIGN KEY ("id_merk") REFERENCES "Merk"("id_merk") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaksi_Masuk" ADD CONSTRAINT "Transaksi_Masuk_id_barang_fkey" FOREIGN KEY ("id_barang") REFERENCES "Barang"("id_barang") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaksi_Masuk" ADD CONSTRAINT "Transaksi_Masuk_id_supplier_fkey" FOREIGN KEY ("id_supplier") REFERENCES "Supplier"("id_supplier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaksi_Keluar" ADD CONSTRAINT "Transaksi_Keluar_id_barang_fkey" FOREIGN KEY ("id_barang") REFERENCES "Barang"("id_barang") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detail_Stok" ADD CONSTRAINT "Detail_Stok_id_barang_fkey" FOREIGN KEY ("id_barang") REFERENCES "Barang"("id_barang") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stok_Rendah" ADD CONSTRAINT "Stok_Rendah_id_barang_fkey" FOREIGN KEY ("id_barang") REFERENCES "Barang"("id_barang") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reject" ADD CONSTRAINT "Reject_id_barang_fkey" FOREIGN KEY ("id_barang") REFERENCES "Barang"("id_barang") ON DELETE RESTRICT ON UPDATE CASCADE;
