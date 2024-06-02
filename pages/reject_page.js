import {useSession} from 'next-auth/react';
import {useQuery, useMutation, useQueryClient} from 'react-query';
import {useRouter} from 'next/router';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
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
import AddRejectForm from '../components/form/addRejectForm'; // Ensure the correct import here
import EditRejectForm from '../components/form/editRejectForm'; // Ensure the correct import here
import RejectTable from '../components/tables/rejectTable';
import {NextUIProvider} from '@nextui-org/react';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Rejects = () => {
    const {data: session, status} = useSession();
    const router = useRouter();
    const queryClient = useQueryClient();

    const [isAddingReject, setIsAddingReject] = useState(false);
    const [isEditingReject, setIsEditingReject] = useState(false);
    const [currentReject, setCurrentReject] = useState(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
        }
    }, [status, router]);

    const {data, error, isLoading, refetch} = useQuery('rejects', async () => {
        const res = await axios.get('/api/reject');
        return res.data;
    });

    const addRejectMutation = useMutation(
        async (newReject) => {
            try {
                const res = await axios.post('/api/reject', newReject);
                return res.data;
            } catch (error) {
                throw new Error(error.response?.data?.message || error.message);
            }
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('rejects');
                refetch();
                toast.success('Barang reject berhasil ditambahkan');
            },
            onError: (error) => {
                console.error('Error adding reject:', error.message);
                toast.error(error.message || 'Failed to add reject item');
            },
        }
    );


    const editRejectMutation = useMutation(
        async (updatedReject) => {
            const {id_reject, ...data} = updatedReject;
            const res = await axios.put(`/api/reject/${id_reject}`, data);
            return res.data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('rejects');
                refetch();
                toast.success('Reject item successfully updated');
            },
            onError: (error) => {
                console.error('Error updating reject:', error.response?.data || error.message);
            },
        }
    );

    const handleAddReject = async (rejectData) => {
        try {
            await addRejectMutation.mutateAsync(rejectData);
            setIsAddingReject(false);
        } catch (error) {
            console.error('Error adding reject:', error);
        }
    };

    const handleEditReject = async (rejectData) => {
        try {
            await editRejectMutation.mutateAsync(rejectData);
            setIsEditingReject(false);
            setCurrentReject(null);
        } catch (error) {
            console.error('Error updating reject:', error);
        }
    };

    const handleEditRejectClick = (reject) => {
        setCurrentReject(reject);
        setIsEditingReject(true);
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
                        <div>
                            <h1 className="text-3xl font-bold">
                                Rejected
                            </h1>
                        </div>
                        <Grid item xs={12}>
                            {isLoading ? (
                                <Box className="flex justify-center items-center h-60">
                                    <CircularProgress/>
                                </Box>
                            ) : error ? (
                                <Box className="flex justify-center items-center h-60">
                                    <Typography variant="h6" color="error">
                                        Error loading rejects
                                    </Typography>
                                    <ErrorOutlineIcon className="ml-1"/>
                                </Box>
                            ) : (
                                <RejectTable
                                    data={data}
                                    onAddItemClick={() => setIsAddingReject(true)}
                                    onEditItemClick={handleEditRejectClick}
                                />
                            )}
                        </Grid>
                    </Grid>
                </Container>
            </div>
            <Dialog
                open={isAddingReject}
                onClose={() => setIsAddingReject(false)}
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
                        Add New Reject
                    </Typography>
                    <IconButton onClick={() => setIsAddingReject(false)}>
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <AddRejectForm open={isAddingReject} onClose={() => setIsAddingReject(false)}
                                   onSubmit={handleAddReject}/>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setIsAddingReject(false)}
                        color="secondary"
                        variant="outlined"
                        sx={{marginRight: '8px'}}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={isEditingReject}
                onClose={() => setIsEditingReject(false)}
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
                        Edit Reject
                    </Typography>
                    <IconButton onClick={() => setIsEditingReject(false)}>
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <EditRejectForm reject={currentReject} onSubmit={handleEditReject}/>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setIsEditingReject(false)}
                        color="secondary"
                        variant="outlined"
                        sx={{marginRight: '8px'}}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            <ToastContainer/>
        </NextUIProvider>
    );
};

export default Rejects;
