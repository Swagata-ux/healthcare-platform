import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  Grid,
  Divider,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as DateIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

const Profile = () => {
  const { user } = useAuth();

  const getRoleColor = (role) => {
    switch (role) {
      case 'PATIENT': return 'primary';
      case 'PROVIDER': return 'success';
      case 'ADMIN': return 'error';
      default: return 'default';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'PATIENT': return '👤';
      case 'PROVIDER': return '👨‍⚕️';
      case 'ADMIN': return '👨‍💼';
      default: return '👤';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Overview */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: 'primary.main',
                  fontSize: '2rem',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                {user?.patient?.firstName?.[0] || user?.email?.[0]?.toUpperCase()}
              </Avatar>
              
              <Typography variant="h5" gutterBottom>
                {user?.patient?.firstName && user?.patient?.lastName
                  ? `${user.patient.firstName} ${user.patient.lastName}`
                  : user?.email
                }
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
                <Chip
                  icon={<span>{getRoleIcon(user?.role)}</span>}
                  label={user?.role}
                  color={getRoleColor(user?.role)}
                  variant="outlined"
                />
                {user?.verified && (
                  <Chip
                    icon={<SecurityIcon sx={{ fontSize: 16 }} />}
                    label="Verified"
                    color="success"
                    size="small"
                  />
                )}
              </Box>

              <Typography variant="body2" color="text.secondary">
                Member since {user?.createdAt ? format(new Date(user.createdAt), 'MMMM yyyy') : 'Unknown'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Account Information */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account Information
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <EmailIcon sx={{ color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Email Address
                    </Typography>
                    <Typography variant="body1">
                      {user?.email}
                    </Typography>
                  </Box>
                </Box>

                {user?.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <PhoneIcon sx={{ color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Phone Number
                      </Typography>
                      <Typography variant="body1">
                        {user.phone}
                      </Typography>
                    </Box>
                  </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <DateIcon sx={{ color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Account Created
                    </Typography>
                    <Typography variant="body1">
                      {user?.createdAt ? format(new Date(user.createdAt), 'PPPP') : 'Unknown'}
                    </Typography>
                  </Box>
                </Box>

                {user?.lastLoginAt && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <SecurityIcon sx={{ color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Last Login
                      </Typography>
                      <Typography variant="body1">
                        {format(new Date(user.lastLoginAt), 'PPpp')}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Patient Information */}
        {user?.patient && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Patient Information
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Full Name
                      </Typography>
                      <Typography variant="body1">
                        {user.patient.firstName} {user.patient.lastName}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Date of Birth
                      </Typography>
                      <Typography variant="body1">
                        {user.patient.dateOfBirth ? format(new Date(user.patient.dateOfBirth), 'PPPP') : 'Not specified'}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Gender
                      </Typography>
                      <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                        {user.patient.gender}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Address
                      </Typography>
                      <Typography variant="body1">
                        {user.patient.address}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Emergency Contact
                      </Typography>
                      <Typography variant="body1">
                        {user.patient.emergencyContact}
                      </Typography>
                    </Box>

                    {user.patient.medicalNotes && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Medical Notes
                        </Typography>
                        <Typography variant="body1">
                          {user.patient.medicalNotes}
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Provider Information */}
        {user?.providerUser && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Provider Information
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        License Number
                      </Typography>
                      <Typography variant="body1">
                        {user.providerUser.licenseNumber}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Specialties
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        {user.providerUser.specialties.map((specialty) => (
                          <Chip key={specialty} label={specialty} size="small" />
                        ))}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Account Settings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account Settings
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Chip
                  label={`Language: ${user?.locale?.toUpperCase() || 'EN'}`}
                  variant="outlined"
                />
                <Chip
                  label={`Timezone: ${user?.timezone || 'UTC'}`}
                  variant="outlined"
                />
                <Chip
                  label={user?.verified ? 'Email Verified' : 'Email Not Verified'}
                  color={user?.verified ? 'success' : 'warning'}
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;