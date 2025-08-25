import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { RecommendationModule } from './recommendation/recommendation.module';
import { SchedulingModule } from './scheduling/scheduling.module';
import { ForecastModule } from './forecast/forecast.module';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    RecommendationModule,
    SchedulingModule,
    ForecastModule,
  ],
})
export class AppModule {}