import { useState } from 'react';
import axios from 'axios';

export default function BarangForm() {
  const [kode, setKode] = useState('');
  const [nama, setNama] = useState('');
  const [stok, setStok] = useState('');
  const [harga, setHarga] = useState('');
  const [tanggalMasuk, setTanggalMasuk] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/barang', {
        kode,
        nama,
        stok,
        harga,
        tanggalMasuk,
      });
      // Reset form
      setKode('');
      setNama('');
      setStok('');
      setHarga('');
      setTanggalMasuk('');
    } catch (error) {
      console.error('Error adding barang:', error);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Tambah Barang</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="kode" className="block text-sm font-medium text-gray-700">Kode</label>
            <input id="kode" type="text" value={kode} onChange={(e) => setKode(e.target.value)} className="mt-1 p-2 border border-gray-300 rounded w-full" />
          </div>
          <div>
            <label htmlFor="nama" className="block text-sm font-medium text-gray-700">Nama</label>
            <input id="nama" type="text" value={nama} onChange={(e) => setNama(e.target.value)} className="mt-1 p-2 border border-gray-300 rounded w-full" />
          </div>
          <div>
            <label htmlFor="stok" className="block text-sm font-medium text-gray-700">Stok</label>
            <input id="stok" type="number" value={stok} onChange={(e) => setStok(e.target.value)} className="mt-1 p-2 border border-gray-300 rounded w-full" />
          </div>
          <div>
            <label htmlFor="harga" className="block text-sm font-medium text-gray-700">Harga</label>
            <input id="harga" type="number" value={harga} onChange={(e) => setHarga(e.target.value)} className="mt-1 p-2 border border-gray-300 rounded w-full" />
          </div>
          <div>
            <label htmlFor="tanggalMasuk" className="block text-sm font-medium text-gray-700">Tanggal Masuk</label>
            <input id="tanggalMasuk" type="date" value={tanggalMasuk} onChange={(e) => setTanggalMasuk(e.target.value)} className="mt-1 p-2 border border-gray-300 rounded w-full" />
          </div>
          <div className="col-span-2">
            <button type="submit" className="btn btn-primary w-full">Tambah Barang</button>
          </div>
        </div>
      </form>
    </div>
  );
}
