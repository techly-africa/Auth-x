import { Test, TestingModule } from '@nestjs/testing';
import { RoleCheckGuard } from './role.guard';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import { getModelToken } from '@nestjs/mongoose';
import { Role } from '../../role/schemas/role.schema';

class JwtServiceMock {
    verifyAsync() {
        return { id: 'some-user-id' };
    }
}
class UserServiceMock {
    findOne(id: string) {
        if (id === 'some-user-id') {
            return { roles: ['role-id-1'] };
        }
        return null;
    }
}
class RoleModelMock {
    static find = jest.fn().mockResolvedValue([{ roleName: 'Super Admin' }])
}

describe('RoleCheckGuard', () => {
    let guard: RoleCheckGuard;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RoleCheckGuard,
                {
                    provide: JwtService,
                    useClass: JwtServiceMock,
                },
                {
                    provide: UserService,
                    useClass: UserServiceMock,
                },
                {
                    provide: getModelToken(Role.name),
                    useValue: RoleModelMock,
                },
            ],
        }).compile();

        guard = module.get<RoleCheckGuard>(RoleCheckGuard);
    });

    it('should be defined', () => {
        expect(guard).toBeDefined();
    });

    it('should return true for a user with required role', async () => {
        const context = {
            switchToHttp: jest.fn().mockReturnValue({
                getRequest: jest.fn().mockReturnValue({
                    headers: { authorization: 'Bearer some-token' },
                }),
            }),
        };

        const result = await guard.canActivate(context as any);
        expect(result).toBe(true);
    });

    it('should throw UnauthorizedException if token is not provided', async () => {
        const context = {
            switchToHttp: jest.fn().mockReturnValue({
                getRequest: jest.fn().mockReturnValue({
                    headers: {},
                }),
            }),
        };

        await expect(guard.canActivate(context as any)).rejects.toThrow(
            UnauthorizedException,
        );
    });



    it('should throw UnauthorizedException if user does not have required role', async () => {
        const context = {
            switchToHttp: jest.fn().mockReturnValue({
                getRequest: jest.fn().mockReturnValue({
                    headers: { authorization: 'Bearer some-token' },
                }),
            }),
        };

        RoleModelMock.find.mockResolvedValue([{ roleName: 'User' }]);

        await expect(guard.canActivate(context as any)).rejects.toThrow(
            UnauthorizedException,
        );
    });
});
