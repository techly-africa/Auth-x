import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { MailService } from '../mail/mail.service';
import { LoginUserDto } from './login-user.dto';
import { generateOTP } from '../user/utils/codeGenerator';
import { getExpiry } from '../user/utils/dateUtility';

jest.mock('bcrypt', () => ({
    compare: jest.fn().mockResolvedValue(true)
}));
describe('AuthService', () => {
    let authService: AuthService;
    const jwtServiceMock = {
        sign: jest.fn(),
    };
    const mockUserModel = {
        findOne: jest.fn(),
    };
    const mailerServiceMock = {
        sendUserEmail: jest.fn(),
        sendUserOtp: jest.fn(),
    };
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: getModelToken(User.name),
                    useValue: mockUserModel,
                },
                {
                    provide: MailService,
                    useValue: mailerServiceMock,
                },
                {
                    provide: JwtService,
                    useValue: jwtServiceMock,
                },
            ],
        }).compile();
        authService = module.get<AuthService>(AuthService);
    });

    describe('loginUser', () => {
        it('should throw BadRequestException if no email or phone or password provided', async () => {
            try {
                await authService.loginUser({ password: '' });
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
                expect(error.message).toBe(
                    'Please provide either email or phone and password',
                );
            }
        });

        it('should throw BadRequestException if user not found', async () => {
            mockUserModel.findOne.mockResolvedValue(null);
            try {
                await authService.loginUser({ email: 'nambajeeedwin@gmail.com', password: 'password' });
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
                expect(error.message).toBe('Invalid Credentials');
            }
        });

        it('should throw BadRequestException if password does not match', async () => {
            const mockUser = { email: 'nambajeeedwin@gmail.com', password: 'hashedPassword', isVerified: true };
            mockUserModel.findOne.mockResolvedValue(mockUser);
            try {
                await authService.loginUser({ email: 'nambajeeedwin@gmail.com', password: 'wrongPassword' });
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
                expect(error.message).toBe('Invalid Credentials');
            }
        });

        it('should throw BadRequestException if user is not verified', async () => {
            const mockUser = { email: 'test@example.com', password: 'hashedPassword', isVerified: false };
            mockUserModel.findOne.mockResolvedValue(mockUser);
            try {
                await authService.loginUser({ email: 'test@example.com', password: 'password' });
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
                expect(error.message).toBe('Please verify your Email');
            }
        });
        it('should throw BadRequestException if user is deleted', async () => {
            const mockUser = {
                _id: 'someUserId',
                name: 'edwin',
                role: 'user',
                isVerified: true,
                email: 'nambajeeedwin@gmail.com',
                password: 'password',
            };
            mockUserModel.findOne.mockResolvedValue({ ...mockUser, isDeleted: true });

            const user: LoginUserDto = { email: 'john@example.com', password: 'password' };

            await expect(authService.loginUser(user)).rejects.toThrowError(
                BadRequestException,
            );
        });
        it('should return a token and message if login is successful (without 2FA)', async () => {
            const mockUser = {
                _id: 'someUserId',
                name: 'Edwin',
                role: 'user',
                isVerified: true,
                email: 'nambajeeedwin@gmail.com',
                password: 'password',
            };
            mockUserModel.findOne.mockResolvedValue(mockUser);
            jwtServiceMock.sign.mockReturnValue('someToken');
            const user: LoginUserDto = { email: 'Edwin@gmail.com', password: 'password' };
            const result = await authService.loginUser(user);

            expect(result).toEqual({
                token: 'someToken',
                message: `Welcome, Edwin! Your login was successful, and we're thrilled to have you join our community.`,
            });
        });

        // it('should send OTP and return message if login is successful (with 2FA)', async () => {
        //     const mockUser = {
        //         _id: 'someUserId',
        //         name: 'edwin',
        //         role: 'user',
        //         isVerified: true,
        //         email: 'nambajeeedwin@gmail.com',
        //         password: 'password',
        //         mfa_code: generateOTP(6)
        //     };
        //     mockUserModel.findOne.mockResolvedValue({ ...mockUser, mfa_enabled: true });
        //     jwtServiceMock.sign.mockReturnValue('someToken');
        //     const user: LoginUserDto = { email: 'nambajeeedwin@gmail.com', password: 'password' };
        //     const result = await authService.loginUser(user);
        //     mailerServiceMock.sendUserOtp('12345', user.email)
        //     expect(mailerServiceMock.sendUserOtp).toHaveBeenCalledWith('12345', user.email);
        //     expect(result).toEqual({
        //         message: 'OTP sent to your email',
        //     });
        // });
        it('should throw NotFoundException if user not found by OTP', async () => {
            mockUserModel.findOne.mockResolvedValue(null);

            await expect(authService.verifyLogin('123456')).rejects.toThrowError(
                NotFoundException,
            );
        });

        it('should throw BadRequestException if OTP is expired', async () => {
            const mockUser = {
                _id: 'someUserId',
                name: 'edwin',
                role: 'user',
                isVerified: true,
                email: 'nambajeeedwin@gmail.com',
                password: 'password',
            };
            mockUserModel.findOne.mockResolvedValue({ ...mockUser, mfa_code: '123456', mfa_timeout: new Date('2023-10-26T12:00:00Z') });

            await expect(authService.verifyLogin('123456')).rejects.toThrowError(
                BadRequestException,
            );
        });

        it('should return a token and message if OTP is valid', async () => {
            const mockDate = new Date();
            mockDate.setMonth(mockDate.getMonth() + 1);
            const mockUser = {
                _id: 'someUserId',
                name: 'Edwin',
                role: 'user',
                isVerified: true,
                email: 'nambajeeedwin@gmail.com',
                password: 'password',
            };
            mockUserModel.findOne.mockResolvedValue({ ...mockUser, mfa_code: '123456', mfa_timeout: mockDate });
            jwtServiceMock.sign.mockReturnValue('someToken');

            const result = await authService.verifyLogin('123456');

            expect(result).toEqual({
                token: 'someToken',
                message: `Welcome, Edwin! Your login was successful, and we're thrilled to have you join our community.`,
            });
        });

        it('should return a token and message if login is successful', async () => {
            const jwtServiceSignMock = jest.spyOn(jwtServiceMock, 'sign').mockReturnValue('someToken');
            const mockUser = {
                _id: 'someUserId',
                name: 'edwin',
                role: 'user',
                isVerified: true,
                email: 'nambajeeedwin@gmail.com',
                password: 'password',
            };
            mockUserModel.findOne.mockResolvedValue(mockUser);
            const result = await authService.loginUser({ email: 'nambajeeedwin@gmail.com', password: 'password' });
            expect(result).toEqual({
                token: 'someToken',
                message: `Welcome, edwin! Your login was successful, and we're thrilled to have you join our community.`,
            });
        });

    });

    describe('verifyUserToken', () => {
        it('should throw NotFoundException if user not found by verification token', async () => {
            mockUserModel.findOne.mockResolvedValue(null);
            try {
                await authService.verifyUserToken('someToken');
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
                expect(error.message).toBe('Invalid verification token');
            }
        });

        it('should set user as verified and return success message', async () => {
            const mockUser = { verificationToken: 'someToken', isVerified: false, save: jest.fn() };
            mockUserModel.findOne.mockResolvedValue(mockUser);
            const result = await authService.verifyUserToken('someToken');
            expect(mockUser.isVerified).toBe(true);
            expect(mockUser.save).toHaveBeenCalled();
            expect(result).toEqual({
                message: 'Email Verification Successful',
            });
        });
    });
});