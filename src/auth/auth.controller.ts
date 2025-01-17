import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async registeruser(@Body() registerUser: RegisterUserDto) {
    return this.authService.register(registerUser);
  }

  @Post('login')
  async login(@Body() loginUser: LoginUserDto) {
    return await this.authService.login(loginUser);
  }

  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getUserData(@Req() req) {
    return await this.authService.getUserData(req.user.sub);
  }
  @Get('logout')
  async logout() {
    return 'Logged out successfully';
  }
}
