import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from './schemas/user.schema';

const userServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    delete: jest.fn(),
    displayDeletedUsers: jest.fn(),
    disable2FA: jest.fn(),
    enable2FA: jest.fn(),
    restoreDeletedUsers: jest.fn
};

describe('UserController', () => {
    let userController: UserController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [UserService, JwtService],
        })
            .overrideProvider(UserService)
            .useValue(userServiceMock)
            .compile();

        userController = module.get<UserController>(UserController);
    });

    describe('create', () => {
        it('should create a user', async () => {
            const createUserDto = {
                name: 'Test User',
                email: 'testuser@gmail.com',
                password: 'TestPassword123',
                gender: 'male',
            };
            const expectedResult = { message: 'User created successfully' };

            userServiceMock.create.mockResolvedValue(expectedResult);

            const result = await userController.create(createUserDto);

            expect(result).toBe(expectedResult);
        });
    });

    describe('findAll', () => {
        it('should get all users', async () => {
            const expectedResult = [{ name: 'Nambaje Edwin', email: 'nambajedwin1@gmail.com' },
            { name: 'Edwin Nambaje', email: 'nambajedwin2@gmail.com' },]

            userServiceMock.findAll.mockResolvedValue(expectedResult);

            const result = await userController.findAll();

            expect(result).toBe(expectedResult);
        });
    });

    describe('findOne', () => {
        it('should get a specific user', async () => {
            const userId = 'id-find';
            const user = { _id: userId, name: 'Nambaje Edwin', email: 'nambajedwin@gmail.com' };
            userServiceMock.findOne.mockResolvedValue(user);
            const result = await userController.findOne(userId);
            expect(result).toBe(user);
        });
    });

    describe('update', () => {
        it('should update a user', async () => {
            const userId = 'some-id'; // provide a valid user ID
            const updateUserDto = { name: 'Updated Name' };
            const updatedUser = { _id: userId, ...updateUserDto };

            userServiceMock.update.mockResolvedValue(updatedUser);

            const result = await userController.update(userId, updateUserDto);

            expect(result).toBe(updatedUser);
        });
    });

    describe('remove', () => {
        it('should remove a user', async () => {
            const userId = 'id-remove';
            const deletedUser = { _id: userId, name: 'John Doe', email: 'john.doe@example.com' };
            userServiceMock.remove.mockResolvedValue(deletedUser);
            const result = await userController.remove(userId);

            expect(result).toBe(deletedUser);
        });
    });
    describe('deleteUser', () => {
        it('should suspend a user', async () => {
            const userId = 'someUserId';
            const expectedResult = { message: 'User Deleted Successfully !' };

            userServiceMock.delete.mockResolvedValue(expectedResult);

            const result = await userController.deleteUser(userId);

            expect(result).toEqual(expectedResult);
            expect(userController.deleteUser).toHaveBeenCalledWith(userId);
        });
    });

    describe('findDeletedUsers', () => {
        it('should return an array of deleted users', async () => {
            const expectedResult: User[] = [/* list of deleted users */];

            userServiceMock.displayDeletedUsers.mockResolvedValue(expectedResult);

            const result = await userController.findDeletedUsers();

            expect(result).toEqual(expectedResult);
        });
    });

    describe('restoreUser', () => {
        it('should restore a suspended user', async () => {
            const userId = 'someUserId';
            const expectedResult: User = { /* restored user data */ };

            userServiceMock.restoreDeletedUsers.mockResolvedValue(expectedResult);

            const result = await userController.restoreUser(userId);

            expect(result).toEqual(expectedResult);
            expect(userServiceMock.restoreDeletedUsers).toHaveBeenCalledWith(userId);
        });
    });

    describe('enable2FA', () => {
        it('should enable 2FA for a user', async () => {
            const request = { user: { _id: 'someUserId' } };
            const expectedResult: User = { /* updated user data */ };

            userServiceMock.enable2FA.mockResolvedValue(expectedResult);

            const result = await userController.enable2FA(request);

            expect(result).toEqual(expectedResult);
            expect(userServiceMock.enable2FA).toHaveBeenCalledWith(request);
        });
    });

    describe('disable2FA', () => {
        it('should disable 2FA for a user', async () => {
            const request = { user: { _id: 'someUserId' } };
            const expectedResult: User = { /* updated user data */ };

            userServiceMock.disable2FA.mockResolvedValue(expectedResult);

            const result = await userController.disable2FA(request);

            expect(result).toEqual(expectedResult);
            expect(userServiceMock.disable2FA).toHaveBeenCalledWith(request);
        });
    });
});
