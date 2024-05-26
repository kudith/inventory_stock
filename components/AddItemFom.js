import { useState, useEffect } from 'react';
import { Form, Input, Select, Button, message } from 'antd';

const { Option } = Select;

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

  const handleChange = (name, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (values) => {
    const formDataWithDate = {
      ...values,
      tanggal_masuk: new Date().toISOString().substr(0, 10),
    };
    const success = await onSubmit(formDataWithDate);
    if (success) {
      message.error('Gagal menambahkan barang. Silakan coba lagi.');
    } else {
      message.success('Barang berhasil ditambahkan');
      // Reset formulir
      setFormData({
        kode: '',
        nama: '',
        supplier: '',
        kategori: '',
        merk: '',
        stok: '',
        harga: '',
      });
    }
  };

  return (
      <div className="max-w-md mx-auto rounded-md shadow-xl border-2 mt-20 overflow-hidden p-4">
        <Form onFinish={handleSubmit} layout="vertical" initialValues={formData}>
          <Form.Item label="Kode" name="kode" rules={[{ required: true, message: 'Masukkan kode' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Nama" name="nama" rules={[{ required: true, message: 'Masukkan nama' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Supplier" name="supplier" rules={[{ required: true, message: 'Pilih supplier' }]}>
            <Select dropdownClassName={"custom-dropdown"}> {/* Menambahkan properti style dengan zIndex yang lebih tinggi */}
              <Option value="">Pilih Supplier</Option>
              {supplierOptions.map((supplier) => (
                  <Option key={supplier.id_supplier} value={supplier.id_supplier}>
                    {supplier.nama}
                  </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Kategori" name="kategori" rules={[{ required: true, message: 'Pilih kategori' }]}>
            <Select dropdownClassName={"custom-dropdown"}>
              <Option value="">Pilih Kategori</Option>
              {kategoriOptions.map((kategori) => (
                  <Option key={kategori.id_kategori} value={kategori.id_kategori}>
                    {kategori.nama}
                  </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Merk" name="merk" rules={[{ required: true, message: 'Pilih merk' }]}>
            <Select dropdownClassName={"custom-dropdown"}>
              <Option value="">Pilih Merk</Option>
              {merkOptions.map((merk) => (
                  <Option key={merk.id_merk} value={merk.id_merk}>
                    {merk.nama}
                  </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Stok" name="stok" rules={[{ required: true, message: 'Masukkan stok' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Harga" name="harga" rules={[{ required: true, message: 'Masukkan harga' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: '8px' }}>
              Tambah Barang
            </Button>
          </Form.Item>
        </Form>
      </div>
  );
};

export default AddItemForm;
