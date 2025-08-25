import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { ProvidersModule } from './providers/providers.module';
import { BookingsModule } from './bookings/bookings.module';
import { HrModule } from './hr/hr.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60000,
      limit: 100,
    }),
    AuthModule,
    ProvidersModule,
    BookingsModule,
    HrModule,
    AiModule,
  ],
})
export class AppModule {}