import { useEffect, useState } from 'react';

const InventoryTable = ({ items }) => {
  const [itemList, setItemList] = useState(items);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setItemList(items);
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
        setItemList(itemList.filter(item => item.id_barang !== id_barang));
      } else {
        console.error('Failed to delete item');
      }
    } catch (error) {
      console.error('Failed to delete item', error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const filteredItems = items.filter(item =>
        item.nama.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setItemList(filteredItems);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  return (
      <div className="rounded-lg overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <input
              type="text"
              placeholder="Search by name..."
              className="px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-500 rounded-lg"
              value={searchTerm}
              onChange={handleSearch}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Barang</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Merk</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {itemList.map((item) => (
                <tr key={item.id_barang} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.id_barang}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.nama}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.stok}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${item.harga >= 0 ? 'text-green-500' : 'text-red-500'}`}>{formatCurrency(item.harga)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.merk.nama}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.kategori.nama}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
      </div>
  );
};

export default InventoryTable;