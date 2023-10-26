import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginUserDto } from './login-user.dto';
import { LoginUserValidationPipe } from './Validations/login-user-validation.pipe';
import { ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;
    let pipe: LoginUserValidationPipe;

    const mockAuthService = {
        loginUser: jest.fn(),
        verifyUserToken: jest.fn(),
        verifyLogin: jest.fn(),
    };
    const mockResponse: Response = {
        cookie: jest.fn(),
        send: jest.fn(),
        // Add any other necessary properties here
    } as unknown as Response;
    const jwtServiceMock = {
        sign: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
                {
                    provide: JwtService,
                    useValue: jwtServiceMock,
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
            const result = await authController.verifyLogin(mockToken);
            expect(result).toEqual({ message: 'Email Verification Successful' });
            expect(mockAuthService.verifyUserToken).toHaveBeenCalledWith(mockToken);
        });
        it('should call authService.verifyLogin with the provided OTP', async () => {
            const mockOTP = '123456';
            await authController.verifyEmail(mockOTP);

            expect(mockAuthService.verifyLogin).toHaveBeenCalledWith(mockOTP);
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
        it('should call authService.verifyUserToken with the provided token', async () => {
            const mockToken = 'mockToken';
            await authController.verifyLogin(mockToken);

            expect(mockAuthService.verifyUserToken).toHaveBeenCalledWith(mockToken);
        });

        it('should return the result of verifyUserToken', async () => {
            const mockToken = 'mockToken';
            const expectedResult = { message: 'Token verified' };
            mockAuthService.verifyUserToken.mockResolvedValue(expectedResult);

            const result = await authController.verifyLogin(mockToken);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('googleAuthRedirect', () => {
        it('should call jwtService.sign with correct token payload', async () => {
            const mockRequest = { user: { _id: 'mockId', name: 'John Doe', roles: ['user'] } };
            jwtServiceMock.sign.mockReturnValue('mockToken');

            await authController.googleAuthRedirect(mockRequest, mockResponse);

            expect(jwtServiceMock.sign).toHaveBeenCalledWith({
                id: 'mockId',
                name: 'John Doe',
                roles: ['user'],
            });
        });

        it('should set a cookie with the token', async () => {
            const mockRequest = { user: { _id: 'mockId', name: 'John Doe', roles: ['user'] } };
            jwtServiceMock.sign.mockReturnValue('mockToken');

            await authController.googleAuthRedirect(mockRequest, mockResponse);

            expect(mockResponse.cookie).toHaveBeenCalledWith('token', 'mockToken', { httpOnly: true });
        });

        it('should send a welcome message', async () => {
            const mockRequest = { user: { _id: 'mockId', name: 'John Doe', roles: ['user'] } };
            jwtServiceMock.sign.mockReturnValue('mockToken');

            await authController.googleAuthRedirect(mockRequest, mockResponse);

            expect(mockResponse.send).toHaveBeenCalledWith('Google Login Successful ! Welcome John Doe');
        });
    });
});