import { ProvidersService } from './providers.service';
export declare class ProvidersResolver {
    private providersService;
    constructor(providersService: ProvidersService);
    searchProviders(input: string): Promise<string>;
    availableSlots(serviceId: string, dateRange: string): Promise<string>;
    providerDetails(clinicId: string): Promise<string>;
}
