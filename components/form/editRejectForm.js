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

const EditRejectForm = ({ open, onClose, reject, barangList }) => {
    const queryClient = useQueryClient();
    const [barang, setBarang] = useState(null);
    const [jumlah, setJumlah] = useState('');
    const [catatan, setCatatan] = useState('');

    useEffect(() => {
        if (reject) {
            setBarang(barangList.find(item => item.id_barang === reject.id_barang) || null);
            setJumlah(reject.jumlah.toString());
            setCatatan(reject.catatan);
        }
    }, [reject, barangList]);

    const handleClose = () => {
        onClose();
        setBarang(null);
        setJumlah('');
        setCatatan('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const tanggal = new Date().toISOString();

        try {
            // Check if the quantity exceeds the available stock
            if (barang.stok + reject.jumlah < parseInt(jumlah)) {
                toast.error('Stok yang dimasukkan melebihi stok yang tersedia.');
                return;
            }

            // Update Reject
            const response = await axios.put(`/api/reject/${reject.id_reject}`, {
                id_barang: barang.id_barang,
                tanggal,
                jumlah: parseInt(jumlah),
                catatan,
            });

            // Update barang stock
            await axios.put(`/api/barang/${barang.id_barang}`, {
                stok: barang.stok + reject.jumlah - parseInt(jumlah),
            });

            // Invalidate queries to update data on the client
            queryClient.invalidateQueries('barang');
            queryClient.invalidateQueries('rejects');
            toast.success('Reject berhasil diperbarui');
            handleClose();
        } catch (error) {
            console.error('Error updating reject:', error);
            toast.error('Gagal memperbarui reject. Silakan coba lagi.');
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle>
                Edit Reject
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
                                type="date"
                                label="Tanggal Reject"
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
                                label="Catatan"
                                value={catatan}
                                onChange={(e) => setCatatan(e.target.value)}
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

export default EditRejectForm;
