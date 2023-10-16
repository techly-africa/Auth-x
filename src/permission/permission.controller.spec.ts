import { Test, TestingModule } from '@nestjs/testing';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { CreatePermDto } from './DTO/create-perm.dto';
import { UpdatePermDto } from './DTO/update-perm.dto';

describe('PermissionController', () => {
    let controller: PermissionController;
    let service: PermissionService;

    const mockPermissionService = {
        createPermission: jest.fn(),
        findAllPermissions: jest.fn(),
        findPermissionById: jest.fn(),
        updatePermission: jest.fn(),
        deletePermission: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PermissionController],
            providers: [
                {
                    provide: PermissionService,
                    useValue: mockPermissionService,
                },
            ],
        }).compile();

        controller = module.get<PermissionController>(PermissionController);
        service = module.get<PermissionService>(PermissionService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('createPermission', () => {
        it('should create a permission', async () => {
            const createPermDto: CreatePermDto = {
                name: 'Test Permission',
                description: 'Test Description',
            };

            const createdPermission = {
                _id: 'some-id',
                name: 'Test Permission',
                description: 'Test Description',
            };

            mockPermissionService.createPermission.mockResolvedValue(createdPermission);

            const result = await controller.createPermission(createPermDto);

            expect(result).toEqual(createdPermission);
        });
    });

    describe('findAllPermissions', () => {
        it('should return an array of permissions', async () => {
            const permissions = [
                {
                    _id: '1',
                    name: 'Permission 1',
                    description: 'Description 1',
                },
                {
                    _id: '2',
                    name: 'Permission 2',
                    description: 'Description 2',
                },
            ];

            mockPermissionService.findAllPermissions.mockResolvedValue(permissions);

            const result = await controller.findAllPermissions();

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

            mockPermissionService.findPermissionById.mockResolvedValue(permission);

            const result = await controller.findPermissionById(permissionId);

            expect(result).toEqual(permission);
        });
    });

    describe('updatePermission', () => {
        it('should update a permission', async () => {
            const permissionId = 'some-id';
            const updatedPermDto: UpdatePermDto = {
                name: 'Updated Permission',
                description: 'Updated Description',
            };

            const updatedPermission = {
                _id: permissionId,
                name: 'Updated Permission',
                description: 'Updated Description',
            };

            mockPermissionService.updatePermission.mockResolvedValue(updatedPermission);

            const result = await controller.updatePermission(permissionId, updatedPermDto);

            expect(result).toEqual(updatedPermission);
        });
    });

    describe('deletePermission', () => {
        it('should delete a permission', async () => {
            const permissionId = 'some-id';

            const deletionResult = {
                message: 'Permission Deleted Successfully',
            };

            mockPermissionService.deletePermission.mockResolvedValue(deletionResult);

            const result = await controller.deletePermission(permissionId);

            expect(result).toEqual(deletionResult);
        });
    });
});
