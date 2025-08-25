import { PrismaClient } from '@prisma/client';
import { AuthService } from './auth';

const prisma = new PrismaClient();
const authService = new AuthService(process.env.JWT_SECRET || 'dev-secret');

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await authService.hashPassword('Admin123!');
  await prisma.user.upsert({
    where: { email: 'admin@healthcare.com' },
    update: {},
    create: {
      email: 'admin@healthcare.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
      verified: true,
    },
  });

  // Create provider organization
  const providerOrg = await prisma.providerOrg.upsert({
    where: { id: 'provider-org-1' },
    update: {},
    create: {
      id: 'provider-org-1',
      name: 'City General Hospital',
      type: 'hospital',
      address: '123 Main St, San Francisco, CA 94102',
      lat: 37.7749,
      lng: -122.4194,
      npiId: '1234567890',
    },
  });

  // Create clinic
  const clinic = await prisma.clinic.upsert({
    where: { id: 'clinic-1' },
    update: {},
    create: {
      id: 'clinic-1',
      providerOrgId: providerOrg.id,
      name: 'Cardiology Department',
      address: '123 Main St, Suite 200, San Francisco, CA 94102',
      lat: 37.7749,
      lng: -122.4194,
      phone: '+1-555-0123',
    },
  });

  // Create provider user
  const providerPassword = await authService.hashPassword('Provider123!');
  const providerUser = await prisma.user.upsert({
    where: { email: 'doctor@healthcare.com' },
    update: {},
    create: {
      email: 'doctor@healthcare.com',
      passwordHash: providerPassword,
      role: 'PROVIDER',
      verified: true,
    },
  });

  await prisma.providerUser.upsert({
    where: { userId: providerUser.id },
    update: {},
    create: {
      userId: providerUser.id,
      clinicId: clinic.id,
      specialties: ['cardiology', 'internal medicine'],
      licenseNumber: 'MD123456',
    },
  });

  // Create services
  const consultationService = await prisma.service.upsert({
    where: { id: 'service-consultation' },
    update: {},
    create: {
      id: 'service-consultation',
      clinicId: clinic.id,
      name: 'Cardiology Consultation',
      description: 'Initial consultation with cardiologist',
      durationMin: 30,
      price: 250.00,
      type: 'consultation',
    },
  });

  await prisma.service.upsert({
    where: { id: 'service-ecg' },
    update: {},
    create: {
      id: 'service-ecg',
      clinicId: clinic.id,
      name: 'ECG Test',
      description: 'Electrocardiogram test',
      durationMin: 15,
      price: 150.00,
      type: 'lab',
    },
  });

  // Create time slots for next 7 days
  const now = new Date();
  const slots = [];
  
  for (let day = 1; day <= 7; day++) {
    const date = new Date(now);
    date.setDate(date.getDate() + day);
    date.setHours(9, 0, 0, 0); // Start at 9 AM
    
    for (let hour = 9; hour < 17; hour++) { // 9 AM to 5 PM
      for (let minute = 0; minute < 60; minute += 30) { // 30-minute slots
        const startTime = new Date(date);
        startTime.setHours(hour, minute, 0, 0);
        
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + 30);
        
        slots.push({
          clinicId: clinic.id,
          serviceId: consultationService.id,
          startTime,
          endTime,
          capacity: 1,
          available: 1,
        });
      }
    }
  }

  await prisma.slot.createMany({
    data: slots,
    skipDuplicates: true,
  });

  // Create patient user
  const patientPassword = await authService.hashPassword('Patient123!');
  const patientUser = await prisma.user.upsert({
    where: { email: 'patient@healthcare.com' },
    update: {},
    create: {
      email: 'patient@healthcare.com',
      passwordHash: patientPassword,
      role: 'PATIENT',
      verified: true,
    },
  });

  await prisma.patient.upsert({
    where: { userId: patientUser.id },
    update: {},
    create: {
      userId: patientUser.id,
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1985-06-15'),
      gender: 'male',
      address: '456 Oak St, San Francisco, CA 94103',
      emergencyContact: 'Jane Doe - +1-555-0124',
    },
  });

  // Create HR job requisition
  await prisma.jobReq.upsert({
    where: { id: 'job-req-1' },
    update: {},
    create: {
      id: 'job-req-1',
      clinicId: clinic.id,
      title: 'Registered Nurse',
      role: 'nurse',
      description: 'Full-time registered nurse position in cardiology department',
      requirements: ['RN License', '2+ years experience', 'BLS certification'],
      shiftPattern: 'Day shift (7 AM - 7 PM)',
      salary: 75000.00,
    },
  });

  // Create shifts for next 30 days
  const shifts = [];
  for (let day = 1; day <= 30; day++) {
    const date = new Date(now);
    date.setDate(date.getDate() + day);
    
    // Day shift
    const dayStart = new Date(date);
    dayStart.setHours(7, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(19, 0, 0, 0);
    
    shifts.push({
      clinicId: clinic.id,
      role: 'nurse',
      startTime: dayStart,
      endTime: dayEnd,
      neededCount: 3,
    });
    
    // Night shift
    const nightStart = new Date(date);
    nightStart.setHours(19, 0, 0, 0);
    const nightEnd = new Date(date);
    nightEnd.setDate(nightEnd.getDate() + 1);
    nightEnd.setHours(7, 0, 0, 0);
    
    shifts.push({
      clinicId: clinic.id,
      role: 'nurse',
      startTime: nightStart,
      endTime: nightEnd,
      neededCount: 2,
    });
  }

  await prisma.shift.createMany({
    data: shifts,
    skipDuplicates: true,
  });

  console.log('Database seeded successfully!');
  console.log('Demo accounts:');
  console.log('- Admin: admin@healthcare.com / Admin123!');
  console.log('- Doctor: doctor@healthcare.com / Provider123!');
  console.log('- Patient: patient@healthcare.com / Patient123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });