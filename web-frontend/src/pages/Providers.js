import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Rating,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Schedule as ScheduleIcon,
  AttachMoney as PriceIcon,
} from '@mui/icons-material';
import { providerService, bookingService } from '../services/api';
import { format, addDays } from 'date-fns';

const Providers = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('cardiology');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await providerService.search({ specialty: searchTerm });
      setProviders(data);
    } catch (error) {
      console.error('Search failed:', error);
      setMessage('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewSlots = async (provider, service) => {
    setSelectedProvider({ ...provider, selectedService: service });
    setSlotsLoading(true);
    
    try {
      const startDate = new Date().toISOString();
      const endDate = addDays(new Date(), 14).toISOString();
      const slotsData = await providerService.getSlots(service.id, startDate, endDate);
      setSlots(slotsData.slice(0, 20)); // Limit to 20 slots
    } catch (error) {
      console.error('Failed to load slots:', error);
      setMessage('Failed to load available slots.');
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleBookSlot = async (slot) => {
    setBookingLoading(true);
    try {
      await bookingService.create({
        clinicId: slot.clinicId,
        serviceId: slot.serviceId,
        slotId: slot.id,
        notes: 'Booked via web platform',
      });
      
      setMessage('Appointment booked successfully!');
      setSelectedProvider(null);
      setSlots([]);
    } catch (error) {
      console.error('Booking failed:', error);
      setMessage('Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setSelectedProvider(null);
    setSlots([]);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Find Healthcare Providers
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

      {/* Search Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              fullWidth
              label="Search by specialty"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g., cardiology, dermatology, orthopedics"
            />
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
              {loading ? <CircularProgress size={20} /> : 'Search'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Providers Grid */}
      <Grid container spacing={3}>
        {providers.map((provider) => (
          <Grid item xs={12} md={6} lg={4} key={provider.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                    {provider.name[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" component="div">
                      {provider.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {provider.providerOrg.name}
                    </Typography>
                    <Rating value={4.5} readOnly size="small" />
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {provider.address}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {provider.phone}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="subtitle2" gutterBottom>
                  Specialties:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  {provider.providerUsers[0]?.specialties.map((specialty) => (
                    <Chip key={specialty} label={specialty} size="small" />
                  ))}
                </Box>

                <Typography variant="subtitle2" gutterBottom>
                  Services:
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {provider.services.map((service) => (
                    <Box key={service.id} sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">
                          {service.name}
                        </Typography>
                        <Typography variant="body2" color="primary.main" fontWeight="bold">
                          ${service.price}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {service.description}
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<ScheduleIcon />}
                        onClick={() => handleViewSlots(provider, service)}
                        sx={{ mt: 1, mb: 1 }}
                      >
                        View Available Times
                      </Button>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {providers.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <SearchIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No providers found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try searching for a different specialty
          </Typography>
        </Box>
      )}

      {/* Slots Dialog */}
      <Dialog 
        open={!!selectedProvider} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Available Appointments - {selectedProvider?.selectedService?.name}
          <Typography variant="body2" color="text.secondary">
            {selectedProvider?.name} • ${selectedProvider?.selectedService?.price}
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          {slotsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {slots.map((slot) => (
                <React.Fragment key={slot.id}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="body1">
                              {format(new Date(slot.startTime), 'EEEE, MMMM d, yyyy')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {format(new Date(slot.startTime), 'h:mm a')} - {format(new Date(slot.endTime), 'h:mm a')}
                            </Typography>
                          </Box>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleBookSlot(slot)}
                            disabled={bookingLoading || slot.available === 0}
                          >
                            {slot.available === 0 ? 'Unavailable' : 'Book Now'}
                          </Button>
                        </Box>
                      }
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
              
              {slots.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No available slots found for the next 14 days
                  </Typography>
                </Box>
              )}
            </List>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Providers;