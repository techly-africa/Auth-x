import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './schemas/role.schema';
import { BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';

describe('RoleService', () => {
    let roleService: RoleService;
    let roleModel: Model<Role>;
    const roleModelMock = {
        find: jest.fn(),
        findOne: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RoleService,
                {
                    provide: getModelToken(Role.name),
                    useValue: roleModelMock,
                },
            ],
        }).compile();

        roleService = module.get<RoleService>(RoleService);
        roleModel = module.get<Model<Role>>(getModelToken(Role.name));
    });

    describe('createRole', () => {
        it('should create a role', async () => {
            const createRoleDto = { roleName: 'Admin', description: 'Administrator' };
            roleModelMock.findOne.mockResolvedValue(null);
            roleModelMock.create.mockResolvedValue(createRoleDto);
            const result = await roleService.createRole(createRoleDto);
            expect(result).toEqual({ message: 'Role Created Successfully' });
        });

        it('should throw a BadRequestException if inputs are invalid', async () => {
            const createRoleDto = { roleName: 'admin', description: '' };
            try {
                await roleService.createRole(createRoleDto);
            } catch (error) {
                expect(error).toBeInstanceOf(InternalServerErrorException);
                expect(error.message).toBe(
                    'Invalid Inputs!',
                );
            }
        });

        it('should throw a BadRequestException if role already exists', async () => {
            const createRoleDto = { roleName: 'Admin', description: 'Administrator' };
            roleModelMock.findOne.mockResolvedValue(createRoleDto);
            await expect(roleService.createRole(createRoleDto)).rejects.toThrow(InternalServerErrorException);
        });

        it('should throw an InternalServerErrorException if an error occurs during creation', async () => {
            const createRoleDto = { roleName: 'Admin', description: 'Administrator' };
            roleModelMock.findOne.mockRejectedValue(new Error('Some error'));
            await expect(roleService.createRole(createRoleDto)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findAllRoles', () => {
        it('should return an array of roles', async () => {
            const roles = [{ roleName: 'Admin', description: 'Administrator' }];
            roleModelMock.find.mockResolvedValue(roles);
            const result = await roleService.findAllRoles();
            expect(result).toEqual(roles);
        });

        it('should throw an InternalServerErrorException if an error occurs', async () => {
            roleModelMock.find.mockRejectedValue(new Error('Some error'));
            await expect(roleService.findAllRoles()).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findOneRole', () => {
        it('should find a role by ID', async () => {
            const roleId = 'validRoleId';
            const roleData = { roleName: 'Admin', description: 'Administrator' };

            roleModelMock.findById.mockResolvedValue(roleData);

            const result = await roleService.findOneRole(roleId);

            expect(result).toEqual(roleData);
        });

        it('should throw a BadRequestException for an invalid role ID format', async () => {
            const roleId = 'invalidIdFormat';
            roleModelMock.findById.mockRejectedValue(new Error('CastError'));
            await expect(roleService.findOneRole(roleId)).rejects.toThrow(InternalServerErrorException);
        });

        it('should throw a NotFoundException for a non-existing role', async () => {
            const roleId = 'nonExistingRoleId';
            roleModelMock.findById.mockResolvedValue(null);
            await expect(roleService.findOneRole(roleId)).rejects.toThrow(InternalServerErrorException);
        });

        it('should throw an InternalServerErrorException if an error occurs', async () => {
            const roleId = 'validRoleId';

            roleModelMock.findById.mockRejectedValue(new Error('Some error'));

            await expect(roleService.findOneRole(roleId)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('update', () => {
        it('should update a role', async () => {
            const roleId = 'validRoleId';
            const updateRoleDto = { roleName: 'NewRole', description: 'New Description' };
            const roleData = { _id: roleId, ...updateRoleDto };
            roleModelMock.findById.mockResolvedValue(roleData);
            roleModelMock.findByIdAndUpdate.mockResolvedValue(roleData);
            const result = await roleService.update(roleId, updateRoleDto);
            expect(result).toEqual(roleData);
        });

        it('should throw a BadRequestException if the role does not exist', async () => {
            const roleId = 'nonExistingRoleId';
            const updateRoleDto = { roleName: 'NewRole', description: 'New Description' };
            roleModelMock.findById.mockResolvedValue(null);
            await expect(roleService.update(roleId, updateRoleDto)).rejects.toThrow(InternalServerErrorException);
        });

        it('should throw a BadRequestException if the role name is empty', async () => {
            const roleId = 'validRoleId';
            const updateRoleDto = { roleName: '', description: 'New Description' };
            await expect(roleService.update(roleId, updateRoleDto)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('removeRole', () => {
        it('should remove a role', async () => {
            const roleId = 'validRoleId';
            roleModelMock.findByIdAndDelete.mockResolvedValue({ _id: roleId });
            const result = await roleService.removeRole(roleId);
            expect(result).toEqual({ message: 'Role Deleted Successfully' });
        });

        it('should throw a BadRequestException if the role does not exist', async () => {
            const roleId = 'nonExistingRoleId';
            roleModelMock.findByIdAndDelete.mockResolvedValue(null);
            await expect(roleService.removeRole(roleId)).rejects.toThrow(BadRequestException);
        });
    });

});
