import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

const mockRoleService = {
    createRole: jest.fn(),
    findAllRoles: jest.fn(),
    findOneRole: jest.fn(),
    update: jest.fn(),
    removeRole: jest.fn(),
    assignPermissionToRole: jest.fn(),
    findRoleWithPermissions: jest.fn(),
    unassignPermissionFromRole: jest.fn(),
};

describe('RoleController', () => {
    let roleController: RoleController;
    let roleService: RoleService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [RoleController],
            providers: [RoleService],
        })
            .overrideProvider(RoleService)
            .useValue(mockRoleService)
            .compile();

        roleController = module.get<RoleController>(RoleController);
        roleService = module.get<RoleService>(RoleService);
    });

    describe('CreateRole', () => {
        it('should create a role', async () => {
            const createRoleDto: CreateRoleDto = {
                roleName: 'Admin',
                description: 'Administrator Role',
            };

            const expectedResult = { message: 'Role Created Successfully' };

            mockRoleService.createRole.mockResolvedValue(expectedResult);

            const result = await roleController.CreateRole(createRoleDto);

            expect(result).toBe(expectedResult);
            expect(mockRoleService.createRole).toHaveBeenCalledWith(createRoleDto);
        });
    });
    describe('findAll', () => {
        it('should return a list of roles', async () => {
            const roles = [
                { roleName: 'Admin', description: 'Administrator Role' },
                { roleName: 'User', description: 'User Role' },
            ];

            mockRoleService.findAllRoles.mockResolvedValue(roles);

            const result = await roleController.findAll();

            expect(result).toEqual(roles);
            expect(mockRoleService.findAllRoles).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return a role by ID', async () => {
            const roleId = 'some-id';
            const role = {
                _id: roleId,
                roleName: 'Admin',
                description: 'Administrator Role',
            };

            mockRoleService.findOneRole.mockResolvedValue(role);

            const result = await roleController.findOne(roleId);

            expect(result).toEqual(role);
            expect(mockRoleService.findOneRole).toHaveBeenCalledWith(roleId);
        });
    });

    describe('update', () => {
        it('should update a role', async () => {
            const roleId = 'some-id';
            const updateRoleDto: UpdateRoleDto = {
                roleName: 'Updated Role',
                description: 'Updated Description',
            };

            const updatedRole = {
                _id: roleId,
                roleName: 'Updated Role',
                description: 'Updated Description',
            };

            mockRoleService.update.mockResolvedValue(updatedRole);

            const result = await roleController.update(roleId, updateRoleDto);

            expect(result).toEqual(updatedRole);
            expect(mockRoleService.update).toHaveBeenCalledWith(roleId, updateRoleDto);
        });
    });

    describe('remove', () => {
        it('should remove a role', async () => {
            const roleId = 'some-id';

            const expectedResult = { message: 'Role Deleted Successfully' };

            mockRoleService.removeRole.mockResolvedValue(expectedResult);

            const result = await roleController.remove(roleId);

            expect(result).toEqual(expectedResult);
            expect(mockRoleService.removeRole).toHaveBeenCalledWith(roleId);
        });
    });

    describe('AssignPermissionsToRoles', () => {
        it('should assign permissions to a role', async () => {
            const roleId = 'role-id';
            const permissionIds = ['perm-id-1', 'perm-id-2'];

            const expectedResult = { message: 'Permission assigned to role Successfully' };

            mockRoleService.assignPermissionToRole.mockResolvedValue(expectedResult);

            const result = await roleController.assignPermissionsToRoles(roleId, { permissionIds });

            expect(result).toEqual(expectedResult);
            expect(mockRoleService.assignPermissionToRole).toHaveBeenCalledWith(roleId, permissionIds);
        });
    });

    describe('FindRolePermissions', () => {
        it('should find role permissions', async () => {
            const roleId = 'role-id';
            const permissions = [{ name: 'Permission 1', description: 'Description 1' }];

            mockRoleService.findRoleWithPermissions.mockResolvedValue(permissions);

            const result = await roleController.findRolePermissions(roleId);

            expect(result).toEqual(permissions);
            expect(mockRoleService.findRoleWithPermissions).toHaveBeenCalledWith(roleId);
        });
    });

    describe('UnassignPermission', () => {
        it('should unassign a permission from a role', async () => {
            const roleId = 'role-id';
            const permId = 'perm-id';

            const expectedResult = { message: 'Permission unassigned Successfully' };

            mockRoleService.unassignPermissionFromRole.mockResolvedValue(expectedResult);

            const result = await roleController.unassignPermission(roleId, permId);

            expect(result).toEqual(expectedResult);
            expect(mockRoleService.unassignPermissionFromRole).toHaveBeenCalledWith(roleId, permId);
        });
    });
});
