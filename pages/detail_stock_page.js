import {useSession} from 'next-auth/react';
import {useQuery, useMutation, useQueryClient} from 'react-query';
import {useRouter} from 'next/router';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {Box, CircularProgress, Container, Typography, Grid, IconButton} from '@mui/material';
import {ErrorOutline as ErrorOutlineIcon} from '@mui/icons-material';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';
import DetailStokApp from '/components/tables/detailStockTable';
import {NextUIProvider} from '@nextui-org/react';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DetailStock = () => {
    const {data: session, status} = useSession();
    const router = useRouter();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
        }
    }, [status, router]);

    const {data, error, isLoading, refetch} = useQuery('detail_stock', async () => {
        const res = await axios.get('/api/detail_stock');
        return res.data;
    });


    const editItemMutation = useMutation(
        async (updatedItem) => {
            const {id_stock, ...data} = updatedItem;
            const res = await axios.put(`/api/detail_stock/${id_stock}`, data);
            return res.data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('detail_stock');
                refetch();
                toast.success('Detail stock berhasil diperbarui');
            },
            onError: (error) => {
                console.error('Error updating item:', error.response?.data || error.message);
            },
        }
    );

    const handleEditItem = async (itemData) => {
        try {
            await editItemMutation.mutateAsync(itemData);
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    if (status === 'loading' || status === 'unauthenticated') {
        return (
            <div className="flex min-h-screen">
                <Sidebar/>
                <div className="flex-1 flex justify-center items-center">
                    <CircularProgress/>
                </div>
            </div>
        );
    }

    return (
        <NextUIProvider className="flex">
            <Sidebar/>
            <div className="flex-1 flex flex-col">
                <DashboardHeader/>
                <Container className="flex-1 mx-auto my-20">
                    <Grid container justifyContent="center" alignItems="center" spacing={2}>
                        <Grid item xs={12}>
                            {isLoading ? (
                                <Box className="flex justify-center items-center h-60">
                                    <CircularProgress/>
                                </Box>
                            ) : error ? (
                                <Box className="flex justify-center items-center h-60">
                                    <Typography variant="h6" color="error">
                                        Error loading detail stock
                                    </Typography>
                                    <ErrorOutlineIcon className="ml-1"/>
                                </Box>
                            ) : (
                                <DetailStokApp
                                    data={data}
                                    onEditItemClick={handleEditItem}
                                />
                            )}
                        </Grid>
                    </Grid>
                </Container>
            </div>
            <ToastContainer/>
        </NextUIProvider>
    );
};

export default DetailStock;
