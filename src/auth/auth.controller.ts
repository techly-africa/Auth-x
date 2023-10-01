import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './login-user.dto';
import { LoginUserValidationPipe } from './Validations/login-user-validation.pipe';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}



    @Post('login')
    @UsePipes(LoginUserValidationPipe)
    async LoginUser(
        @Body()
        user : LoginUserDto
    ) : Promise<{token : string}> {
        return this.authService.loginUser(user);
    }
}
