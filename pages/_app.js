import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import '../styles/globals.css'; 

const queryClient = new QueryClient();
const theme = createTheme();

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default MyApp;
