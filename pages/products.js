import {useSession} from 'next-auth/react';
import {useQuery, useMutation, useQueryClient} from 'react-query';
import {useRouter} from 'next/router';
import axios from 'axios';
import {useEffect, useState} from 'react';
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
    IconButton
} from '@mui/material';
import {Add as AddIcon, Close as CloseIcon} from '@mui/icons-material';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';
import {ErrorOutline as ErrorOutlineIcon} from '@mui/icons-material';
import AddItemForm from '../components/form/AddItemFom';
import EditProductForm from '../components/form/EditProductForm'; // Corrected import
import InventApp from '../components/tables/inventApp';
import {NextUIProvider} from '@nextui-org/react';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Products = () => {
    const {data: session, status} = useSession();
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

    const {data, error, isLoading, refetch} = useQuery('barang', async () => {
        const res = await axios.get('/api/barang');
        return res.data;
    });

    const addItemMutation = useMutation(
        async (newItem) => {
            const res = await axios.post('/api/barang', newItem);
            return res.data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('barang');
                refetch();
                toast.success('Barang berhasil ditambahkan');
            },
            onError: (error) => {
                console.error('Error adding item:', error);
            },
        }
    );

    const editItemMutation = useMutation(
        async (updatedItem) => {
            const {id_barang, ...data} = updatedItem;
            console.log(`Sending PUT request to /api/barang/${id_barang}`, data);
            const res = await axios.put(`/api/barang/${id_barang}`, data);
            return res.data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('barang');
                refetch();
                toast.success('Barang berhasil diperbarui');
            },
            onError: (error) => {
                console.error('Error updating item:', error.response?.data || error.message);
            },
        }
    );


    const handleAddItem = async (itemData) => {
        try {
            await addItemMutation.mutateAsync(itemData);
            setIsAddingItem(false);
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    const handleEditItem = async (itemData) => {
        try {
            await editItemMutation.mutateAsync(itemData);
            setIsEditingItem(false);
            setCurrentItem(null);
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };


    const handleEditItemClick = (item) => {
        setCurrentItem(item);
        setIsEditingItem(true);
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
                        <div className="flex">
                            <h1 className="text-3xl font-bold">Products</h1>
                        </div>
                        <Grid item xs={12}>
                            {isLoading ? (
                                <Box className="flex justify-center items-center h-60">
                                    <CircularProgress/>
                                </Box>
                            ) : error ? (
                                <Box className="flex justify-center items-center h-60">
                                    <Typography variant="h6" color="error">
                                        Error loading inventory
                                    </Typography>
                                    <ErrorOutlineIcon className="ml-1"/>
                                </Box>
                            ) : (
                                <InventApp
                                    data={data}
                                    onAddItemClick={() => setIsAddingItem(true)}
                                    onEditItemClick={handleEditItemClick}
                                />
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
                <DialogTitle
                    sx={{
                        m: 0,
                        p: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid #ccc',
                    }}
                >
                    <Typography variant="h6" sx={{fontWeight: 'bold'}}>
                        Add New Item
                    </Typography>
                    <IconButton onClick={() => setIsAddingItem(false)}>
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <AddItemForm onSubmit={handleAddItem}/>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setIsAddingItem(false)}
                        color="secondary"
                        variant="outlined"
                        sx={{marginRight: '8px'}}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            <EditProductForm
                open={isEditingItem}
                item={currentItem}
                onEdit={handleEditItem}
                onClose={() => setIsEditingItem(false)}
            />
            <ToastContainer/>
        </NextUIProvider>
    );
};

export default Products;
