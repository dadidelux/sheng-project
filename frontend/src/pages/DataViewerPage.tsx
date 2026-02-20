import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dataViewerApi } from '../services/api';
import {
  Box, Typography, Tabs, Tab, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TablePagination, Button,
  FormControl, InputLabel, Select, MenuItem, TextField, Chip,
  OutlinedInput, SelectChangeEvent, CircularProgress, Alert, Stack
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import FilterListIcon from '@mui/icons-material/FilterList';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function DataViewerPage() {
  const [tabValue, setTabValue] = useState(0);

  // Poverty Data State
  const [povertyPage, setPovertyPage] = useState(1);
  const [povertyLimit, setPovertyLimit] = useState(100);
  const [povertyColumns, setPovertyColumns] = useState<string[]>([]);
  const [povertyFilters, setPovertyFilters] = useState<Record<string, any>>({});
  const [povertySelectedCols, setPovertySelectedCols] = useState<string[]>([]);

  // Predictions State
  const [predictionsPage, setPredictionsPage] = useState(1);
  const [predictionsLimit, setPredictionsLimit] = useState(100);
  const [predictionsColumns, setPredictionsColumns] = useState<string[]>([]);
  const [predictionsFilters, setPredictionsFilters] = useState<Record<string, any>>({});
  const [predictionsSelectedCols, setPredictionsSelectedCols] = useState<string[]>([]);

  // Fetch available columns for poverty data
  const { data: povertyAvailableColumns } = useQuery({
    queryKey: ['poverty-columns'],
    queryFn: async () => {
      const response = await dataViewerApi.getPovertyDataColumns();
      return response.data;
    },
  });

  // Fetch available columns for predictions
  const { data: predictionsAvailableColumns } = useQuery({
    queryKey: ['predictions-columns'],
    queryFn: async () => {
      const response = await dataViewerApi.getPredictionsColumns();
      return response.data;
    },
  });

  // Initialize default columns
  useEffect(() => {
    if (povertyAvailableColumns && povertySelectedCols.length === 0) {
      const defaultCols = ['hh_id', 'province_name', 'city_name', 'barangay_name', 'urb_rur',
        'no_of_indiv', 'no_sleeping_rooms', 'house_type', 'has_electricity',
        'television', 'ref', 'motorcycle', 'poverty_status', 'poor'];
      const availableDefaults = defaultCols.filter(col =>
        povertyAvailableColumns.some((c: any) => c.name === col)
      );
      setPovertySelectedCols(availableDefaults);
    }
  }, [povertyAvailableColumns]);

  useEffect(() => {
    if (predictionsAvailableColumns && predictionsSelectedCols.length === 0) {
      const allCols = predictionsAvailableColumns.map((c: any) => c.name);
      setPredictionsSelectedCols(allCols);
    }
  }, [predictionsAvailableColumns]);

  // Fetch poverty data
  const {
    data: povertyData,
    isLoading: isPovertyLoading,
    error: povertyError,
  } = useQuery({
    queryKey: ['poverty-data', povertyPage, povertyLimit, povertySelectedCols, povertyFilters],
    queryFn: async () => {
      const response = await dataViewerApi.getPovertyData({
        page: povertyPage,
        limit: povertyLimit,
        columns: povertySelectedCols.length > 0 ? povertySelectedCols : undefined,
        filters: Object.keys(povertyFilters).length > 0 ? povertyFilters : undefined,
      });
      return response.data;
    },
    enabled: povertySelectedCols.length > 0,
  });

  // Fetch predictions data
  const {
    data: predictionsData,
    isLoading: isPredictionsLoading,
    error: predictionsError,
  } = useQuery({
    queryKey: ['predictions-data', predictionsPage, predictionsLimit, predictionsSelectedCols, predictionsFilters],
    queryFn: async () => {
      const response = await dataViewerApi.getPredictions({
        page: predictionsPage,
        limit: predictionsLimit,
        columns: predictionsSelectedCols.length > 0 ? predictionsSelectedCols : undefined,
        filters: Object.keys(predictionsFilters).length > 0 ? predictionsFilters : undefined,
      });
      return response.data;
    },
    enabled: predictionsSelectedCols.length > 0,
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePovertyColumnChange = (event: SelectChangeEvent<typeof povertySelectedCols>) => {
    const { value } = event.target;
    setPovertySelectedCols(typeof value === 'string' ? value.split(',') : value);
    setPovertyPage(1); // Reset to first page
  };

  const handlePredictionsColumnChange = (event: SelectChangeEvent<typeof predictionsSelectedCols>) => {
    const { value } = event.target;
    setPredictionsSelectedCols(typeof value === 'string' ? value.split(',') : value);
    setPredictionsPage(1);
  };

  const handlePovertyFilterChange = (field: string, value: any) => {
    setPovertyFilters(prev => {
      if (!value || value === '') {
        const newFilters = { ...prev };
        delete newFilters[field];
        return newFilters;
      }
      return { ...prev, [field]: value };
    });
    setPovertyPage(1);
  };

  const handlePredictionsFilterChange = (field: string, value: any) => {
    setPredictionsFilters(prev => {
      if (!value || value === '') {
        const newFilters = { ...prev };
        delete newFilters[field];
        return newFilters;
      }
      return { ...prev, [field]: value };
    });
    setPredictionsPage(1);
  };

  const handleDownloadPovertyCSV = () => {
    const url = dataViewerApi.exportPovertyDataCsv({
      columns: povertySelectedCols,
      filters: Object.keys(povertyFilters).length > 0 ? povertyFilters : undefined,
    });
    window.open(url, '_blank');
  };

  const handleDownloadPredictionsCSV = () => {
    const url = dataViewerApi.exportPredictionsCsv({
      columns: predictionsSelectedCols,
      filters: Object.keys(predictionsFilters).length > 0 ? predictionsFilters : undefined,
    });
    window.open(url, '_blank');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Data Viewer
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        View and export raw household and prediction data
      </Typography>

      <Paper sx={{ mt: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Poverty Data" />
          <Tab label="Predictions" />
        </Tabs>

        {/* Poverty Data Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 3 }}>
            {/* Controls */}
            <Stack direction="row" spacing={2} sx={{ mb: 3 }} flexWrap="wrap">
              {/* Column Selector */}
              <FormControl sx={{ minWidth: 300 }}>
                <InputLabel>Visible Columns</InputLabel>
                <Select
                  multiple
                  value={povertySelectedCols}
                  onChange={handlePovertyColumnChange}
                  input={<OutlinedInput label="Visible Columns" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {povertyAvailableColumns?.map((col: any) => (
                    <MenuItem key={col.name} value={col.name}>
                      {col.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Province Filter */}
              <TextField
                label="Filter by Province"
                value={povertyFilters.province_name || ''}
                onChange={(e) => handlePovertyFilterChange('province_name', e.target.value)}
                placeholder="e.g., PALAWAN"
                sx={{ minWidth: 200 }}
              />

              {/* Poverty Status Filter */}
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Poverty Status</InputLabel>
                <Select
                  value={povertyFilters.poor || ''}
                  onChange={(e) => handlePovertyFilterChange('poor', e.target.value)}
                  label="Poverty Status"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value={0}>Non-Poor</MenuItem>
                  <MenuItem value={1}>Poor</MenuItem>
                </Select>
              </FormControl>

              {/* Download Button */}
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadPovertyCSV}
                sx={{ ml: 'auto' }}
              >
                Export CSV
              </Button>
            </Stack>

            {/* Active Filters */}
            {Object.keys(povertyFilters).length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FilterListIcon fontSize="small" />
                  Active Filters:
                  {Object.entries(povertyFilters).map(([key, value]) => (
                    <Chip
                      key={key}
                      label={`${key}: ${value}`}
                      size="small"
                      onDelete={() => handlePovertyFilterChange(key, '')}
                    />
                  ))}
                </Typography>
              </Box>
            )}

            {/* Data Table */}
            {isPovertyLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {povertyError && (
              <Alert severity="error">
                Error loading data: {(povertyError as Error).message}
              </Alert>
            )}

            {povertyData && (
              <>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        {povertySelectedCols.map((col) => (
                          <TableCell key={col} sx={{ fontWeight: 'bold', bgcolor: 'grey.100' }}>
                            {col}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {povertyData.data.map((row: any, idx: number) => (
                        <TableRow key={idx} hover>
                          {povertySelectedCols.map((col) => (
                            <TableCell key={col}>
                              {row[col] !== null && row[col] !== undefined ? String(row[col]) : '-'}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  component="div"
                  count={povertyData.total}
                  page={povertyPage - 1}
                  onPageChange={(_, newPage) => setPovertyPage(newPage + 1)}
                  rowsPerPage={povertyLimit}
                  onRowsPerPageChange={(e) => {
                    setPovertyLimit(parseInt(e.target.value, 10));
                    setPovertyPage(1);
                  }}
                  rowsPerPageOptions={[50, 100, 200, 500]}
                />

                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                  Showing {((povertyPage - 1) * povertyLimit) + 1}-
                  {Math.min(povertyPage * povertyLimit, povertyData.total)} of {povertyData.total.toLocaleString()} total records
                </Typography>
              </>
            )}
          </Box>
        </TabPanel>

        {/* Predictions Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 3 }}>
            {/* Controls */}
            <Stack direction="row" spacing={2} sx={{ mb: 3 }} flexWrap="wrap">
              {/* Column Selector */}
              <FormControl sx={{ minWidth: 300 }}>
                <InputLabel>Visible Columns</InputLabel>
                <Select
                  multiple
                  value={predictionsSelectedCols}
                  onChange={handlePredictionsColumnChange}
                  input={<OutlinedInput label="Visible Columns" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {predictionsAvailableColumns?.map((col: any) => (
                    <MenuItem key={col.name} value={col.name}>
                      {col.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Province Filter */}
              <TextField
                label="Filter by Province"
                value={predictionsFilters.province_name || ''}
                onChange={(e) => handlePredictionsFilterChange('province_name', e.target.value)}
                placeholder="e.g., PALAWAN"
                sx={{ minWidth: 200 }}
              />

              {/* Download Button */}
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadPredictionsCSV}
                sx={{ ml: 'auto' }}
              >
                Export CSV
              </Button>
            </Stack>

            {/* Active Filters */}
            {Object.keys(predictionsFilters).length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FilterListIcon fontSize="small" />
                  Active Filters:
                  {Object.entries(predictionsFilters).map(([key, value]) => (
                    <Chip
                      key={key}
                      label={`${key}: ${value}`}
                      size="small"
                      onDelete={() => handlePredictionsFilterChange(key, '')}
                    />
                  ))}
                </Typography>
              </Box>
            )}

            {/* Data Table */}
            {isPredictionsLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {predictionsError && (
              <Alert severity="error">
                Error loading data: {(predictionsError as Error).message}
              </Alert>
            )}

            {predictionsData && (
              <>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        {predictionsSelectedCols.map((col) => (
                          <TableCell key={col} sx={{ fontWeight: 'bold', bgcolor: 'grey.100' }}>
                            {col}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {predictionsData.data.map((row: any, idx: number) => (
                        <TableRow key={idx} hover>
                          {predictionsSelectedCols.map((col) => (
                            <TableCell key={col}>
                              {row[col] !== null && row[col] !== undefined ? String(row[col]) : '-'}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  component="div"
                  count={predictionsData.total}
                  page={predictionsPage - 1}
                  onPageChange={(_, newPage) => setPredictionsPage(newPage + 1)}
                  rowsPerPage={predictionsLimit}
                  onRowsPerPageChange={(e) => {
                    setPredictionsLimit(parseInt(e.target.value, 10));
                    setPredictionsPage(1);
                  }}
                  rowsPerPageOptions={[50, 100, 200, 500]}
                />

                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                  Showing {((predictionsPage - 1) * predictionsLimit) + 1}-
                  {Math.min(predictionsPage * predictionsLimit, predictionsData.total)} of {predictionsData.total.toLocaleString()} total records
                </Typography>
              </>
            )}
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
}
