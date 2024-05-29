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
    const [barang, setBarang] = useState(null);
    const [supplier, setSupplier] = useState(null);
    const [jumlah, setJumlah] = useState('');
    const [hargaSatuan, setHargaSatuan] = useState('');
    const [totalHarga, setTotalHarga] = useState('');

    useEffect(() => {
        // Hitung total harga berdasarkan jumlah dan harga satuan
        if (jumlah && hargaSatuan) {
            const total = parseFloat(jumlah) * parseFloat(hargaSatuan);
            setTotalHarga(total.toFixed(2));
        }
    }, [jumlah, hargaSatuan]);

    const handleClose = () => {
        onClose();
        setBarang(null);
        setSupplier(null);
        setJumlah('');
        setHargaSatuan('');
        setTotalHarga('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const tanggal = new Date().toISOString();

        try {
            // Tambahkan transaksi masuk
            const response = await axios.post('/api/transaksi_masuk', {
                nama_barang: barang.nama,
                tanggal,
                harga_satuan: parseFloat(hargaSatuan),
                jumlah: parseInt(jumlah),
                total_harga: parseFloat(totalHarga),
                catatan: '', // tambahkan catatan jika diperlukan
            });

            // Perbarui stok barang
            await axios.put(`/api/barang/${barang.id_barang}`, {
                stok: barang.stok + parseInt(jumlah), // Tambah stok baru dengan jumlah yang dimasukkan
                harga: parseFloat(hargaSatuan),
                tanggal_masuk: tanggal,
            });

            // Invalidate queries untuk memperbarui data di client
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
                                    if (newValue) {
                                        // Set harga satuan berdasarkan harga barang yang dipilih
                                        setHargaSatuan(newValue.harga);
                                        // Set supplier berdasarkan supplier barang yang dipilih
                                        setSupplier(newValue.supplier);
                                    }
                                }}
                                options={barangList}
                                getOptionLabel={(option) => option.nama}
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
                                getOptionLabel={(option) => option.nama}
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
                                type="date"
                                label="Tanggal Transaksi"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                defaultValue={new Date().toISOString().split('T')[0]}
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
                    <DialogActions>
                        <Button onClick={handleClose} color="secondary" variant="outlined">
                            Cancel
                        </Button>
                        <Button type="submit" color="primary" variant="contained">
                            Submit
                        </Button>
                    </DialogActions>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default AddTransaksiMasukForm;
