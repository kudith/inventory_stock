import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery, useQueryClient } from 'react-query';
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
    DialogContent,
    DialogTitle,
    DialogActions,
    IconButton,
} from '@mui/material';
import { Close as CloseIcon, ErrorOutline as ErrorOutlineIcon } from '@mui/icons-material';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';
import InventApp from '../components/inventApp';
import { NextUIProvider } from '@nextui-org/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TransaksiMasukTable from '@/components/TransaksiMasukTable';
import AddTransaksiMasukForm from '@/components/TransaksiMasukForm'; // Ensure the path is correct

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

    const { data: barangList, error: barangError, isLoading: barangLoading } = useQuery('barang', async () => {
        const res = await axios.get('/api/barang');
        return res.data;
    });

    const { data: transaksiMasukData, error: transaksiMasukError, isLoading: transaksiMasukLoading } = useQuery('transaksiMasuk', async () => {
        const res = await axios.get('/api/transaksi_masuk');
        return res.data;
    });

    const { data: suppliers, error: suppliersError, isLoading: suppliersLoading } = useQuery('suppliers', async () => {
        const res = await axios.get('/api/suppliers');
        return res.data;
    });

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

    const handleAddItemClick = () => {
        setIsAddingItem(true);
    };

    const handleCloseDialog = () => {
        setIsAddingItem(false);
        // Reset any necessary states here
    };

    return (
        <NextUIProvider className="flex">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <DashboardHeader />
                <Container className="flex-1 mx-auto my-20">
                    <Grid container justifyContent="center" alignItems="center" spacing={2}>
                        <Grid item xs={12}>
                            {barangLoading ? (
                                <Box className="flex justify-center items-center h-60">
                                    <CircularProgress />
                                </Box>
                            ) : barangError ? (
                                <Box className="flex justify-center items-center h-60">
                                    <Typography variant="h6" color="error">
                                        Error loading inventory
                                    </Typography>
                                    <ErrorOutlineIcon className="ml-1" />
                                </Box>
                            ) : (
                                <>
                                </>
                            )}
                            <TransaksiMasukTable
                                 data={transaksiMasukData}
                                 onAddItemClick={handleAddItemClick}
                            />
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
                <DialogTitle
                    sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc' }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Tambah Transaksi Masuk</Typography>
                    <IconButton
                        aria-label="close"
                        onClick={() => setIsAddingItem(false)}
                        sx={{
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {/* Ensure barangList and suppliers are loaded */}
                    {barangList && suppliers ? (
                        <AddTransaksiMasukForm
                            open={isAddingItem}
                            onClose={() => setIsAddingItem(false)}
                            suppliers={suppliers}
                            barangList={barangList}
                        />
                    ) : (
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <CircularProgress />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsAddingItem(false)} color="secondary" variant="outlined">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        </NextUIProvider>
    );
};

export default Dashboard;
