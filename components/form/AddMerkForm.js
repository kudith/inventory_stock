// components/form/AddMerkForm.js
import React, { useState } from 'react';
import { Box, Button, TextField, DialogActions, DialogContent, CircularProgress } from '@mui/material';

const AddMerkForm = ({ onAdd, onClose }) => {
    const [merkName, setMerkName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await onAdd({ nama: merkName });
            setIsSubmitting(false);
            onClose();
        } catch (error) {
            console.error('Error adding merk:', error);
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Merk Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={merkName}
                    onChange={(e) => setMerkName(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary" variant="outlined">
                    Cancel
                </Button>
                <Button type="submit" color="primary" variant="contained" disabled={isSubmitting}>
                    {isSubmitting ? <CircularProgress size={24} /> : 'Add'}
                </Button>
            </DialogActions>
        </form>
    );
};

export default AddMerkForm;
