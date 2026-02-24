import React from 'react';
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
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <CircularProgress color="primary" sx={{ mb: 2 }} />
        <Typography variant="body1" color="text.secondary" fontWeight={500}>
          Loading analytics data...
        </Typography>
      </Box>
    );
  }

  if (errorCoverage || errorEfficiency) {
    return (
      <Alert severity="error" sx={{ borderRadius: 2, border: '1px solid', borderColor: 'error.main', bgcolor: '#FFF5F5' }}>
        <Typography variant="h6" fontWeight={700} gutterBottom color="error">
          Error Loading Data
        </Typography>
        <Typography variant="body2" color="error.main">
          Please make sure the backend API is running at http://localhost:8000
        </Typography>
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4, borderLeft: 4, borderColor: 'secondary.main', pl: 3, py: 1 }}>
        <Typography variant="h3" gutterBottom sx={{ mb: 0.5 }}>
          4Ps Targeting Analysis
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Analyze program effectiveness across MIMAROPA provinces
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Coverage Chart */}
        <Grid item xs={12} lg={6}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, lg: 4 },
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 6px 28px rgba(0, 51, 160, 0.08)',
              bgcolor: 'background.paper',
              height: '100%',
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" color="primary" fontWeight={700} gutterBottom>
                Coverage Rate by Province
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Percentage of poor households receiving 4Ps benefits
              </Typography>
            </Box>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={coverage}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E0EC" vertical={false} />
                  <XAxis
                    dataKey="province_name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    tickFormatter={(val: number) => `${(val * 100).toFixed(0)}%`}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(0,51,160,0.05)' }}
                    contentStyle={{
                      borderRadius: 8,
                      border: '1px solid #E2E0EC',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    }}
                    formatter={(value: any) => [`${(value * 100).toFixed(1)}%`, 'Coverage Rate']}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: 20 }} />
                  <Bar
                    dataKey="coverage_rate"
                    fill="#0033A0"
                    name="Coverage Rate"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Efficiency Chart */}
        <Grid item xs={12} lg={6}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, lg: 4 },
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 6px 28px rgba(0, 51, 160, 0.08)',
              bgcolor: 'background.paper',
              height: '100%',
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" color="primary" fontWeight={700} gutterBottom>
                Targeting Efficiency
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Targeting accuracy vs leakage rate by province
              </Typography>
            </Box>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={efficiency}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E0EC" vertical={false} />
                  <XAxis
                    dataKey="location"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    tickFormatter={(val: number) => `${(val * 100).toFixed(0)}%`}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(0,51,160,0.05)' }}
                    contentStyle={{
                      borderRadius: 8,
                      border: '1px solid #E2E0EC',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    }}
                    formatter={(value: any, name: string) => [`${(value * 100).toFixed(1)}%`, name]}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: 20 }} />
                  <Bar
                    dataKey="targeting_accuracy"
                    fill="#0033A0"
                    name="Targeting Accuracy"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                  <Bar
                    dataKey="leakage_rate"
                    fill="#CC0000"
                    name="Leakage Rate"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Provincial Breakdown */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="h4" color="primary" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
          Provincial Breakdown
        </Typography>
        <Grid container spacing={3}>
          {coverage?.map((item: any) => (
            <Grid item xs={12} md={6} xl={4} key={item.province_name}>
              <Card
                sx={{
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: '0 4px 20px rgba(0, 51, 160, 0.06)',
                  '&:hover': {
                    boxShadow: '0 8px 28px rgba(0, 51, 160, 0.12)',
                  },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    color="primary"
                    fontWeight={700}
                    sx={{ mb: 2, pb: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}
                  >
                    {item.province_name}
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase', mb: 0.5, display: 'block' }}>
                        Total Households
                      </Typography>
                      <Typography variant="h6">
                        {item.total_households.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase', mb: 0.5, display: 'block' }}>
                        Poor Households
                      </Typography>
                      <Typography variant="h6">
                        {item.total_poor.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase', mb: 0.5, display: 'block' }}>
                        Coverage Rate
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          color: item.coverage_rate > 0.6 ? 'primary.main' : 'secondary.main',
                          fontWeight: 700,
                        }}
                      >
                        {(item.coverage_rate * 100).toFixed(1)}%
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase', mb: 0.5, display: 'block' }}>
                        Unmet Need
                      </Typography>
                      <Typography variant="h6" sx={{ color: 'error.main', fontWeight: 700 }}>
                        {item.unmet_need.toLocaleString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
