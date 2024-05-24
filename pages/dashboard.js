import { useSession } from 'next-auth/react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Box, CircularProgress, Container, Typography, Grid, Button } from '@mui/material';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader'; 
import InventoryTable from '../components/InventoryTable';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AddItemForm from '../components/AddItemFom';

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

  const { data, error, isLoading } = useQuery('barang', async () => {
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
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <Container className="flex-1 mx-auto my-8">
          {isAddingItem ? (
            <div className="mb-4">
              <AddItemForm onSubmit={handleAddItem} />
            </div>
          ) : (
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
                    <Button onClick={() => setIsAddingItem(true)} variant="contained" color="primary" className="mb-8">
                      Add Item
                    </Button>
                    <InventoryTable items={data} />
                  </>
                )}
              </Grid>
            </Grid>
          )}
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;
