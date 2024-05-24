import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function BarangList() {
  const { data, error } = useSWR('/api/barang', fetcher);

  if (error) return <div>Error fetching data.</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Daftar Barang</h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Kode</th>
              <th>Nama Barang</th>
              <th>Stok</th>
              <th>Harga</th>
              <th>Tanggal Masuk</th>
              <th>Supplier</th>
              <th>Kategori</th>
              <th>Merk</th>
            </tr>
          </thead>
          <tbody>
            {data.map((barang) => (
              <tr key={barang.id_barang}>
                <td>{barang.kode}</td>
                <td>{barang.nama}</td>
                <td>{barang.stok}</td>
                <td>{barang.harga}</td>
                <td>{new Date(barang.tanggal_masuk).toLocaleDateString()}</td>
                <td>{barang.supplier.nama}</td>
                <td>{barang.kategori.nama}</td>
                <td>{barang.merk.nama}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
