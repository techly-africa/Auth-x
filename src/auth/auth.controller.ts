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
import * as cookie from 'cookie';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
@ApiTags('Authentication & Authorizations')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: 'Login a User ' })
  @Post('login')
  @UsePipes(LoginUserValidationPipe)
  async LoginUser(
    @Body()
    user: LoginUserDto,
  ): Promise<{ token: string }> {
    return this.authService.loginUser(user);
  }

  @Get('verify/:token')
  @ApiOperation({ summary: 'Verify user token on signUp' })
  async verifyEmail(@Param('token') token: string) {
    return this.authService.verifyUserToken(token);
  }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

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
  @Get('/github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {}

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
    res.send('Login  with GItthub Successful ! Welcome ' + req.user.name);
  }
}
