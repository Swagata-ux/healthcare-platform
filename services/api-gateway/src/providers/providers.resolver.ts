import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { validateInput, SearchProvidersSchema } from '@healthcare/common-lib';

@Resolver()
@UseGuards(JwtAuthGuard)
export class ProvidersResolver {
  constructor(private providersService: ProvidersService) {}

  @Query(() => String)
  async searchProviders(@Args('input') input: string) {
    const searchInput = validateInput(SearchProvidersSchema, JSON.parse(input));
    const providers = await this.providersService.searchProviders(searchInput);
    return JSON.stringify(providers);
  }

  @Query(() => String)
  async availableSlots(
    @Args('serviceId') serviceId: string,
    @Args('dateRange') dateRange: string,
  ) {
    const range = JSON.parse(dateRange);
    const slots = await this.providersService.getAvailableSlots(serviceId, range);
    return JSON.stringify(slots);
  }

  @Query(() => String)
  async providerDetails(@Args('clinicId') clinicId: string) {
    const provider = await this.providersService.getProviderDetails(clinicId);
    return JSON.stringify(provider);
  }
}