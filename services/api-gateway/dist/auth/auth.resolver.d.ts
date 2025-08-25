import { AuthService } from './auth.service';
export declare class AuthResolver {
    private authService;
    constructor(authService: AuthService);
    login(email: string, password: string): Promise<string>;
    register(input: string): Promise<string>;
    me(context: any): Promise<string>;
}
