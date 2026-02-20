import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { predictionApi } from '../services/api';
import {
  Card, CardContent, Typography, TextField, Button, Grid,
  FormControl, InputLabel, Select, MenuItem, Alert, CircularProgress,
  Box, Paper, Chip
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
    <div>
      <Typography variant="h4" gutterBottom>
        Poverty Prediction Tool
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Predict household poverty status using 9 key indicators
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Household Assessment Form
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {/* Province */}
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Province</InputLabel>
                    <Select
                      value={formData.province_name}
                      onChange={(e) => handleChange('province_name', e.target.value)}
                      label="Province"
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
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Location Type</InputLabel>
                    <Select
                      value={formData.urb_rur}
                      onChange={(e) => handleChange('urb_rur', Number(e.target.value))}
                      label="Location Type"
                    >
                      <MenuItem value={1}>Urban</MenuItem>
                      <MenuItem value={2}>Rural</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Number of individuals */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Number of household members"
                    type="number"
                    value={formData.no_of_indiv}
                    onChange={(e) => handleChange('no_of_indiv', Number(e.target.value))}
                    inputProps={{ min: 1, max: 20 }}
                  />
                </Grid>

                {/* Sleeping rooms */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Number of sleeping rooms"
                    type="number"
                    value={formData.no_sleeping_rooms}
                    onChange={(e) => handleChange('no_sleeping_rooms', Number(e.target.value))}
                    inputProps={{ min: 0, max: 10 }}
                  />
                </Grid>

                {/* House type */}
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>House type (1=Strong, 6=Weak)</InputLabel>
                    <Select
                      value={formData.house_type}
                      onChange={(e) => handleChange('house_type', Number(e.target.value))}
                      label="House type (1=Strong, 6=Weak)"
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <MenuItem key={num} value={num}>
                          {num} - {num === 1 ? 'Very Strong' : num === 6 ? 'Very Weak' : 'Average'}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Electricity */}
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Has electricity?</InputLabel>
                    <Select
                      value={formData.has_electricity}
                      onChange={(e) => handleChange('has_electricity', Number(e.target.value))}
                      label="Has electricity?"
                    >
                      <MenuItem value={1}>Yes</MenuItem>
                      <MenuItem value={0}>No</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Television */}
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Television</InputLabel>
                    <Select
                      value={formData.television}
                      onChange={(e) => handleChange('television', Number(e.target.value))}
                      label="Television"
                    >
                      <MenuItem value={0}>No</MenuItem>
                      <MenuItem value={1}>Yes (Working)</MenuItem>
                      <MenuItem value={2}>Yes (Non-functional)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Refrigerator */}
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Refrigerator</InputLabel>
                    <Select
                      value={formData.ref}
                      onChange={(e) => handleChange('ref', Number(e.target.value))}
                      label="Refrigerator"
                    >
                      <MenuItem value={0}>No</MenuItem>
                      <MenuItem value={1}>Yes (Working)</MenuItem>
                      <MenuItem value={2}>Yes (Non-functional)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Motorcycle */}
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Motorcycle</InputLabel>
                    <Select
                      value={formData.motorcycle}
                      onChange={(e) => handleChange('motorcycle', Number(e.target.value))}
                      label="Motorcycle"
                    >
                      <MenuItem value={0}>No</MenuItem>
                      <MenuItem value={1}>Yes (Working)</MenuItem>
                      <MenuItem value={2}>Yes (Non-functional)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    disabled={predictMutation.isPending}
                  >
                    {predictMutation.isPending ? <CircularProgress size={24} /> : 'Predict Poverty Status'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        {/* Result */}
        <Grid item xs={12} md={6}>
          {predictMutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Error: Unable to get prediction. Make sure the ML model is trained and the backend is running.
              <br />
              <Typography variant="caption">
                To train the model, run: cd scripts && python train_svm.py
              </Typography>
            </Alert>
          )}

          {prediction && (
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Prediction Result
              </Typography>
              <Box sx={{ my: 3, textAlign: 'center' }}>
                <Alert
                  severity={prediction.predicted_status === 1 ? 'warning' : 'success'}
                  icon={prediction.predicted_status === 1 ? <WarningIcon /> : <CheckCircleIcon />}
                  sx={{ fontSize: '1.2rem' }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {prediction.predicted_label}
                  </Typography>
                </Alert>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">Confidence:</Typography>
                    <Chip
                      label={`${(prediction.probability * 100).toFixed(1)}%`}
                      color="primary"
                    />
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">Probability Poor:</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {(prediction.probability_poor * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">Probability Non-Poor:</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {(prediction.probability_nonpoor * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>Recommendation:</strong> {prediction.recommendation}
                    </Typography>
                  </Alert>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="caption" display="block" sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
                    Model: {prediction.model_version} | ID: {prediction.prediction_id}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          )}

          {!prediction && !predictMutation.isError && (
            <Paper elevation={2} sx={{ p: 3, bgcolor: 'grey.100' }}>
              <Typography variant="body1" color="text.secondary" textAlign="center">
                Fill in the form and click "Predict" to see results
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </div>
  );
}
