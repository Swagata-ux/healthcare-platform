import { ProvidersService } from './providers.service';
export declare class ProvidersController {
    private providersService;
    constructor(providersService: ProvidersService);
    searchProviders(query: any): Promise<any>;
    getProviderDetails(id: string): Promise<any>;
    getAvailableSlots(serviceId: string, start: string, end: string): Promise<any>;
}
