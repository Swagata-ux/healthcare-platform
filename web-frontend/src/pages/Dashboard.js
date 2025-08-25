import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Avatar,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  EventNote as BookingIcon,
  LocalHospital as ProviderIcon,
  Schedule as UpcomingIcon,
  TrendingUp as StatsIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { bookingService } from '../services/api';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingBookings = bookings.filter(
    booking => booking.status === 'PENDING' && new Date(booking.slot.startTime) > new Date()
  );

  const stats = [
    {
      title: 'Total Bookings',
      value: bookings.length,
      icon: <BookingIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: 'primary.main',
    },
    {
      title: 'Upcoming',
      value: upcomingBookings.length,
      icon: <UpcomingIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      color: 'success.main',
    },
    {
      title: 'Completed',
      value: bookings.filter(b => b.status === 'COMPLETED').length,
      icon: <StatsIcon sx={{ fontSize: 40, color: 'info.main' }} />,
      color: 'info.main',
    },
    {
      title: 'Cancelled',
      value: bookings.filter(b => b.status === 'CANCELLED').length,
      icon: <ProviderIcon sx={{ fontSize: 40, color: 'error.main' }} />,
      color: 'error.main',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'CONFIRMED': return 'success';
      case 'COMPLETED': return 'info';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Loading Dashboard...
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.patient?.firstName || user?.email}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's an overview of your healthcare activities
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'background.paper', boxShadow: 1 }}>
                    {stat.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ color: stat.color }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Upcoming Appointments */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Appointments
              </Typography>
              
              {upcomingBookings.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <UpcomingIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    No upcoming appointments
                  </Typography>
                  <Button variant="contained" sx={{ mt: 2 }} href="/providers">
                    Book an Appointment
                  </Button>
                </Box>
              ) : (
                <Box sx={{ mt: 2 }}>
                  {upcomingBookings.slice(0, 3).map((booking) => (
                    <Card key={booking.id} variant="outlined" sx={{ mb: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                          <Box>
                            <Typography variant="h6" component="div">
                              {booking.service.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {booking.clinic.name}
                            </Typography>
                            <Typography variant="body2">
                              📅 {format(new Date(booking.slot.startTime), 'PPP')}
                            </Typography>
                            <Typography variant="body2">
                              🕐 {format(new Date(booking.slot.startTime), 'p')}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Chip 
                              label={booking.status} 
                              color={getStatusColor(booking.status)}
                              size="small"
                              sx={{ mb: 1 }}
                            />
                            <Typography variant="h6" color="primary.main">
                              ${booking.service.price}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {upcomingBookings.length > 3 && (
                    <Button variant="outlined" fullWidth href="/bookings">
                      View All Appointments ({upcomingBookings.length})
                    </Button>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<ProviderIcon />}
                  href="/providers"
                  fullWidth
                >
                  Find Providers
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<BookingIcon />}
                  href="/bookings"
                  fullWidth
                >
                  My Appointments
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<UpcomingIcon />}
                  href="/profile"
                  fullWidth
                >
                  Update Profile
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              
              {bookings.slice(0, 3).map((booking) => (
                <Box key={booking.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}>
                    <BookingIcon sx={{ fontSize: 16 }} />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2">
                      {booking.service.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(booking.createdAt), 'MMM d, yyyy')}
                    </Typography>
                  </Box>
                  <Chip 
                    label={booking.status} 
                    color={getStatusColor(booking.status)}
                    size="small"
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;