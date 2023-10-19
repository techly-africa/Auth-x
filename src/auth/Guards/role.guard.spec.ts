import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { RoleCheckGuard } from './role.guard';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import { Model } from 'mongoose';
import { Role } from '../../role/schemas/role.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('RoleCheckGuard', () => {
    let guard: RoleCheckGuard;
    let jwtService: JwtService;
    let userService: UserService;
    let roleModel: Model<Role>;
    const userModelMock = {
        findById: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RoleCheckGuard,
                {
                    provide: JwtService,
                    useValue: {
                        verifyAsync: jest.fn(),
                    },
                },
                {
                    provide: UserService,
                    useValue: userModelMock,
                },
                {
                    provide: getModelToken(Role.name),
                    useValue: {
                        find: jest.fn(),
                    },
                },
            ],
        }).compile();

        guard = module.get<RoleCheckGuard>(RoleCheckGuard);
        jwtService = module.get<JwtService>(JwtService);
        userService = module.get<UserService>(UserService);
        roleModel = module.get<Model<Role>>(getModelToken(Role.name));
    });

    it('should be defined', () => {
        expect(guard).toBeDefined();
    });

    it('should throw UnauthorizedException for unauthorized user', async () => {
        const mockUserRoles = [{ roleName: 'User' }];
        const mockUser = { roles: mockUserRoles };
        const mockToken = 'mockToken';
        jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ id: 'mockUserId' });
        jest.spyOn(roleModel, 'find').mockResolvedValue(mockUserRoles);
        await expect(guard.canActivate({ switchToHttp: () => ({ getRequest: () => ({ headers: { authorization: `Bearer ${mockToken}` } }) }) } as any)).rejects.toThrow(UnauthorizedException);
    });
});
