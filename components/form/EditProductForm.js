import React, {useState, useEffect} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Select,
    MenuItem,
} from '@mui/material';

const EditProductForm = ({open, item, onEdit, onClose}) => {
    const [formData, setFormData] = useState({
        nama: '',
        stok: '',
        harga: '',
        merk: '',
        kategori: '',
    });

    const [merkList, setMerkList] = useState([]);
    const [kategoriList, setKategoriList] = useState([]);

    useEffect(() => {
        if (item) {
            setFormData({
                nama: item.nama || '',
                stok: item.stok || '',
                harga: item.harga || '',
                merk: item.merk.id_merk || '',
                kategori: item.kategori.id_kategori || '',
            });
        }
    }, [item]);

    useEffect(() => {
        // Fetch Merk data from API
        fetch('/api/merk')
            .then(response => response.json())
            .then(data => setMerkList(data));

        // Fetch Kategori data from API
        fetch('/api/kategori')
            .then(response => response.json())
            .then(data => setKategoriList(data));
    }, []);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({...prevData, [name]: value}));
    };

    const handleMerkChange = (e) => {
        const value = e.target.value;
        setFormData((prevData) => ({...prevData, merk: value}));
    };

    const handleKategoriChange = (e) => {
        const value = e.target.value;
        setFormData((prevData) => ({...prevData, kategori: value}));
    };

    const handleSave = () => {
        const data = {
            id_barang: item.id_barang,
            nama: formData.nama,
            stok: Number(formData.stok),
            harga: Number(formData.harga),
            merk: Number(formData.merk),
            kategori: Number(formData.kategori),
        };

        console.log('Sending PUT request data:', data);

        // Menggunakan callback `onEdit` untuk mengirimkan data
        onEdit(data);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Edit Product</DialogTitle>
            <DialogContent>
                <TextField
                    label="Nama"
                    placeholder="Nama"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Stok"
                    placeholder="Stok"
                    name="stok"
                    value={formData.stok}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Harga"
                    placeholder="Harga"
                    name="harga"
                    value={formData.harga}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    fullWidth
                    margin="normal"
                />
                <Select
                    label="Merk"
                    value={formData.merk}
                    onChange={handleMerkChange} // Ubah fungsi
                    name="merk"
                    fullWidth
                    margin="normal"
                >
                    {merkList.map((merk) => (
                        <MenuItem key={merk.id_merk} value={merk.id_merk}>{merk.nama}</MenuItem>
                    ))}
                </Select>
                <Select
                    label="Kategori"
                    value={formData.kategori}
                    onChange={handleKategoriChange} // Ubah fungsi
                    name="kategori"
                    fullWidth
                    margin="normal"
                >
                    {kategoriList.map((kategori) => (
                        <MenuItem key={kategori.id_kategori} value={kategori.id_kategori}>{kategori.nama}</MenuItem>
                    ))}
                </Select>

            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSave} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditProductForm;
