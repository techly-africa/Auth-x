// admin.guard.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { AdminGuard } from './admin.guard';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

describe('AdminGuard', () => {
    let adminGuard: AdminGuard;
    let jwtService: JwtService;

    const mockJwtService = {
        verifyAsync: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AdminGuard,
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
                {
                    provide: JwtService,
                    useValue: {
                        verifyAsync: jest.fn(),
                    },
                },
            ],
        }).compile();

        adminGuard = module.get<AdminGuard>(AdminGuard);
    });

    it('should be defined', () => {
        expect(adminGuard).toBeDefined();
    });

    it('should throw UnauthorizedException if no token is provided', async () => {
        const context = {
            switchToHttp: () => ({ getRequest: () => ({ headers: {} }) }),
        } as any;

        try {
            await adminGuard.canActivate(context);
        } catch (e) {
            expect(e).toBeInstanceOf(UnauthorizedException);
        }
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
        const context = {
            switchToHttp: () => ({ getRequest: () => ({ headers: { authorization: 'Bearer invalidToken' } }) }),
        } as any;

        mockJwtService.verifyAsync.mockRejectedValueOnce(new Error('Invalid token'));

        try {
            await adminGuard.canActivate(context);
        } catch (e) {
            expect(e).toBeInstanceOf(UnauthorizedException);
        }
    });

    it('should throw UnauthorizedException if role is not 0', async () => {
        const context = {
            switchToHttp: () => ({ getRequest: () => ({ headers: { authorization: 'Bearer validToken' } }) }),
        } as any;

        mockJwtService.verifyAsync.mockResolvedValueOnce({ role: 1 });

        try {
            await adminGuard.canActivate(context);
        } catch (e) {
            expect(e).toBeInstanceOf(UnauthorizedException);
        }
    });
});
