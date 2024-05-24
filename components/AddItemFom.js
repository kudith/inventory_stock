import { useState, useEffect } from 'react';

const AddItemForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    kode: '',
    nama: '',
    supplier: '',
    kategori: '',
    merk: '',
    stok: '',
    harga: '',
  });

  const [merkOptions, setMerkOptions] = useState([]);
  const [kategoriOptions, setKategoriOptions] = useState([]);
  const [supplierOptions, setSupplierOptions] = useState([]);

  useEffect(() => {
    fetch('/api/dropdowns')
      .then((response) => response.json())
      .then((data) => {
        setMerkOptions(data.merks);
        setKategoriOptions(data.kategoris);
        setSupplierOptions(data.suppliers);
      })
      .catch((error) => console.error('Error fetching dropdown data:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataWithDate = {
      ...formData,
      tanggal_masuk: new Date().toISOString().substr(0, 10),
    };
    onSubmit(formDataWithDate);
    setFormData({
      kode: '',
      nama: '',
      supplier: '',
      kategori: '',
      merk: '',
      stok: '',
      harga: '',
    });
  };
  return (
    <div className="max-w-md mx-auto bg-white rounded-md shadow-md overflow-hidden">
      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-4">
        <div>
          <label htmlFor="kode" className="block text-sm font-medium text-gray-700">
            Kode
          </label>
          <input
            type="text"
            name="kode"
            id="kode"
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            value={formData.kode}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="nama" className="block text-sm font-medium text-gray-700">
            Nama
          </label>
          <input
            type="text"
            name="nama"
            id="nama"
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            value={formData.nama}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">
            Supplier
          </label>
          <select
            name="supplier"
            id="supplier"
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            value={formData.supplier}
            onChange={handleChange}
          >
            <option value="">Pilih Supplier</option>
            {supplierOptions.map((supplier) => (
              <option key={supplier.id_supplier} value={supplier.id_supplier}>
                {supplier.nama}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="kategori" className="block text-sm font-medium text-gray-700">
            Kategori
          </label>
          <select
            name="kategori"
            id="kategori"
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            value={formData.kategori}
            onChange={handleChange}
          >
            <option value="">Pilih Kategori</option>
            {kategoriOptions.map((kategori) => (
              <option key={kategori.id_kategori} value={kategori.id_kategori}>
                {kategori.nama}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="merk" className="block text-sm font-medium text-gray-700">
            Merk
          </label>
          <select
            name="merk"
            id="merk"
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            value={formData.merk}
            onChange={handleChange}
          >
            <option value="">Pilih Merk</option>
            {merkOptions.map((merk) => (
              <option key={merk.id_merk} value={merk.id_merk}>
                {merk.nama}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="stok" className="block text-sm font-medium text-gray-700">
            Stok
          </label>
          <input
            type="number"
            name="stok"
            id="stok"
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            value={formData.stok}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="harga" className="block text-sm font-medium text-gray-700">
            Harga
          </label>
          <input
            type="number"
            name="harga"            id="harga"
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            value={formData.harga}
            onChange={handleChange}
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Tambah Barang
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddItemForm;

