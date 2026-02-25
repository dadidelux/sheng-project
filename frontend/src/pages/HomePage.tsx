import React from 'react';
import { Card, CardContent, Typography, Grid, Box, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PsychologyIcon from '@mui/icons-material/Psychology';

export default function HomePage() {
  return (
    <div>
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
          DSWD Poverty Analysis Dashboard
        </Typography>
        <Typography
          component="p"
          sx={{
            fontSize: 18,
            color: 'text.secondary',
          }}
        >
          Department of Social Welfare and Development - MIMAROPA Region
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderTop: 4,
              borderTopColor: 'primary.main',
              transition: 'transform 150ms ease, box-shadow 150ms ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 10px 32px rgba(0, 51, 160, 0.12)',
              },
            }}
          >
            <CardActionArea component={Link} to="/analytics" sx={{ height: '100%' }}>
              <CardContent
                sx={{
                  p: 3,
                  '&:last-child': { pb: 3 },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: 'primary.main',
                      mr: 2,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AnalyticsIcon sx={{ fontSize: 32, color: 'primary.contrastText' }} />
                  </Box>
                  <Typography
                    variant="h5"
                    color="primary"
                    sx={{ fontSize: 20, fontWeight: 700 }}
                  >
                    Targeting Analysis
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  sx={{ mb: 3, fontSize: 16, lineHeight: 1.7 }}
                >
                  Analyze 4Ps program effectiveness by geographic location. View coverage rates,
                  targeting accuracy, and identify areas with high unmet need.
                </Typography>
                <Box sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: 14, lineHeight: 1.8 }}
                  >
                  • Coverage rate by province
                  <br />
                  • Targeting efficiency metrics
                  <br />
                  • Unmet need identification
                  <br />
                  • 584,562 households analyzed
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderTop: 4,
              borderTopColor: 'secondary.main',
              transition: 'transform 150ms ease, box-shadow 150ms ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 10px 32px rgba(0, 51, 160, 0.12)',
              },
            }}
          >
            <CardActionArea component={Link} to="/prediction" sx={{ height: '100%' }}>
              <CardContent
                sx={{
                  p: 3,
                  '&:last-child': { pb: 3 },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: 'secondary.main',
                      mr: 2,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PsychologyIcon sx={{ fontSize: 32, color: 'secondary.contrastText' }} />
                  </Box>
                  <Typography
                    variant="h5"
                    color="secondary"
                    sx={{ fontSize: 20, fontWeight: 700 }}
                  >
                    Poverty Prediction
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  sx={{ mb: 3, fontSize: 16, lineHeight: 1.7 }}
                >
                  Predict household poverty status using a simplified 9-question assessment.
                  Get instant results with 85%+ accuracy using machine learning.
                </Typography>
                <Box sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: 14, lineHeight: 1.8 }}
                  >
                  • 9 simple questions
                  <br />
                  • Instant prediction
                  <br />
                  • 85-90% accuracy
                  <br />
                  • SVM machine learning model
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 6px 28px rgba(0, 51, 160, 0.08)',
            }}
          >
            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
              <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 1.5 }}>
                About This Dashboard
              </Typography>
              <Typography paragraph color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
                This dashboard analyzes poverty data from the MIMAROPA region to support
                evidence-based decision making for the 4Ps (Pantawid Pamilyang Pilipino Program).
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6, mb: 0.5 }}
                  >
                    Coverage
                  </Typography>
                  <Typography variant="body2">5 provinces</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6, mb: 0.5 }}
                  >
                    Households
                  </Typography>
                  <Typography variant="body2">584,562 records</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6, mb: 0.5 }}
                  >
                    Provinces
                  </Typography>
                  <Typography variant="body2">
                    Palawan, Oriental Mindoro, Occidental Mindoro, Romblon, Marinduque
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6, mb: 0.5 }}
                  >
                    Tech Stack
                  </Typography>
                  <Typography variant="body2">FastAPI, ClickHouse, React, Docker</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
