import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Avatar,
} from '@mui/material';
import {
  EventNote as BookingIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  AttachMoney as PriceIcon,
  CheckCircle as CompletedIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';
import { bookingService } from '../services/api';
import { format, isPast, isFuture } from 'date-fns';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelDialog, setCancelDialog] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [message, setMessage] = useState('');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
      setMessage('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    setCancelling(true);
    try {
      await bookingService.cancel(bookingId);
      setMessage('Appointment cancelled successfully');
      setCancelDialog(null);
      loadBookings();
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      setMessage('Failed to cancel appointment. Please try again.');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <PendingIcon sx={{ fontSize: 20 }} />;
      case 'CONFIRMED':
        return <CheckCircle sx={{ fontSize: 20 }} />;
      case 'COMPLETED':
        return <CompletedIcon sx={{ fontSize: 20 }} />;
      case 'CANCELLED':
        return <CancelIcon sx={{ fontSize: 20 }} />;
      default:
        return <BookingIcon sx={{ fontSize: 20 }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'CONFIRMED': return 'success';
      case 'COMPLETED': return 'info';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

  const filterBookings = (filter) => {
    switch (filter) {
      case 'upcoming':
        return bookings.filter(b => 
          b.status !== 'CANCELLED' && 
          isFuture(new Date(b.slot.startTime))
        );
      case 'past':
        return bookings.filter(b => 
          isPast(new Date(b.slot.startTime))
        );
      case 'cancelled':
        return bookings.filter(b => b.status === 'CANCELLED');
      default:
        return bookings;
    }
  };

  const tabFilters = ['all', 'upcoming', 'past', 'cancelled'];
  const currentBookings = filterBookings(tabFilters[tabValue]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Appointments
      </Typography>

      {message && (
        <Alert 
          severity={message.includes('successfully') ? 'success' : 'error'} 
          sx={{ mb: 3 }}
          onClose={() => setMessage('')}
        >
          {message}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label={`All (${bookings.length})`} />
          <Tab label={`Upcoming (${filterBookings('upcoming').length})`} />
          <Tab label={`Past (${filterBookings('past').length})`} />
          <Tab label={`Cancelled (${filterBookings('cancelled').length})`} />
        </Tabs>
      </Box>

      {currentBookings.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <BookingIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No appointments found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {tabValue === 0 ? 'You haven\'t booked any appointments yet' : 
             tabValue === 1 ? 'No upcoming appointments' :
             tabValue === 2 ? 'No past appointments' : 'No cancelled appointments'}
          </Typography>
          {tabValue === 0 && (
            <Button variant="contained" href="/providers">
              Book Your First Appointment
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={3}>
          {currentBookings.map((booking) => (
            <Grid item xs={12} md={6} lg={4} key={booking.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                        {getStatusIcon(booking.status)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" component="div">
                          {booking.service.name}
                        </Typography>
                        <Chip 
                          label={booking.status} 
                          color={getStatusColor(booking.status)}
                          size="small"
                        />
                      </Box>
                    </Box>
                    <Typography variant="h6" color="primary.main">
                      ${booking.service.price}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {format(new Date(booking.slot.startTime), 'EEEE, MMMM d, yyyy')}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {format(new Date(booking.slot.startTime), 'h:mm a')} - {format(new Date(booking.slot.endTime), 'h:mm a')}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {booking.clinic.name}
                      </Typography>
                    </Box>
                  </Box>

                  {booking.clinic.providerOrg && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>{booking.clinic.providerOrg.name}</strong>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {booking.clinic.address}
                      </Typography>
                    </Box>
                  )}

                  {booking.notes && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Notes:</strong> {booking.notes}
                      </Typography>
                    </Box>
                  )}

                  <Typography variant="caption" color="text.secondary">
                    Booked on {format(new Date(booking.createdAt), 'MMM d, yyyy')}
                  </Typography>
                </CardContent>

                {booking.status === 'PENDING' && isFuture(new Date(booking.slot.startTime)) && (
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={() => setCancelDialog(booking)}
                      fullWidth
                    >
                      Cancel Appointment
                    </Button>
                  </Box>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Cancel Confirmation Dialog */}
      <Dialog open={!!cancelDialog} onClose={() => setCancelDialog(null)}>
        <DialogTitle>Cancel Appointment</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel your appointment for{' '}
            <strong>{cancelDialog?.service.name}</strong> on{' '}
            <strong>
              {cancelDialog && format(new Date(cancelDialog.slot.startTime), 'EEEE, MMMM d, yyyy')} at{' '}
              {cancelDialog && format(new Date(cancelDialog.slot.startTime), 'h:mm a')}
            </strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            This action cannot be undone. You may need to rebook if you change your mind.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog(null)}>
            Keep Appointment
          </Button>
          <Button 
            onClick={() => handleCancelBooking(cancelDialog.id)}
            color="error"
            disabled={cancelling}
          >
            {cancelling ? 'Cancelling...' : 'Cancel Appointment'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Bookings;