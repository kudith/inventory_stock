import { useState, useEffect } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { toast } from 'react-toastify';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataWithDate = {
        ...formData,
        tanggal_masuk: new Date().toISOString().substr(0, 10),
    };

    // Panggil endpoint untuk cek apakah nama barang sudah ada
    const response = await fetch('/api/check-nama', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nama: formData.nama }),
    });

    if (response.ok) {
        const { exists } = await response.json();
        if (exists) {
            toast.error('Nama barang sudah ada');
            return;
        }
    }

    const success = await onSubmit(formDataWithDate);
    if (success) {
        setFormData({
            kode: '',
            nama: '',
            supplier: '',
            kategori: '',
            merk: '',
            stok: '',
            harga: '',
        });
        toast.success('Barang berhasil ditambahkan');
    } else {
        // toast.error('Gagal menambahkan barang');
    }
};


  return (
      <Box className="max-w-xl mx-auto rounded-md shadow-xl border-2 mt-20 overflow-hidden p-4">
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <TextField
                label="Kode"
                name="kode"
                value={formData.kode}
                onChange={handleChange}
                required
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
                label="Nama"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                required
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Supplier</InputLabel>
            <Select
                label="Supplier"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                required
            >
              <MenuItem value="">Pilih Supplier</MenuItem>
              {supplierOptions.map((supplier) => (
                  <MenuItem key={supplier.id_supplier} value={supplier.id_supplier}>
                    {supplier.nama}
                  </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Kategori</InputLabel>
            <Select
                label="Kategori"
                name="kategori"
                value={formData.kategori}
                onChange={handleChange}
                required
            >
              <MenuItem value="">Pilih Kategori</MenuItem>
              {kategoriOptions.map((kategori) => (
                  <MenuItem key={kategori.id_kategori} value={kategori.id_kategori}>
                    {kategori.nama}
                  </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Merk</InputLabel>
            <Select
                label="Merk"
                name="merk"
                value={formData.merk}
                onChange={handleChange}
                required
            >
              <MenuItem value="">Pilih Merk</MenuItem>
              {merkOptions.map((merk) => (
                  <MenuItem key={merk.id_merk} value={merk.id_merk}>
                    {merk.nama}
                  </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
                label="Stok"
                name="stok"
                type="number"
                value={formData.stok}
                onChange={handleChange}
                required
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
                label="Harga"
                name="harga"
                type="number"
                value={formData.harga}
                onChange={handleChange}
                required
            />
          </FormControl>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Tambah Barang
          </Button>
        </form>
      </Box>
  );
};

export default AddItemForm;
