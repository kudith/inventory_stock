import { useSession } from 'next-auth/react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Box, CircularProgress, Container, Typography, Grid, Button, Dialog, DialogContent, DialogTitle, DialogActions, IconButton } from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AddItemForm from '/components/AddItemFom';
import InventApp from "@/components/inventApp";
import { NextUIProvider } from "@nextui-org/react";

const Dashboard = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const queryClient = useQueryClient();

    const [isAddingItem, setIsAddingItem] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
        }
    }, [status, router]);

    const { data, error, isLoading, refetch } = useQuery('barang', async () => {
        const res = await axios.get('/api/barang');
        return res.data;
    });

    const mutation = useMutation(
        async (newItem) => {
            const res = await axios.post('/api/barang', newItem);
            return res.data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('barang');
                refetch();
            },
            onError: (error) => {
                console.error('Error adding item:', error);
            },
        }
    );

    const handleAddItem = async (itemData) => {
        try {
            await mutation.mutateAsync(itemData);
            setIsAddingItem(false);
        } catch (error) {
            console.error('Error adding item:', error);
        }
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
                            {isLoading ? (
                                <Box className="flex justify-center items-center h-60">
                                    <CircularProgress />
                                </Box>
                            ) : error ? (
                                <Box className="flex justify-center items-center h-60">
                                    <Typography variant="h6" color="error">
                                        Error loading inventory
                                    </Typography>
                                    <ErrorOutlineIcon className="ml-1" />
                                </Box>
                            ) : (
                                <>
                                    <Button
                                        onClick={() => setIsAddingItem(true)}
                                        variant="contained"
                                        color="primary"
                                        startIcon={<AddIcon />}
                                        className=""
                                        size="large"
                                        sx={{
                                            backgroundColor: '#1976d2',
                                            ':hover': {
                                                backgroundColor: '#115293',
                                            },
                                            padding: '10px 20px',
                                            fontWeight: 'bold',
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                        }}
                                    >
                                        Add Item
                                    </Button>
                                    <InventApp data={data} />
                                </>
                            )}
                        </Grid>
                    </Grid>
                </Container>
            </div>
            <Dialog
                open={isAddingItem}
                onClose={() => setIsAddingItem(false)}
                fullWidth
                maxWidth="md"
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: '16px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    },
                }}
            >
                <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Add New Item</Typography>
                    <IconButton onClick={() => setIsAddingItem(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <AddItemForm onSubmit={handleAddItem} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsAddingItem(false)} color="secondary" variant="outlined" sx={{ marginRight: '8px' }}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </NextUIProvider>
    );
};

export default Dashboard;
