import { Card, CardContent, Typography, Grid, Box, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PsychologyIcon from '@mui/icons-material/Psychology';

export default function HomePage() {
  return (
    <div>
      <Typography variant="h3" gutterBottom>
        DSWD Poverty Analysis Dashboard
      </Typography>
      <Typography variant="subtitle1" gutterBottom color="text.secondary">
        Department of Social Welfare and Development - MIMAROPA Region
      </Typography>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardActionArea component={Link} to="/analytics">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AnalyticsIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h5" color="primary">
                    Targeting Analysis
                  </Typography>
                </Box>
                <Typography variant="body1">
                  Analyze 4Ps program effectiveness by geographic location. View coverage rates,
                  targeting accuracy, and identify areas with high unmet need.
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    • Coverage rate by province<br />
                    • Targeting efficiency metrics<br />
                    • Unmet need identification<br />
                    • 584,562 households analyzed
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardActionArea component={Link} to="/prediction">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PsychologyIcon sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }} />
                  <Typography variant="h5" color="secondary">
                    Poverty Prediction
                  </Typography>
                </Box>
                <Typography variant="body1">
                  Predict household poverty status using a simplified 9-question assessment.
                  Get instant results with 85%+ accuracy using machine learning.
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    • 9 simple questions<br />
                    • Instant prediction<br />
                    • 85-90% accuracy<br />
                    • SVM machine learning model
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                About This Dashboard
              </Typography>
              <Typography paragraph>
                This dashboard analyzes poverty data from the MIMAROPA region to support
                evidence-based decision making for the 4Ps (Pantawid Pamilyang Pilipino Program).
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Coverage:</strong>
                  </Typography>
                  <Typography variant="body2">
                    5 provinces
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Households:</strong>
                  </Typography>
                  <Typography variant="body2">
                    584,562 records
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Provinces:</strong>
                  </Typography>
                  <Typography variant="body2">
                    Palawan, Oriental Mindoro, Occidental Mindoro, Romblon, Marinduque
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Tech Stack:</strong>
                  </Typography>
                  <Typography variant="body2">
                    FastAPI, ClickHouse, React, Docker
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
