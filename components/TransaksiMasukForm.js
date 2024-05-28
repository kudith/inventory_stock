import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    TextField,
    Typography,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import Autocomplete from '@mui/material/Autocomplete';

const AddTransaksiMasukForm = ({ open, onClose, suppliers, barangList }) => {
    const queryClient = useQueryClient();
    const [barang, setBarang] = useState(null); // Menggunakan null untuk nilai awal
    const [supplier, setSupplier] = useState(null); // Menggunakan null untuk nilai awal
    const [jumlah, setJumlah] = useState(''); // Menggunakan string untuk nilai awal
    const [hargaSatuan, setHargaSatuan] = useState(''); // Menggunakan string untuk nilai awal
    const [totalHarga, setTotalHarga] = useState(''); // Menambah state untuk total harga

    useEffect(() => {
        if (jumlah && hargaSatuan) {
            // Menghitung total harga berdasarkan stok dikali harga satuan
            const total = parseFloat(jumlah) * parseFloat(hargaSatuan);
            setTotalHarga(total.toFixed(2)); // Bulatkan total harga menjadi 2 digit desimal
        }
    }, [jumlah, hargaSatuan]);

    const handleClose = () => {
        onClose();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const tanggal = new Date().toISOString();

        try {
            // Add entry to Transaksi Masuk table
            await axios.post('/api/transaksi_masuk', {
                id_barang: barang.id, // Mengirimkan ID barang, bukan hanya nama
                id_supplier: supplier.id, // Mengirimkan ID supplier, bukan hanya nama
                tanggal,
                harga_satuan: parseFloat(hargaSatuan),
                jumlah: parseInt(jumlah),
                total_harga: parseFloat(totalHarga), // Menggunakan total harga yang sudah dihitung
            });

            // Update Barang table
            await axios.put(`/api/barang/${barang.id}`, {
                stok: parseInt(jumlah),
                harga: parseFloat(hargaSatuan),
                tanggal_masuk: tanggal,
            });

            queryClient.invalidateQueries('barang');
            queryClient.invalidateQueries('transaksiMasuk');
            toast.success('Transaksi Masuk berhasil ditambahkan');
            handleClose();
        } catch (error) {
            console.error('Error adding Transaksi Masuk:', error);
            toast.error('Gagal menambahkan Transaksi Masuk. Silakan coba lagi.');
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle>
                Tambah Transaksi Masuk
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Autocomplete
                                fullWidth
                                value={barang}
                                onChange={(event, newValue) => {
                                    setBarang(newValue);
                                }}
                                options={barangList}
                                getOptionLabel={(option) => option.nama} // Menampilkan nama barang
                                renderInput={(params) => <TextField {...params} label="Nama Barang" required />}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete
                                fullWidth
                                value={supplier}
                                onChange={(event, newValue) => {
                                    setSupplier(newValue);
                                }}
                                options={suppliers}
                                getOptionLabel={(option) => option.nama} // Menampilkan nama supplier
                                renderInput={(params) => <TextField {...params} label="Nama Supplier" required />}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Jumlah"
                                value={jumlah}
                                onChange={(e) => setJumlah(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Harga Satuan"
                                value={hargaSatuan}
                                onChange={(e) => setHargaSatuan(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Total Harga"
                                value={totalHarga}
                                disabled
                            />
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary" variant="outlined">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary" variant="contained">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddTransaksiMasukForm;
