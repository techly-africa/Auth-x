import { Body, Controller, Post, UsePipes, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './login-user.dto';
import { LoginUserValidationPipe } from './Validations/login-user-validation.pipe';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Authentication & Authorizations')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
}
