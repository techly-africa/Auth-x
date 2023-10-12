import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginUserDto } from './login-user.dto';

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;

    const mockAuthService = {
        loginUser: jest.fn(),
        verifyUserToken: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    describe('LoginUser', () => {
        it('should return a token when login is successful', async () => {
            const mockToken = 'someToken';
            const mockUser: LoginUserDto = {
                email: 'nambajeeedwin@gmail.com', password: 'password'
            };

            mockAuthService.loginUser.mockResolvedValueOnce({ token: mockToken });
            const result = await authController.LoginUser(mockUser);
            expect(result).toEqual({ token: mockToken });
            expect(mockAuthService.loginUser).toHaveBeenCalledWith(mockUser);
        });
    });

    describe('verifyEmail', () => {
        it('should verify the email', async () => {
            const mockToken = 'someToken';
            mockAuthService.verifyUserToken.mockResolvedValueOnce({ message: 'Email Verification Successful' });
            const result = await authController.verifyEmail(mockToken);
            expect(result).toEqual({ message: 'Email Verification Successful' });
            expect(mockAuthService.verifyUserToken).toHaveBeenCalledWith(mockToken);
        });
    });
});
