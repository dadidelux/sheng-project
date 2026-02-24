import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AnalyticsPage from './pages/AnalyticsPage';
import PredictionPage from './pages/PredictionPage';
import DataViewerPage from './pages/DataViewerPage';

const queryClient = new QueryClient();

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#F4F6FB',
      paper: '#FFFFFF',
    },
    primary: {
      main: '#0033A0',
    },
    secondary: {
      main: '#F5C500',
      contrastText: '#1A1A2E',
    },
    text: {
      primary: '#1A1A2E',
      secondary: '#6B7280',
    },
    divider: '#E2E0EC',
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: [
      '"DM Sans"',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #E2E0EC',
          boxShadow: '0 6px 28px rgba(0, 51, 160, 0.08)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #E2E0EC',
          boxShadow: '0 6px 28px rgba(0, 51, 160, 0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="prediction" element={<PredictionPage />} />
              <Route path="data-viewer" element={<DataViewerPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
