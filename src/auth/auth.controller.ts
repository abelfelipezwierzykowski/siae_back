import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterUserDto) {
    const user = await this.authService.register(registerDto);
    return { user };
  }

  @Post('login')
  async login(@Body() loginDto: LoginUserDto) {
    const user = await this.authService.login(loginDto);
    return { user };
  }

  @Get('profile/:id')
  async getProfile(@Param('id') id: string) {
    return this.authService.getProfile(id);
  }
}
