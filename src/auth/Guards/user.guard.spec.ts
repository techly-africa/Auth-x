// admin.guard.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserGuard } from './user.guard';

describe('UserGuard', () => {
    let userGuard: UserGuard;

    const mockJwtService = {
        verifyAsync: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserGuard,
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
            ],
        }).compile();

        userGuard = module.get<UserGuard>(UserGuard);
    });

    it('should be defined', () => {
        expect(userGuard).toBeDefined();
    });

    it('should throw UnauthorizedException if no token is provided', async () => {
        const context = {
            switchToHttp: () => ({
                getRequest: () => ({ headers: {} }),
            }),
        } as ExecutionContext;

        await expect(userGuard.canActivate(context)).rejects.toThrow(
            UnauthorizedException,
        );
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
        const context = {
            switchToHttp: () => ({
                getRequest: () => ({
                    headers: { authorization: 'Bearer invalidToken' },
                }),
            }),
        } as ExecutionContext;

        mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

        await expect(userGuard.canActivate(context)).rejects.toThrow(
            UnauthorizedException,
        );
    });

    it('should throw UnauthorizedException if role is not 2', async () => {
        const context = {
            switchToHttp: () => ({
                getRequest: () => ({
                    headers: { authorization: 'Bearer validToken' },
                }),
            }),
        } as ExecutionContext;

        mockJwtService.verifyAsync.mockResolvedValue({ role: 1 });

        await expect(userGuard.canActivate(context)).rejects.toThrow(
            UnauthorizedException,
        );
    });

});
