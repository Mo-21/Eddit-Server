import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { LoginDto, RegistrationDto } from './dto';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  register(@Body() dto: RegistrationDto, @Res() res: Response) {
    return this.authService.register(dto, res);
  }

  @Post('login')
  login(@Body() dto: LoginDto, @Res() res: Response) {
    return this.authService.login(dto, res);
  }

  @Get('logout')
  logout(@Res() res: Response) {
    return this.authService.logout(res);
  }
}
