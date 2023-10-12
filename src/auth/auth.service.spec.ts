import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';

jest.mock('bcrypt', () => ({
    compare: jest.fn().mockResolvedValue(true)
}));
describe('AuthService', () => {
    let authService: AuthService;
    let jwtServiceMock: Partial<JwtService>;
    const mockUserModel = {
        findOne: jest.fn(),
    };
    beforeEach(async () => {
        jwtServiceMock = {
            sign: jest.fn(),
        };
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: getModelToken(User.name),
                    useValue: mockUserModel,
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
                message: `Welcome, edwin! Your login was successful, and we're thrilled to have you join the MPACash community. Get ready to explore a world of convenient financial services at your fingertips.`,
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
