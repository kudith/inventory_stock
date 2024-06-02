import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
    Box,
    CircularProgress,
    Container,
    Typography,
    Grid,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
} from '@mui/material';
import { Close as CloseIcon, ErrorOutline as ErrorOutlineIcon } from '@mui/icons-material';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';
import { NextUIProvider } from '@nextui-org/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SuppliersTable from '@/components/tables/SuppliersTable';
import AddSupplierForm from '@/components/form/AddSupplierForm';
import EditSupplierForm from '@/components/form/EditSupplierForm';

const SupplierPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const queryClient = useQueryClient();

    const [isAddingItem, setIsAddingItem] = useState(false);
    const [isEditingItem, setIsEditingItem] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
        }
    }, [status, router]);

    const { data: supplierList, error: supplierError, isLoading: supplierLoading } = useQuery('suppliers', async () => {
        const res = await axios.get('/api/suppliers');
        return res.data;
    });

    const addSupplierMutation = useMutation(
        newSupplier => axios.post('/api/suppliers', newSupplier),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('suppliers');
                setIsAddingItem(false);
            },
            onError: (error) => {
                console.error('Error adding new supplier:', error);
            }
        }
    );

    const deleteSupplierMutation = useMutation(
        id => axios.delete('/api/suppliers', { data: { id } }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('suppliers');
            },
            onError: (error) => {
                console.error('Error deleting supplier:', error);
            }
        }
    );

    const editSupplierMutation = useMutation(
        updatedSupplier => axios.put(`/api/suppliers?id_supplier=${updatedSupplier.id_supplier}`, updatedSupplier),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('suppliers');
                setIsEditingItem(false);
                setCurrentItem(null);
            },
            onError: (error) => {
                console.error('Error updating supplier:', error);
            }
        }
    );

    const handleAddItemClick = () => {
        setIsAddingItem(true);
    };

    const handleEditItemClick = (item) => {
        setCurrentItem(item);
        setIsEditingItem(true);
    };

    const handleCloseDialog = () => {
        setIsAddingItem(false);
        setIsEditingItem(false);
        setCurrentItem(null);
    };

    if (status === 'loading' || status === 'unauthenticated') {
        return (
            <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 flex justify-center items-center">
                    <CircularProgress />
                </div>
            </div>
        );
    }

    return (
        <NextUIProvider className="flex">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <DashboardHeader />
                <Container className="flex-1 mx-auto my-20">
                    <Grid container justifyContent="center" alignItems="center" spacing={2}>
                        <div>
                            <h1 className="text-3xl font-bold">
                                Suppliers
                            </h1>
                        </div>
                        <Grid item xs={12}>
                            {supplierLoading ? (
                                <Box className="flex justify-center items-center h-60">
                                    <CircularProgress/>
                                </Box>
                            ) : supplierError ? (
                                <Box className="flex justify-center items-center h-60">
                                    <Typography variant="h6" color="error">
                                        Error loading suppliers
                                    </Typography>
                                    <ErrorOutlineIcon className="ml-1"/>
                                </Box>
                            ) : (
                                <SuppliersTable
                                    data={supplierList}
                                    onAddItemClick={handleAddItemClick}
                                    onDeleteItem={id => deleteSupplierMutation.mutate(id)}
                                    onEditItemClick={handleEditItemClick}
                                />
                            )}

                        </Grid>

                    </Grid>
                </Container>
            </div>
            <Dialog
                open={isAddingItem || isEditingItem}
                onClose={handleCloseDialog}
                fullWidth
                maxWidth="md"
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: '16px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    },
                }}
            >
                <DialogTitle
                    sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc' }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {isAddingItem ? 'Tambah Supplier' : 'Edit Supplier'}
                    </Typography>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseDialog}
                        sx={{
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {isAddingItem ? (
                        <AddSupplierForm
                            onAddSupplier={(newSupplier) => addSupplierMutation.mutate(newSupplier)}
                        />
                    ) : (
                        <EditSupplierForm
                            open={isEditingItem}
                            item={currentItem}
                            onEdit={(updatedSupplier) => editSupplierMutation.mutate(updatedSupplier)}
                            onClose={handleCloseDialog}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary" variant="outlined">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        </NextUIProvider>
    );
};

export default SupplierPage;
