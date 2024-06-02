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
import InventApp from '../components/tables/inventApp';
import { NextUIProvider } from '@nextui-org/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddTransaksiMasukForm from '@/components/form/TransaksiMasukForm';
import TransaksiKeluarTable from "@/components/tables/TansaksiKeluar";
import TransaksiKeluarForm from "@/components/form/TransaksiKeluarForm"; // Ensure the path is correct

const DashboardTransaksiKeluar = () => {
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

    const { data: transaksiKeluarData, error: transaksiKeluarError, isLoading: transaksiKeluarLoading } = useQuery('transaksiKeluar', async () => {
        const res = await axios.get('/api/transaksi_keluar');
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
                        <div>
                            <h1 className="text-3xl font-bold">
                                Product Out
                            </h1>
                        </div>
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
                            <TransaksiKeluarTable
                                 data={transaksiKeluarData}
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
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Tambah Transaksi Keluar</Typography>
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
                    {barangList ? (
                        <TransaksiKeluarForm
                            open={isAddingItem}
                            onClose={() => setIsAddingItem(false)}
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

export default DashboardTransaksiKeluar;
