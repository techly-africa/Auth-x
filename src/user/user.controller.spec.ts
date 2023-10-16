import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const userServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
};

describe('UserController', () => {
    let userController: UserController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [UserService],
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
            const userId = 'some-id';
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
            const userId = 'some-id';
            const deletedUser = { _id: userId, name: 'John Doe', email: 'john.doe@example.com' };
            userServiceMock.remove.mockResolvedValue(deletedUser);
            const result = await userController.remove(userId);

            expect(result).toBe(deletedUser);
        });
    });
});
