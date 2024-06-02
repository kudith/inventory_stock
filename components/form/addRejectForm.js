import React, {useState, useEffect} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    IconButton,
    Box,
    MenuItem
} from '@mui/material';
import {Close as CloseIcon} from '@mui/icons-material';
import axios from 'axios';
import {toast} from "react-toastify";

const AddRejectForm = ({open, onClose, onSubmit}) => {
    const {control, handleSubmit, formState: {errors}} = useForm();
    const [barangList, setBarangList] = useState([]);

    useEffect(() => {
        const fetchBarang = async () => {
            try {
                const response = await axios.get('/api/barang');
                setBarangList(response.data);
            } catch (error) {
                console.error('Failed to fetch barang list:', error);
            }
        };

        fetchBarang();
    }, []);

    const handleFormSubmit = async (data) => {
        try {
            const selectedBarang = barangList.find(barang => barang.id_barang === data.idBarang);
            if (!selectedBarang) {
                console.error('Selected barang not found');
                return;
            }

            if (parseInt(data.jumlah) > selectedBarang.stok) {
                toast.error('jumlah melebihi stok barang yang tersedia');
                return;
            }

            const newData = {
                id_barang: data.idBarang,
                tanggal: data.tanggal,
                jumlah: data.jumlah,
                alasan: data.alasan,
                status: data.status
            };
            await onSubmit(newData);
        } catch (error) {
            console.error('Error submitting reject:', error);
        }
    };


    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                Add New Reject
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500]}}
                >
                    <CloseIcon/>
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <Box mb={2}>
                        <Controller
                            name="idBarang"
                            control={control}
                            defaultValue=""
                            rules={{required: 'ID Barang is required'}}
                            render={({field}) => (
                                <TextField
                                    {...field}
                                    select
                                    label="ID Barang"
                                    fullWidth
                                    error={!!errors.idBarang}
                                    helperText={errors.idBarang?.message}
                                >
                                    {barangList.map((barang) => (
                                        <MenuItem key={barang.id_barang} value={barang.id_barang}>
                                            {barang.nama}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                    </Box>
                    <Box mb={2}>
                        <Controller
                            name="tanggal"
                            control={control}
                            defaultValue=""
                            rules={{required: 'Tanggal is required'}}
                            render={({field}) => (
                                <TextField
                                    {...field}
                                    label="Tanggal"
                                    type="date"
                                    fullWidth
                                    InputLabelProps={{shrink: true}}
                                    error={!!errors.tanggal}
                                    helperText={errors.tanggal?.message}
                                />
                            )}
                        />
                    </Box>
                    <Box mb={2}>
                        <Controller
                            name="jumlah"
                            control={control}
                            defaultValue=""
                            rules={{required: 'Jumlah is required'}}
                            render={({field}) => (
                                <TextField
                                    {...field}
                                    label="Jumlah"
                                    type="number"
                                    fullWidth
                                    error={!!errors.jumlah}
                                    helperText={errors.jumlah?.message}
                                />
                            )}
                        />
                    </Box>
                    <Box mb={2}>
                        <Controller
                            name="alasan"
                            control={control}
                            defaultValue=""
                            rules={{required: 'Alasan is required'}}
                            render={({field}) => (
                                <TextField
                                    {...field}
                                    label="Alasan"
                                    fullWidth
                                    error={!!errors.alasan}
                                    helperText={errors.alasan?.message}
                                />
                            )}
                        />
                    </Box>
                    <Box mb={2}>
                        <Controller
                            name="status"
                            control={control}
                            defaultValue="rejected"
                            rules={{required: 'Status is required'}}
                            render={({field}) => (
                                <TextField
                                    {...field}
                                    select
                                    label="Status"
                                    fullWidth
                                    error={!!errors.status}
                                    helperText={errors.status?.message}
                                >
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="rejected">Rejected</MenuItem>
                                    <MenuItem value="approved">Approved</MenuItem>
                                </TextField>
                            )}
                        />
                    </Box>
                    <DialogActions>
                        <Button onClick={onClose} color="secondary" variant="outlined">
                            Cancel
                        </Button>
                        <Button type="submit" color="primary" variant="contained">
                            Submit
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddRejectForm;
