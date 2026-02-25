import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { predictionApi } from '../services/api';
import {
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Box,
  Paper,
  Chip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

export default function PredictionPage() {
  const [formData, setFormData] = useState({
    province_name: 'MARINDUQUE',
    urb_rur: 2,
    no_of_indiv: 5,
    no_sleeping_rooms: 1,
    house_type: 3,
    has_electricity: 1,
    television: 1,
    ref: 0,
    motorcycle: 0,
  });

  const [prediction, setPrediction] = useState<any>(null);

  const predictMutation = useMutation({
    mutationFn: (data: any) => predictionApi.predictPoverty(data),
    onSuccess: (response) => {
      setPrediction(response.data);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    predictMutation.mutate(formData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <Box>
      <Box sx={{ mb: 4, borderLeft: 4, borderColor: 'secondary.main', pl: 3, py: 1 }}>
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: 30, md: 36 },
            fontWeight: 700,
            color: 'primary.main',
            letterSpacing: '-0.02em',
            mb: 0.5,
          }}
        >
          Poverty Prediction Tool
        </Typography>
        <Typography
          component="p"
          sx={{
            fontSize: 18,
            color: 'text.secondary',
          }}
        >
          Predict household poverty status using 9 key indicators
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Form */}
        <Grid item xs={12} lg={7}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 6px 28px rgba(0, 51, 160, 0.08)',
              bgcolor: 'background.paper',
            }}
          >
            <Typography
              variant="h6"
              color="primary"
              fontWeight={700}
              sx={{ mb: 3, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}
            >
              Household Assessment Form
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Province */}
                <Grid item xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Province</InputLabel>
                    <Select
                      value={formData.province_name}
                      label="Province"
                      onChange={(e) => handleChange('province_name', e.target.value)}
                    >
                      <MenuItem value="MARINDUQUE">Marinduque</MenuItem>
                      <MenuItem value="PALAWAN">Palawan</MenuItem>
                      <MenuItem value="OCCIDENTAL MINDORO">Occidental Mindoro</MenuItem>
                      <MenuItem value="ORIENTAL MINDORO">Oriental Mindoro</MenuItem>
                      <MenuItem value="ROMBLON">Romblon</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Urban/Rural */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Location Type</InputLabel>
                    <Select
                      value={formData.urb_rur}
                      label="Location Type"
                      onChange={(e) => handleChange('urb_rur', Number(e.target.value))}
                    >
                      <MenuItem value={1}>Urban</MenuItem>
                      <MenuItem value={2}>Rural</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Number of individuals */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Number of household members"
                    type="number"
                    value={formData.no_of_indiv}
                    onChange={(e) => handleChange('no_of_indiv', Number(e.target.value))}
                    inputProps={{ min: 1, max: 20 }}
                  />
                </Grid>

                {/* Sleeping rooms */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Number of sleeping rooms"
                    type="number"
                    value={formData.no_sleeping_rooms}
                    onChange={(e) => handleChange('no_sleeping_rooms', Number(e.target.value))}
                    inputProps={{ min: 0, max: 10 }}
                  />
                </Grid>

                {/* House type */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>House type (1=Strong, 6=Weak)</InputLabel>
                    <Select
                      value={formData.house_type}
                      label="House type (1=Strong, 6=Weak)"
                      onChange={(e) => handleChange('house_type', Number(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <MenuItem key={num} value={num}>
                          {num} - {num === 1 ? 'Very Strong' : num === 6 ? 'Very Weak' : 'Average'}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Electricity */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Has electricity?</InputLabel>
                    <Select
                      value={formData.has_electricity}
                      label="Has electricity?"
                      onChange={(e) => handleChange('has_electricity', Number(e.target.value))}
                    >
                      <MenuItem value={1}>Yes</MenuItem>
                      <MenuItem value={0}>No</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Television */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Television</InputLabel>
                    <Select
                      value={formData.television}
                      label="Television"
                      onChange={(e) => handleChange('television', Number(e.target.value))}
                    >
                      <MenuItem value={0}>No</MenuItem>
                      <MenuItem value={1}>Yes (Working)</MenuItem>
                      <MenuItem value={2}>Yes (Non-functional)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Refrigerator */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Refrigerator</InputLabel>
                    <Select
                      value={formData.ref}
                      label="Refrigerator"
                      onChange={(e) => handleChange('ref', Number(e.target.value))}
                    >
                      <MenuItem value={0}>No</MenuItem>
                      <MenuItem value={1}>Yes (Working)</MenuItem>
                      <MenuItem value={2}>Yes (Non-functional)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Motorcycle */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Motorcycle</InputLabel>
                    <Select
                      value={formData.motorcycle}
                      label="Motorcycle"
                      onChange={(e) => handleChange('motorcycle', Number(e.target.value))}
                    >
                      <MenuItem value={0}>No</MenuItem>
                      <MenuItem value={1}>Yes (Working)</MenuItem>
                      <MenuItem value={2}>Yes (Non-functional)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sx={{ pt: 1 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    disabled={predictMutation.isPending}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 700,
                      py: 1.5,
                      boxShadow: '0 4px 16px rgba(0, 51, 160, 0.25)',
                    }}
                  >
                    {predictMutation.isPending ? <CircularProgress size={24} /> : 'Predict Poverty Status'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        {/* Result */}
        <Grid item xs={12} lg={5}>
          {predictMutation.isError && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'error.main',
                bgcolor: '#FFF5F5',
              }}
            >
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Prediction Error
              </Typography>
              <Typography variant="body2">
                Unable to get prediction. Make sure the ML model is trained and the backend is running.
              </Typography>
              <Typography
                component="code"
                sx={{
                  display: 'block',
                  mt: 1,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  bgcolor: 'rgba(255,0,0,0.04)',
                  fontSize: 12,
                }}
              >
                cd scripts && python train_svm.py
              </Typography>
            </Alert>
          )}

          {prediction && (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 6px 28px rgba(0, 51, 160, 0.08)',
                bgcolor: 'background.paper',
              }}
            >
              <Typography
                variant="h6"
                color="primary"
                fontWeight={700}
                align="center"
                sx={{ mb: 3 }}
              >
                Prediction Result
              </Typography>

              <Box
                sx={{
                  mb: 4,
                  p: 3,
                  borderRadius: 3,
                  borderWidth: 2,
                  borderStyle: 'solid',
                  borderColor:
                    prediction.predicted_status === 1 ? 'secondary.main' : 'primary.main',
                  bgcolor:
                    prediction.predicted_status === 1 ? 'secondary.main + 10' : 'primary.main + 5',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                {prediction.predicted_status === 1 ? (
                  <WarningIcon
                    sx={{ fontSize: 48, mb: 1.5, color: 'secondary.main' }}
                  />
                ) : (
                  <CheckCircleIcon
                    sx={{ fontSize: 48, mb: 1.5, color: 'primary.main' }}
                  />
                )}
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color:
                      prediction.predicted_status === 1
                        ? 'text.primary'
                        : 'primary.main',
                  }}
                >
                  {prediction.predicted_label}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1.5,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Confidence
                  </Typography>
                  <Chip
                    label={`${(prediction.probability * 100).toFixed(1)}%`}
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1.5,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Probability Poor
                  </Typography>
                  <Typography variant="body1" fontWeight={700}>
                    {(prediction.probability_poor * 100).toFixed(1)}%
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1.5,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Probability Non-Poor
                  </Typography>
                  <Typography variant="body1" fontWeight={700}>
                    {(prediction.probability_nonpoor * 100).toFixed(1)}%
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  mt: 3,
                  p: 2.5,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.default',
                }}
              >
                <Typography variant="body2">
                  <Box component="span" sx={{ fontWeight: 700, color: 'primary.main', mr: 1 }}>
                    Recommendation:
                  </Box>
                  {prediction.recommendation}
                </Typography>
              </Box>

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Model: {prediction.model_version} • ID: {prediction.prediction_id}
                </Typography>
              </Box>
            </Paper>
          )}

          {!prediction && !predictMutation.isError && (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                border: '1px dashed',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                minHeight: 300,
              }}
            >
              <Typography variant="body1" color="text.secondary">
                Fill in the form and click &quot;Predict Poverty Status&quot; to see results.
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
