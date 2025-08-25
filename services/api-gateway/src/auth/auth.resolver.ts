import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => String)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const result = await this.authService.login(email, password);
    return JSON.stringify(result);
  }

  @Mutation(() => String)
  async register(@Args('input') input: string) {
    const data = JSON.parse(input);
    const result = await this.authService.register(data);
    return JSON.stringify(result);
  }

  @Query(() => String)
  @UseGuards(JwtAuthGuard)
  async me(@Context() context: any) {
    return JSON.stringify(context.user);
  }
}