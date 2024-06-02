import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const AddSupplierForm = ({ onAddSupplier }) => {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [telepon, setTelepon] = useState('');
  const [alamat, setAlamat] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSupplier = { nama, email, telepon, alamat };
    onAddSupplier(newSupplier);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="flex flex-col gap-4" sx={{ mt: 2 }}>
      <TextField
        label="Nama"
        placeholder="Nama"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
        type="email"
        required
      />
      <TextField
        label="Telepon"
        placeholder="Telepon"
        value={telepon}
        onChange={(e) => setTelepon(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Alamat"
        placeholder="Alamat"
        value={alamat}
        onChange={(e) => setAlamat(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <Button type="submit" color="primary" variant="contained" sx={{ mt: 2 }}>
        Add Supplier
      </Button>
    </Box>
  );
};

export default AddSupplierForm;
