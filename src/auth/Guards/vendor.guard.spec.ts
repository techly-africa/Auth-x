// vendor.guard.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { VendorGuard } from './vendor.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

describe('VendorGuard', () => {
    let vendorGuard: VendorGuard;

    const mockJwtService = {
        verifyAsync: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                VendorGuard,
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
            ],
        }).compile();

        vendorGuard = module.get<VendorGuard>(VendorGuard);
    });

    it('should be defined', () => {
        expect(vendorGuard).toBeDefined();
    });

    it('should throw UnauthorizedException if no token is provided', async () => {
        const context = {
            switchToHttp: () => ({
                getRequest: () => ({ headers: {} }),
            }),
        } as ExecutionContext;

        await expect(vendorGuard.canActivate(context)).rejects.toThrow(
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

        await expect(vendorGuard.canActivate(context)).rejects.toThrow(
            UnauthorizedException,
        );
    });

    it('should throw UnauthorizedException if role is not 1', async () => {
        const context = {
            switchToHttp: () => ({
                getRequest: () => ({
                    headers: { authorization: 'Bearer validToken' },
                }),
            }),
        } as ExecutionContext;

        mockJwtService.verifyAsync.mockResolvedValue({ role: 0 });

        await expect(vendorGuard.canActivate(context)).rejects.toThrow(
            UnauthorizedException,
        );
    });
});
