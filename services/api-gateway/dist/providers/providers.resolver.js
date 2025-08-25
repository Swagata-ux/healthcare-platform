"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvidersResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const providers_service_1 = require("./providers.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const common_lib_1 = require("@healthcare/common-lib");
let ProvidersResolver = class ProvidersResolver {
    constructor(providersService) {
        this.providersService = providersService;
    }
    async searchProviders(input) {
        const searchInput = (0, common_lib_1.validateInput)(common_lib_1.SearchProvidersSchema, JSON.parse(input));
        const providers = await this.providersService.searchProviders(searchInput);
        return JSON.stringify(providers);
    }
    async availableSlots(serviceId, dateRange) {
        const range = JSON.parse(dateRange);
        const slots = await this.providersService.getAvailableSlots(serviceId, range);
        return JSON.stringify(slots);
    }
    async providerDetails(clinicId) {
        const provider = await this.providersService.getProviderDetails(clinicId);
        return JSON.stringify(provider);
    }
};
exports.ProvidersResolver = ProvidersResolver;
__decorate([
    (0, graphql_1.Query)(() => String),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProvidersResolver.prototype, "searchProviders", null);
__decorate([
    (0, graphql_1.Query)(() => String),
    __param(0, (0, graphql_1.Args)('serviceId')),
    __param(1, (0, graphql_1.Args)('dateRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProvidersResolver.prototype, "availableSlots", null);
__decorate([
    (0, graphql_1.Query)(() => String),
    __param(0, (0, graphql_1.Args)('clinicId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProvidersResolver.prototype, "providerDetails", null);
exports.ProvidersResolver = ProvidersResolver = __decorate([
    (0, graphql_1.Resolver)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [providers_service_1.ProvidersService])
], ProvidersResolver);
//# sourceMappingURL=providers.resolver.js.map