// pages/merk_page.js
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
import MerkTable from '@/components/tables/MerkList';
import AddMerkForm from '@/components/form/AddMerkForm';
import EditMerkForm from '@/components/form/EditMerkForm';
import SuppliersTable  from "@/components/tables/SuppliersTable";

const MerkPage = () => {
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

    const { data: merkList, error: merkError, isLoading: merkLoading } = useQuery('merk', async () => {
        const res = await axios.get('/api/merk');
        return res.data;
    });

    const addMerkMutation = useMutation(
        newMerk => axios.post('/api/merk', newMerk),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('merk');
                setIsAddingItem(false);
            },
            onError: (error) => {
                console.error('Error adding new merk:', error);
            }
        }
    );

    const deleteMerkMutation = useMutation(
        id => axios.delete('/api/merk', { data: { id } }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('merk');
            },
            onError: (error) => {
                console.error('Error deleting merk:', error);
            }
        }
    );

    const editMerkMutation = useMutation(
        updatedMerk => axios.put('/api/merk', updatedMerk),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('merk');
                setIsEditingItem(false);
                setCurrentItem(null);
            },
            onError: (error) => {
                console.error('Error updating merk:', error);
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
                        <Grid item xs={12}>
                            {merkLoading ? (
                                <Box className="flex justify-center items-center h-60">
                                    <CircularProgress />
                                </Box>
                            ) : merkError ? (
                                <Box className="flex justify-center items-center h-60">
                                    <Typography variant="h6" color="error">
                                        Error loading merk
                                    </Typography>
                                    <ErrorOutlineIcon className="ml-1" />
                                </Box>
                            ) : (
                                <MerkTable
                                    data={merkList}
                                    onAddItemClick={handleAddItemClick}
                                    onDeleteItem={id => deleteMerkMutation.mutate(id)}
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
                        {isAddingItem ? 'Tambah Merk' : 'Edit Merk'}
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
                        <AddMerkForm
                            onAdd={(newMerk) => addMerkMutation.mutate(newMerk)}
                            onClose={handleCloseDialog}
                        />
                    ) : (
                        <EditMerkForm
                            item={currentItem}
                            onEdit={(updatedMerk) => editMerkMutation.mutate(updatedMerk)}
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

export default MerkPage;
