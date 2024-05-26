import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import '../styles/globals.css';
import {NextUIProvider} from "@nextui-org/react";

const queryClient = new QueryClient();
const theme = createTheme();

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <NextUIProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </NextUIProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default MyApp;
