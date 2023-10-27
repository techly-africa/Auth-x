import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { PermissionService } from './permission.service';
import {
    BadRequestException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { CreatePermDto } from './DTO/create-perm.dto';
import { UpdatePermDto } from './DTO/update-perm.dto';
import { Permission } from './schemas/permission.schema';

describe('PermissionService', () => {
    let permissionService: PermissionService;

    const mockPermissionModel = {
        find: jest.fn(),
        findOne: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        findByIdAndDelete: jest.fn(),
        save: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PermissionService,
                {
                    provide: getModelToken(Permission.name),
                    useValue: mockPermissionModel,
                },
            ],
        }).compile();

        permissionService = module.get<PermissionService>(PermissionService);
    });

    describe('createPermission', () => {
        it('should create a new permission', async () => {
            const createPermDto: CreatePermDto = {
                name: 'new Permission',
                description: 'new Description',
            };

            mockPermissionModel.findOne.mockResolvedValue(null);
            mockPermissionModel.create.mockResolvedValue(createPermDto);

            const result = await permissionService.createPermission(createPermDto);

            expect(result).toEqual(createPermDto);
        });

        it('should throw BadRequestException if inputs are invalid', async () => {
            const createPermDto: CreatePermDto = {
                name: '',
                description: 'bad request description',
            };

            await expect(
                permissionService.createPermission(createPermDto),
            ).rejects.toThrow(BadRequestException);
        });

        it('should throw ConflictException if permission already exists', async () => {
            const createPermDto: CreatePermDto = {
                name: 'Test Permission',
                description: 'Test Description',
            };

            mockPermissionModel.findOne.mockResolvedValue(createPermDto);

            await expect(
                permissionService.createPermission(createPermDto),
            ).rejects.toThrow(InternalServerErrorException);
        });

        it('should throw InternalServerErrorException on error', async () => {
            const createPermDto: CreatePermDto = {
                name: 'Test Permission',
                description: 'Test Description',
            };

            mockPermissionModel.findOne.mockRejectedValue(new Error('Some error'));

            await expect(
                permissionService.createPermission(createPermDto),
            ).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findAllPermissions', () => {
        it('should return an array of permissions', async () => {
            const permissions = [
                {
                    name: 'Permission 1',
                    description: 'Description 1',
                },
                {
                    name: 'Permission 2',
                    description: 'Description 2',
                },
            ];

            mockPermissionModel.find.mockResolvedValue(permissions);

            const result = await permissionService.findAllPermissions();

            expect(result).toEqual(permissions);
        });
    });

    describe('findPermissionById', () => {
        it('should return a permission by ID', async () => {
            const permissionId = 'some-id';
            const permission = {
                _id: permissionId,
                name: 'Test Permission',
                description: 'Test Description',
            };

            mockPermissionModel.findById.mockResolvedValue(permission);

            const result = await permissionService.findPermissionById(permissionId);

            expect(result).toEqual(permission);
        });

        it('should throw NotFoundException if permission does not exist', async () => {
            const permissionId = 'unexistent-id';

            mockPermissionModel.findById.mockResolvedValue(null);

            await expect(
                permissionService.findPermissionById(permissionId),
            ).rejects.toThrow(InternalServerErrorException);
        });

        it('should throw BadRequestException for invalid ID format', async () => {
            const permissionId = 'invalid-id';
            mockPermissionModel.findById.mockRejectedValue(new Error('CastError'));
            await expect(
                permissionService.findPermissionById(permissionId),
            ).rejects.toThrow(InternalServerErrorException);
        });

        it('should throw InternalServerErrorException on error', async () => {
            const permissionId = 'valid-id';

            mockPermissionModel.findById.mockRejectedValue(new Error('Some error'));

            await expect(
                permissionService.findPermissionById(permissionId),
            ).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('updatePermission', () => {
        it('should update a permission', async () => {
            const permissionId = 'updated-id';
            const updatedPermDto: UpdatePermDto = {
                name: 'Get permission',
                description: 'get all permission',
            };
            const existingPermission = {
                _id: permissionId,
                name: 'Test Permission',
                description: 'Test Description',
                save: jest.fn(),
            };

            mockPermissionModel.findById.mockResolvedValue(existingPermission);
            existingPermission.save.mockResolvedValue({
                _id: permissionId,
                name: 'Get permission',
                description: 'get all permission',
            });

            const result = await permissionService.updatePermission(
                permissionId,
                updatedPermDto,
            );

            expect(result).toEqual({
                _id: permissionId,
                name: 'Get permission',
                description: 'get all permission',
            });
        });

        it('should throw NotFoundException if permission does not exist', async () => {
            const permissionId = 'unexistent-id';
            const updatedPermDto: UpdatePermDto = {
                name: 'Updated Permission name',
                description: 'Updated Description name',
            };

            mockPermissionModel.findById.mockResolvedValue(null);

            await expect(
                permissionService.updatePermission(permissionId, updatedPermDto),
            ).rejects.toThrow(InternalServerErrorException);
        });

        it('should throw BadRequestException for invalid ID format', async () => {
            const permissionId = 'invalid-id-format';
            const updatedPermDto: UpdatePermDto = {
                name: 'Permission',
                description: ' Description of permission',
            };
            mockPermissionModel.findById.mockRejectedValue(new Error('CastError'));
            await expect(
                permissionService.updatePermission(permissionId, updatedPermDto),
            ).rejects.toThrow(InternalServerErrorException);
        });

        it('should throw InternalServerErrorException on error', async () => {
            const permissionId = 'some-id';
            const updatedPermDto: UpdatePermDto = {
                name: 'Updated Permission',
                description: 'Updated Description',
            };
            mockPermissionModel.findById.mockRejectedValue(new Error('Some error'));
            await expect(
                permissionService.updatePermission(permissionId, updatedPermDto),
            ).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('deletePermission', () => {
        it('should delete a permission', async () => {
            const permissionId = 'some-id';
            const existingPermission = {
                _id: permissionId,
                name: 'Test Permission',
                description: 'Test Description',
            };
            mockPermissionModel.findById.mockResolvedValue(existingPermission);
            const result = await permissionService.deletePermission(permissionId);
            expect(result).toEqual({ message: 'Permission Deleted Successfully' });
        });

        it('should throw NotFoundException if permission does not exist', async () => {
            const permissionId = 'non-existent-id';
            mockPermissionModel.findById.mockResolvedValue(null);
            await expect(
                permissionService.deletePermission(permissionId),
            ).rejects.toThrow(InternalServerErrorException);
        });

        it('should throw BadRequestException for invalid ID format', async () => {
            const permissionId = 'invalid-id-format';
            mockPermissionModel.findById.mockRejectedValue(new Error('CastError'));
            await expect(
                permissionService.deletePermission(permissionId),
            ).rejects.toThrow(InternalServerErrorException);
        });

        it('should throw InternalServerErrorException on error', async () => {
            const permissionId = 'some-id';
            mockPermissionModel.findById.mockRejectedValue(new Error('Some error'));
            await expect(
                permissionService.deletePermission(permissionId),
            ).rejects.toThrow(InternalServerErrorException);
        });
    });
    describe('temporarilySuspendPermission', () => {
        it('should temporarily suspend a permission', async () => {
            const permId = 'perm-id';

            const permission = {
                _id: permId,
                name: 'Some Permission',
                isDeleted: false,
                save: jest.fn(),
            };

            mockPermissionModel.findById.mockReturnValue(permission);

            const result = await permissionService.temporarilySuspendPermission(permId);

            expect(result).toEqual({ message: 'Permission Deleted Temporarily' });
            expect(permission.isDeleted).toBe(true);
            expect(permission.save).toHaveBeenCalled();
        });

        it('should throw BadRequestException if permission does not exist', async () => {
            const permId = 'non-existent-perm-id';

            mockPermissionModel.findById.mockReturnValue(null);

            await expect(permissionService.temporarilySuspendPermission(permId)).rejects.toThrow(BadRequestException);
        });
    });

    describe('displaySuspendendPermissions', () => {
        it('should return a list of suspended permissions', async () => {
            const suspendedPermissions = [
                { name: 'Permission 1', isDeleted: true },
                { name: 'Permission 2', isDeleted: true },
            ];

            mockPermissionModel.find.mockReturnValue(suspendedPermissions);

            const result = await permissionService.displaySuspendendPermissions();

            expect(result).toEqual(suspendedPermissions);
            expect(mockPermissionModel.find).toHaveBeenCalledWith({ isDeleted: true });
        });
    });

    describe('restoreSuspendedPermission', () => {
        it('should restore a suspended permission', async () => {
            const permId = 'perm-id';

            const permission = {
                _id: permId,
                name: 'Some Permission',
                isDeleted: true,
                save: jest.fn(),
            };

            mockPermissionModel.findById.mockReturnValue(permission);

            const result = await permissionService.restoreSuspendedPermission(permId);

            expect(result).toEqual(permission);
            expect(permission.isDeleted).toBe(false);
            expect(permission.save).toHaveBeenCalled();
        });

        it('should throw NotFoundException if permission does not exist', async () => {
            const permId = 'non-existent-perm-id';

            mockPermissionModel.findById.mockReturnValue(null);

            await expect(permissionService.restoreSuspendedPermission(permId)).rejects.toThrow(NotFoundException);
        });

        it('should throw BadRequestException if permission is not suspended', async () => {
            const permId = 'perm-id';

            const permission = {
                _id: permId,
                name: 'Some Permission',
                isDeleted: false,
            };

            mockPermissionModel.findById.mockReturnValue(permission);

            await expect(permissionService.restoreSuspendedPermission(permId)).rejects.toThrow(BadRequestException);
        });
    });
});
