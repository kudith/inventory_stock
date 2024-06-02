// components/AddItemFormModal.js

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, Button } from '@mui/material';
import AddItemForm from './form/AddItemFom';

const AddItemFormModal = ({ onSubmit, onClose }) => {
    const [formData, setFormData] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        onSubmit(formData);
    };

    return (
        <Dialog open onClose={onClose}>
            <DialogTitle>Add New Item</DialogTitle>
            <DialogContent>
                <AddItemForm onChange={handleChange} />
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Submit
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default AddItemFormModal;
