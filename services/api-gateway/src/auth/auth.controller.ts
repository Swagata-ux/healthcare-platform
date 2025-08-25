import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { validateInput, LoginSchema, RegisterSchema } from '@healthcare/common-lib';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Throttle(5, 60) // 5 attempts per minute
  async login(@Body() body: any) {
    const data = validateInput(LoginSchema, body);
    return this.authService.login(data.email, data.password);
  }

  @Post('register')
  @Throttle(3, 60) // 3 registrations per minute
  async register(@Body() body: any) {
    const data = validateInput(RegisterSchema, body);
    return this.authService.register(data);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: any) {
    return req.user;
  }
}