import { useQuery } from '@tanstack/react-query';
import { targetingApi } from '../services/api';
import { Card, CardContent, Typography, Grid, CircularProgress, Alert, Box, Paper } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
  const { data: coverage, isLoading: loadingCoverage, error: errorCoverage } = useQuery({
    queryKey: ['coverage'],
    queryFn: async () => {
      const response = await targetingApi.getCoverage();
      return response.data;
    },
  });

  const { data: efficiency, isLoading: loadingEfficiency, error: errorEfficiency } = useQuery({
    queryKey: ['efficiency'],
    queryFn: async () => {
      const response = await targetingApi.getEfficiency();
      return response.data;
    },
  });

  if (loadingCoverage || loadingEfficiency) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (errorCoverage || errorEfficiency) {
    return (
      <Alert severity="error">
        Error loading data. Please make sure the backend API is running at http://localhost:8000
      </Alert>
    );
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        4Ps Targeting Analysis
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Analyze program effectiveness across MIMAROPA provinces
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Coverage Chart */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Coverage Rate by Province
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Percentage of poor households receiving 4Ps benefits
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={coverage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="province_name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip formatter={(value: any) => `${(value * 100).toFixed(1)}%`} />
                <Legend />
                <Bar dataKey="coverage_rate" fill="#1976d2" name="Coverage Rate" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Efficiency Chart */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Targeting Efficiency
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Targeting accuracy vs leakage rate by province
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={efficiency}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="location" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip formatter={(value: any) => `${(value * 100).toFixed(1)}%`} />
                <Legend />
                <Bar dataKey="targeting_accuracy" fill="#4caf50" name="Targeting Accuracy" />
                <Bar dataKey="leakage_rate" fill="#f44336" name="Leakage Rate" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Summary Cards */}
        {coverage?.map((item: any) => (
          <Grid item xs={12} md={6} lg={4} key={item.province_name}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  {item.province_name}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Total Households
                    </Typography>
                    <Typography variant="h6">
                      {item.total_households.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Poor Households
                    </Typography>
                    <Typography variant="h6">
                      {item.total_poor.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Coverage Rate
                    </Typography>
                    <Typography variant="h6" color={item.coverage_rate > 0.6 ? 'success.main' : 'warning.main'}>
                      {(item.coverage_rate * 100).toFixed(1)}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Unmet Need
                    </Typography>
                    <Typography variant="h6" color="error">
                      {item.unmet_need.toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
