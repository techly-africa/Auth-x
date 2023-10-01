import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './login-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}



    @Post('login')

    async LoginUser(
        @Body()
        user : LoginUserDto
    ) : Promise<{token : string}> {
        return this.authService.loginUser(user);
    }
}
