import { useEffect, useState } from 'react';

const InventoryTable = ({ items }) => {
  const [itemList, setItemList] = useState(items);

  useEffect(() => {
    setItemList(items); // Update itemList when items prop changes
  }, [items]);

  const handleDelete = async (id_barang) => {
    try {
      const response = await fetch('/api/barang', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id_barang }),
      });

      if (response.ok) {
        // Remove the deleted item from the state
        setItemList(itemList.filter(item => item.id_barang !== id_barang));
      } else {
        console.error('Failed to delete item');
      }
    } catch (error) {
      console.error('Failed to delete item', error);
    }
  };
  return (
    <div className="overflow-x-auto rounded-lg">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="px-6 py-3 text-left">Kode</th>
            <th className="px-6 py-3 text-left">Nama</th>
            <th className="px-6 py-3 text-left">Supplier</th>
            <th className="px-6 py-3 text-left">Kategori</th>
            <th className="px-6 py-3 text-left">Merk</th>
            <th className="px-6 py-3 text-left">Stok</th>
            <th className="px-6 py-3 text-left">Harga</th>
            <th className="px-6 py-3 text-left">Tanggal Masuk</th>
            <th className="px-6 py-3 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {itemList.map((item) => (
            <tr key={item.id_barang} className="bg-gray-50 border-b border-gray-200">
              <td className="px-6 py-4 whitespace-nowrap">{item.kode}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.nama}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.supplier.nama}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.kategori.nama}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.merk.nama}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.stok}</td>
              <td className={`px-6 py-4 whitespace-nowrap ${item.harga >= 0 ? 'text-green-500' : 'text-red-500'}`}>{item.harga.toString()}</td>
              <td className="px-6 py-4 whitespace-nowrap">{new Date(item.tanggal_masuk).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => handleDelete(item.id_barang)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
