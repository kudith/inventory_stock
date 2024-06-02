import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    TextField,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import Autocomplete from '@mui/material/Autocomplete';

const AddTransaksiKeluarForm = ({ open, onClose, suppliers, barangList }) => {
    const queryClient = useQueryClient();
    const [barang, setBarang] = useState(null);
    const [jumlah, setJumlah] = useState('');
    const [hargaSatuan, setHargaSatuan] = useState('');
    const [totalHarga, setTotalHarga] = useState('');

    useEffect(() => {
        // Calculate total price based on quantity and unit price
        if (jumlah && hargaSatuan) {
            const total = parseFloat(jumlah) * parseFloat(hargaSatuan);
            setTotalHarga(total.toFixed(2));
        }
    }, [jumlah, hargaSatuan]);

    const handleClose = () => {
        onClose();
        setBarang(null);
        setJumlah('');
        setHargaSatuan('');
        setTotalHarga('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const tanggal = new Date().toISOString();

        try {
            // Check if the quantity exceeds the available stock
            if (barang.stok < parseInt(jumlah)) {
                toast.error('Stok yang dimasukkan melebihi stok yang tersedia.');
                return;
            }

            // Add Transaksi Keluar
            const response = await axios.post('/api/transaksi_keluar', {
                id_barang: barang.id_barang,
                tanggal,
                harga_satuan: parseFloat(hargaSatuan),
                jumlah: parseInt(jumlah),
                total_harga: parseFloat(totalHarga),
                catatan: '', // add notes if necessary
            });

            // Update barang stock
            await axios.put(`/api/barang/${barang.id_barang}`, {
                stok: barang.stok - parseInt(jumlah),
                harga: parseFloat(hargaSatuan),
                tanggal_keluar: tanggal,
            });

            // Invalidate queries to update data on the client
            queryClient.invalidateQueries('barang');
            queryClient.invalidateQueries('transaksiKeluar');
            toast.success('Transaksi Keluar berhasil ditambahkan');
            handleClose();
        } catch (error) {
            console.error('Error adding Transaksi Keluar:', error);
            toast.error('Gagal menambahkan Transaksi Keluar. Silakan coba lagi.');
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle>
                Tambah Transaksi Keluar
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
                                        setHargaSatuan(newValue.harga);
                                    }
                                }}
                                options={barangList}
                                getOptionLabel={(option) => option.nama}
                                renderInput={(params) => <TextField {...params} label="Nama Barang" required />}
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
                                label="Harga Satuan"
                                value={hargaSatuan ? formatCurrency(hargaSatuan) : ''}
                                InputProps={{
                                    readOnly: true,
                                }}
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
                                label="Total Harga"
                                value={totalHarga ? formatCurrency(totalHarga) : ''}
                                InputProps={{
                                    readOnly: true,
                                }}
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

export default AddTransaksiKeluarForm;
