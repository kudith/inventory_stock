import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

const EditSupplierForm = ({ open, item, onEdit, onClose }) => {
    const [formData, setFormData] = useState({
        nama: '',
        email: '',
        telepon: '',
        alamat: '',
    });

    useEffect(() => {
        if (item) {
            setFormData({
                nama: item.nama || '',
                email: item.email || '',
                telepon: item.telepon || '',
                alamat: item.alamat || '',
            });
        }
    }, [item]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSave = () => {
        onEdit({ id_supplier: item.id_supplier, ...formData });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Edit Supplier</DialogTitle>
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
                    label="Email"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Telepon"
                    placeholder="Telepon"
                    name="telepon"
                    value={formData.telepon}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Alamat"
                    placeholder="Alamat"
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    fullWidth
                    margin="normal"
                />
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

export default EditSupplierForm;
