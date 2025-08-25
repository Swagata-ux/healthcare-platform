import { SearchProvidersInput } from '@healthcare/common-lib';
export declare class ProvidersService {
    private prisma;
    searchProviders(input: SearchProvidersInput): Promise<any>;
    getAvailableSlots(serviceId: string, dateRange: {
        start: string;
        end: string;
    }): Promise<any>;
    getProviderDetails(clinicId: string): Promise<any>;
}
