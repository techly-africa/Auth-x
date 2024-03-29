import {
  Body,
  Controller,
  Post,
  UsePipes,
  Get,
  Param,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './login-user.dto';
import { LoginUserValidationPipe } from './Validations/login-user-validation.pipe';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
@ApiTags('Authentication & Authorizations')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) { }

  @ApiOperation({ summary: 'Login a User ' })
  @Post('login')
  @UsePipes(LoginUserValidationPipe)
  async LoginUser(
    @Body()
    user: LoginUserDto,
  ): Promise<{ token?: string }> {
    return this.authService.loginUser(user);
  }
  @Get('/otp/verify/:token')
  @ApiOperation({ summary: 'Otp validation' })
  async verifyLogin(@Param('token') token: string) {
    return await this.authService.verifyUserToken(token);
  }

  @Get('/mfa/:otp')
  @ApiOperation({ summary: 'Two factor authentication login' })
  async verifyEmail(@Param('otp') otp: string) {
    return this.authService.verifyLogin(otp);
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const tokenPayload = {
      id: req.user._id,
      name: req.user.name,
      roles: req.user.roles,
    };

    const token = this.jwtService.sign(tokenPayload);
    res.cookie('token', token, { httpOnly: true });
    res.send('Google Login Successful ! Welcome ' + req.user.name);
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthRedirect(@Req() req, @Res() res: Response) {
    const tokenPayload = {
      id: req.user._id,
      name: req.user.name,
      roles: req.user.roles,
    };
    const token = this.jwtService.sign(tokenPayload);
    res.cookie('token', token, { httpOnly: true });
    res.send('Login  with GIthub Successful ! Welcome ' + req.user.name);
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthRedirect(@Req() req, @Res() res: Response) {
    const tokenPayload = {
      id: req.user._id,
      name: req.user.name,
      roles: req.user.roles,
    };
    const token = this.jwtService.sign(tokenPayload);
    res.cookie('token', token, { httpOnly: true });
    res.send('Login  with Facebook Successful ! Welcome ' + req.user.name);
  }
}
