import React from 'react';
import { Toolbar, Typography, Container, Box, Drawer, List, ListItem, ListItemText, ListItemButton, ListItemIcon } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import PsychologyIcon from '@mui/icons-material/Psychology';
import TableChartIcon from '@mui/icons-material/TableChart';
import { Link, Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();

  const menuItems = [
    { text: 'Home', path: '/', icon: <DashboardIcon /> },
    { text: 'Analytics', path: '/analytics', icon: <BarChartIcon /> },
    { text: 'Prediction', path: '/prediction', icon: <PsychologyIcon /> },
    { text: 'Data Viewer', path: '/data-viewer', icon: <TableChartIcon /> },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 260,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 260,
            boxSizing: 'border-box',
            borderRadius: 0,
            borderRight: '1px solid',
            borderColor: 'rgba(255,255,255,0.12)',
            bgcolor: 'primary.main',
            pt: 2,
          },
        }}
      >
        <Toolbar sx={{ px: 3, pb: 2, borderBottom: '1px solid', borderColor: 'rgba(255,255,255,0.12)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              D
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1, color: 'white' }}>
                DSWD
              </Typography>
              <Typography variant="subtitle2" sx={{ lineHeight: 1.2, color: 'rgba(255,255,255,0.8)' }}>
                MIMAROPA
              </Typography>
            </Box>
          </Box>
        </Toolbar>
        <List sx={{ mt: 1, px: 1 }}>
          {menuItems.map((item) => {
            const selected = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={selected}
                  disableRipple
                  sx={{
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    color: 'white',
                    '&.Mui-selected': {
                      bgcolor: 'rgba(255,255,255,0.15)',
                      color: 'white',
                      '& .MuiListItemText-primary': {
                        fontWeight: 600,
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'white',
                      },
                    },
                    '&.Mui-selected:hover': {
                      bgcolor: 'rgba(255,255,255,0.2)',
                    },
                    '&:hover': {
                      bgcolor: selected ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 32,
                      color: 'white',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: 'background.default',
          minHeight: '100vh',
        }}
      >
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}
