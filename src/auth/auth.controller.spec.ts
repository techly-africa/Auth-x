import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginUserDto } from './login-user.dto';
import { LoginUserValidationPipe } from './Validations/login-user-validation.pipe'; // Import the validation pipe
import { ArgumentMetadata, BadRequestException } from '@nestjs/common';

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;
    let pipe: LoginUserValidationPipe;

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
        pipe = new LoginUserValidationPipe();
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

    describe('LoginUserValidationPipe', () => {
        it('should throw BadRequestException if neither email nor phone is provided', () => {
            const mockValue = { email: '', phone: '', password: 'password' };
            const mockMetadata = {} as ArgumentMetadata;

            try {
                pipe.transform(mockValue, mockMetadata);
            } catch (e) {
                expect(e).toBeInstanceOf(BadRequestException);
                expect(e.message).toBe('Either email or phone must be provided.');
            }
        });

        it('should return value if either email or phone is provided', () => {
            const mockValue1 = { email: 'nambajeeedwin@gmail.com', password: 'password' };
            const mockValue2 = { phone: '0787415987', password: 'password' };
            const mockMetadata = {} as ArgumentMetadata;

            const result1 = pipe.transform(mockValue1, mockMetadata);
            const result2 = pipe.transform(mockValue2, mockMetadata);

            expect(result1).toEqual(mockValue1);
            expect(result2).toEqual(mockValue2);
        });
    });
});
