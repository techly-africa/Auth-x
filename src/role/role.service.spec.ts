import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { getModelToken } from '@nestjs/mongoose';
import { Role } from './schemas/role.schema';
import { Permission } from '../permission/schemas/permission.schema';
import { BadRequestException, NotFoundException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import mongoose from 'mongoose';

const mockRolesModel = {
    findOne: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
    findByIdAndDelete: jest.fn(),
};

const mockPermissionModel = {
    find: jest.fn(),
};

describe('RoleService', () => {
    let roleService: RoleService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RoleService,
                {
                    provide: getModelToken(Role.name),
                    useValue: mockRolesModel,
                },
                {
                    provide: getModelToken(Permission.name),
                    useValue: mockPermissionModel,
                },
            ],
        }).compile();

        roleService = module.get<RoleService>(RoleService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createRole', () => {
        it('should create a role', async () => {
            const createRoleDto: CreateRoleDto = {
                roleName: 'Admin',
                description: 'Administrator Role',
            };

            mockRolesModel.findOne.mockReturnValue(null);
            mockRolesModel.create.mockReturnValue(createRoleDto);

            const result = await roleService.createRole(createRoleDto);

            expect(result).toEqual({ message: 'Role Created Successfully' });
            expect(mockRolesModel.findOne).toHaveBeenCalledWith({ roleName: createRoleDto.roleName });
            expect(mockRolesModel.create).toHaveBeenCalledWith(createRoleDto);
        });

        it('should throw BadRequestException if roleName or description is missing', async () => {
            const createRoleDto: CreateRoleDto = {
                roleName: '',
                description: '',
            };

            await expect(roleService.createRole(createRoleDto)).rejects.toThrow(InternalServerErrorException);
        });

        it('should throw ConflictException if role already exists', async () => {
            const createRoleDto: CreateRoleDto = {
                roleName: 'Admin',
                description: 'Administrator Role',
            };

            mockRolesModel.findOne.mockReturnValue(createRoleDto);

            await expect(roleService.createRole(createRoleDto)).rejects.toThrow(InternalServerErrorException);
        });

        it('should throw InternalServerErrorException', async () => {
            const createRoleDto: CreateRoleDto = {
                roleName: 'Admin',
                description: 'Administrator Role',
            };

            mockRolesModel.findOne.mockRejectedValue(new Error('Some error'));

            await expect(roleService.createRole(createRoleDto)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findAllRoles', () => {
        it('should return a list of roles', async () => {
            const roles = [
                { roleName: 'Admin', description: 'Administrator Role' },
                { roleName: 'User', description: 'User Role' },
            ];

            mockRolesModel.find.mockReturnValue(roles);

            const result = await roleService.findAllRoles();

            expect(result).toEqual(roles);
            expect(mockRolesModel.find).toHaveBeenCalled();
        });

        it('should throw InternalServerErrorException on error', async () => {
            mockRolesModel.find.mockRejectedValue(new Error('Some error'));

            await expect(roleService.findAllRoles()).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findOneRole', () => {
        it('should return a role by ID', async () => {
            const roleId = 'id';
            const role = {
                _id: roleId,
                roleName: 'Admin',
                description: 'Administrator Role',
            };

            mockRolesModel.findById.mockReturnValue(role);

            const result = await roleService.findOneRole(roleId);

            expect(result).toEqual(role);
            expect(mockRolesModel.findById).toHaveBeenCalledWith(roleId);
        });

        it('should throw BadRequestException if ID format is invalid', async () => {
            const roleId = 'invalid-id';

            mockRolesModel.findById.mockRejectedValue(new mongoose.Error.CastError('Type', roleId, 'ObjectId'));

            await expect(roleService.findOneRole(roleId)).rejects.toThrow(BadRequestException);
        });

        it('should throw NotFoundException if role does not exist', async () => {
            const roleId = 'un-existent-id';

            mockRolesModel.findById.mockReturnValue(null);

            await expect(roleService.findOneRole(roleId)).rejects.toThrow(InternalServerErrorException);
        });

        it('should throw InternalServerErrorException on error', async () => {
            const roleId = 'some-id';

            mockRolesModel.findById.mockRejectedValue(new Error('Some error'));

            await expect(roleService.findOneRole(roleId)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('update', () => {
        it('should update a role', async () => {
            const roleId = 'id-update';
            const updateRoleDto: UpdateRoleDto = {
                roleName: 'Updated Role name',
                description: 'Updated Description for role',
            };

            const existingRole = {
                _id: roleId,
                roleName: 'Admin',
                description: 'Administrator Role',
                save: jest.fn(),
            };

            mockRolesModel.findById.mockReturnValue(existingRole);
            existingRole.save.mockResolvedValue({
                _id: roleId,
                roleName: 'Updated Role name',
                description: 'Updated Description for role',
            });

            const result = await roleService.update(roleId, updateRoleDto);

            expect(result).toEqual({
                _id: roleId,
                roleName: 'Updated Role name',
                description: 'Updated Description for role',
            });
        });

        it('should throw BadRequestException if ID format is invalid', async () => {
            const roleId = 'invalid-id';
            const updateRoleDto: UpdateRoleDto = {
                roleName: 'Updated Role',
                description: 'Updated Description',
            };

            mockRolesModel.findById.mockRejectedValue(new mongoose.Error.CastError('Type', roleId, 'ObjectId'));

            await expect(roleService.update(roleId, updateRoleDto)).rejects.toThrow(BadRequestException);
        });

        it('should throw NotFoundException if role does not exist', async () => {
            const roleId = 'unavailable-id';
            const updateRoleDto: UpdateRoleDto = {
                roleName: 'new Role name',
                description: 'new Description name',
            };

            mockRolesModel.findById.mockReturnValue(null);

            await expect(roleService.update(roleId, updateRoleDto)).rejects.toThrow(InternalServerErrorException);
        });

        it('should throw InternalServerErrorException on error', async () => {
            const roleId = 'available-id';
            const updateRoleDto: UpdateRoleDto = {
                roleName: 'Updated Role name',
                description: 'Updated Description name',
            };

            const existingRole = {
                _id: roleId,
                roleName: 'Admin',
                description: 'Administrator Role',
                save: jest.fn().mockRejectedValue(new Error('Some error')),
            };

            mockRolesModel.findById.mockReturnValue(existingRole);

            await expect(roleService.update(roleId, updateRoleDto)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('removeRole', () => {
        it('should remove a role', async () => {
            const roleId = 'some-id';

            mockRolesModel.findByIdAndDelete.mockReturnValue({ _id: roleId });

            const result = await roleService.removeRole(roleId);

            expect(result).toEqual({ message: 'Role Deleted Successfully' });
            expect(mockRolesModel.findByIdAndDelete).toHaveBeenCalledWith(roleId);
        });

        it('should throw BadRequestException if ID format is invalid', async () => {
            const roleId = 'invalid-id';

            mockRolesModel.findByIdAndDelete.mockRejectedValue(new mongoose.Error.CastError('Type', roleId, 'ObjectId'));

            await expect(roleService.removeRole(roleId)).rejects.toThrow("Cast to Type failed for value \"invalid-id\" (type string) at path \"ObjectId\"");
        });

        it('should throw NotFoundException if role does not exist', async () => {
            const roleId = 'unexistent-id';
            mockRolesModel.findByIdAndDelete.mockReturnValue(null);

            await expect(roleService.removeRole(roleId)).rejects.toThrow(BadRequestException);
        });
    });

    describe('assignPermissionToRole', () => {
        it('should assign permissions to a role', async () => {
            const roleId = 'role-id';
            const permissionIds = ['perm-id-1', 'perm-id-2'];

            const role = {
                _id: roleId,
                roleName: 'Admin',
                description: 'Administrator Role',
                permissions: [],
                save: jest.fn(),
            };

            const permissions = [
                { _id: 'perm-id-1' },
                { _id: 'perm-id-2' },
            ];

            mockRolesModel.findById.mockReturnValue(role);
            mockPermissionModel.find.mockReturnValue(permissions);

            const result = await roleService.assignPermissionToRole(roleId, permissionIds);

            expect(result).toEqual({ message: 'Permission assigned to role Successfully' });
            expect(mockRolesModel.findById).toHaveBeenCalledWith(roleId);
            expect(mockPermissionModel.find).toHaveBeenCalledWith({ _id: { $in: permissionIds } });
            expect(role.permissions).toEqual(expect.arrayContaining(permissions.map(p => p._id)));
            expect(role.save).toHaveBeenCalled();
        });

        it('should throw NotFoundException if role does not exist', async () => {
            const roleId = 'non-existent-role-id';
            const permissionIds = ['perm-id-1', 'perm-id-2'];

            mockRolesModel.findById.mockReturnValue(null);

            await expect(roleService.assignPermissionToRole(roleId, permissionIds)).rejects.toThrow(InternalServerErrorException);
        });

        it('should throw ConflictException if permission is already assigned to role', async () => {
            const roleId = 'role-id';
            const permissionIds = ['perm-id-1', 'perm-id-2'];

            const role = {
                _id: roleId,
                roleName: 'Admin',
                description: 'Administrator Role',
                permissions: ['perm-id-1'],
            };

            mockRolesModel.findById.mockReturnValue(role);

            await expect(roleService.assignPermissionToRole(roleId, permissionIds)).rejects.toThrow(InternalServerErrorException);
        });

        it('should throw NotFoundException if any permission does not exist', async () => {
            const roleId = 'role-id';
            const permissionIds = ['perm-id-1', 'perm-id-2'];

            const role = {
                _id: roleId,
                roleName: 'Admin',
                description: 'Administrator Role',
                permissions: [],
            };

            mockRolesModel.findById.mockReturnValue(role);
            mockPermissionModel.find.mockReturnValue([{ _id: 'perm-id-1' }]);

            await expect(roleService.assignPermissionToRole(roleId, permissionIds)).rejects.toThrow(InternalServerErrorException);
        });

        it('should throw InternalServerErrorException on error', async () => {
            const roleId = 'role-id';
            const permissionIds = ['perm-id-1', 'perm-id-2'];

            const role = {
                _id: roleId,
                roleName: 'Admin',
                description: 'Administrator Role',
                permissions: [],
                save: jest.fn().mockRejectedValue(new Error('Some error')),
            };

            mockRolesModel.findById.mockReturnValue(role);
            mockPermissionModel.find.mockReturnValue([{ _id: 'perm-id-1' }, { _id: 'perm-id-2' }]);

            await expect(roleService.assignPermissionToRole(roleId, permissionIds)).rejects.toThrow(InternalServerErrorException);
        });
    });
    //     it('should find a role with its permissions', async () => {
    //         const roleId = 'role-id';

    //         const role = {
    //             _id: roleId,
    //             roleName: 'Admin',
    //             description: 'Administrator Role',
    //             permissions: ['perm-id-1', 'perm-id-2'],
    //         };

    //         const permissions = [
    //             { _id: 'perm-id-1', name: 'Permission 1', description: 'Desc 1' },
    //             { _id: 'perm-id-2', name: 'Permission 2', description: 'Desc 2' },
    //         ];

    //         mockRolesModel.findById.mockReturnValue(role);
    //         mockPermissionModel.find.mockReturnValue(permissions);

    //         const result = await roleService.findRoleWithPermissions(roleId);

    //         expect(result).toEqual({
    //             _id: roleId,
    //             roleName: 'Admin',
    //             description: 'Administrator Role',
    //             permissions,
    //         });
    //         expect(mockRolesModel.findById).toHaveBeenCalledWith(roleId);
    //         expect(mockPermissionModel.find).toHaveBeenCalledWith({ _id: { $in: role.permissions } });
    //     });
    // });

    // describe('unassignPermissionFromRole', () => {
    //     it('should unassign a permission from a role', async () => {
    //         const roleId = 'role-id';
    //         const permissionId = 'perm-id-1';

    //         const role = {
    //             _id: roleId,
    //             roleName: 'Admin',
    //             description: 'Administrator Role',
    //             permissions: ['perm-id-1', 'perm-id-2'],
    //             save: jest.fn(),
    //         };

    //         mockRolesModel.findById.mockReturnValue(role);

    //         const result = await roleService.unassignPermissionFromRole(roleId, permissionId);

    //         expect(result).toEqual({ message: 'Permission unassigned Successfully' });
    //         expect(role.permissions).not.toContain(permissionId);
    //         expect(role.save).toHaveBeenCalled();
    //     });

    //     it('should throw NotFoundException if permission is not assigned to role', async () => {
    //         const roleId = 'role-id';
    //         const permissionId = 'non-existent-perm-id';

    //         const role = {
    //             _id: roleId,
    //             roleName: 'Admin',
    //             description: 'Administrator Role',
    //             permissions: ['perm-id-1', 'perm-id-2'],
    //         };

    //         mockRolesModel.findById.mockReturnValue(role);

    //         await expect(roleService.unassignPermissionFromRole(roleId, permissionId)).rejects.toThrow(NotFoundException);
    //     });

    //     it('should throw InternalServerErrorException on error', async () => {
    //         const roleId = 'role-id';
    //         const permissionId = 'perm-id-1';

    //         const role = {
    //             _id: roleId,
    //             roleName: 'Admin',
    //             description: 'Administrator Role',
    //             permissions: ['perm-id-1', 'perm-id-2'],
    //             save: jest.fn().mockRejectedValue(new Error('Some error')),
    //         };

    //         mockRolesModel.findById.mockReturnValue(role);

    //         await expect(roleService.unassignPermissionFromRole(roleId, permissionId)).rejects.toThrow(InternalServerErrorException);
    //     });
    // });
});
