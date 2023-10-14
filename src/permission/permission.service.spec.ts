import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { PermissionService } from './permission.service';
import {
    BadRequestException,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { CreatePermDto } from './DTO/create-perm.dto';
import { UpdatePermDto } from './DTO/update-perm.dto';
import mongoose from 'mongoose';
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
                name: 'Test Permission',
                description: 'Test Description',
            };

            mockPermissionModel.findOne.mockResolvedValue(null);
            mockPermissionModel.create.mockResolvedValue(createPermDto);

            const result = await permissionService.createPermission(createPermDto);

            expect(result).toEqual(createPermDto);
        });

        it('should throw BadRequestException if inputs are invalid', async () => {
            const createPermDto: CreatePermDto = {
                name: '',
                description: 'Test Description',
            };

            await expect(permissionService.createPermission(createPermDto)).rejects.toThrow(BadRequestException);
        });

        it('should throw ConflictException if permission already exists', async () => {
            const createPermDto: CreatePermDto = {
                name: 'Test Permission',
                description: 'Test Description',
            };

            mockPermissionModel.findOne.mockResolvedValue(createPermDto);

            await expect(permissionService.createPermission(createPermDto)).rejects.toThrow(InternalServerErrorException);
        });

        it('should throw InternalServerErrorException on error', async () => {
            const createPermDto: CreatePermDto = {
                name: 'Test Permission',
                description: 'Test Description',
            };

            mockPermissionModel.findOne.mockRejectedValue(new Error('Some error'));

            await expect(permissionService.createPermission(createPermDto)).rejects.toThrow(InternalServerErrorException);
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
            const permissionId = 'non-existent-id';

            mockPermissionModel.findById.mockResolvedValue(null);

            await expect(permissionService.findPermissionById(permissionId)).rejects.toThrow(InternalServerErrorException);
        });

        it('should throw BadRequestException for invalid ID format', async () => {
            const permissionId = 'invalid-id-format';
            mockPermissionModel.findById.mockRejectedValue(new Error('CastError'));
            await expect(permissionService.findPermissionById(permissionId)).rejects.toThrow(InternalServerErrorException);
        });

        it('should throw InternalServerErrorException on error', async () => {
            const permissionId = 'some-id';

            mockPermissionModel.findById.mockRejectedValue(new Error('Some error'));

            await expect(permissionService.findPermissionById(permissionId)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('updatePermission', () => {
        it('should update a permission', async () => {
            const permissionId = 'some-id';
            const updatedPermDto: UpdatePermDto = {
                name: 'Updated Permission',
                description: 'Updated Description',
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
                name: 'Updated Permission',
                description: 'Updated Description',
            });

            const result = await permissionService.updatePermission(permissionId, updatedPermDto);

            expect(result).toEqual({
                _id: permissionId,
                name: 'Updated Permission',
                description: 'Updated Description',
            });
        });


        it('should throw NotFoundException if permission does not exist', async () => {
            const permissionId = 'non-existent-id';
            const updatedPermDto: UpdatePermDto = {
                name: 'Updated Permission',
                description: 'Updated Description',
            };

            mockPermissionModel.findById.mockResolvedValue(null);

            await expect(permissionService.updatePermission(permissionId, updatedPermDto)).rejects.toThrow(InternalServerErrorException);
        });

        it('should throw BadRequestException for invalid ID format', async () => {
            const permissionId = 'invalid-id-format';
            const updatedPermDto: UpdatePermDto = {
                name: 'Updated Permission',
                description: 'Updated Description',
            };
            mockPermissionModel.findById.mockRejectedValue(new Error('CastError'));
            await expect(permissionService.updatePermission(permissionId, updatedPermDto)).rejects.toThrow(InternalServerErrorException);
        });

        it('should throw InternalServerErrorException on error', async () => {
            const permissionId = 'some-id';
            const updatedPermDto: UpdatePermDto = {
                name: 'Updated Permission',
                description: 'Updated Description',
            };
            mockPermissionModel.findById.mockRejectedValue(new Error('Some error'));
            await expect(permissionService.updatePermission(permissionId, updatedPermDto)).rejects.toThrow(InternalServerErrorException);
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
            await expect(permissionService.deletePermission(permissionId)).rejects.toThrow(InternalServerErrorException);
        });

        it('should throw BadRequestException for invalid ID format', async () => {
            const permissionId = 'invalid-id-format';
            mockPermissionModel.findById.mockRejectedValue(new Error('CastError'));
            await expect(permissionService.deletePermission(permissionId)).rejects.toThrow(InternalServerErrorException);
        });

        it('should throw InternalServerErrorException on error', async () => {
            const permissionId = 'some-id';
            mockPermissionModel.findById.mockRejectedValue(new Error('Some error'));
            await expect(permissionService.deletePermission(permissionId)).rejects.toThrow(InternalServerErrorException);
        });
    });
});
