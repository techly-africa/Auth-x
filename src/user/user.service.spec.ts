import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { MailService } from '../mail/mail.service';
import { Role } from '../role/schemas/role.schema';
import { BadRequestException, InternalServerErrorException, NotFoundException, ConflictException } from '@nestjs/common';
import { Types } from 'mongoose';

const userModelMock = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
};

const mailerServiceMock = {
    sendUserEmail: jest.fn(),
};

const roleModelMock = {
    find: jest.fn(),
};

describe('UserService', () => {
    let userService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getModelToken(User.name),
                    useValue: userModelMock,
                },
                {
                    provide: MailService,
                    useValue: mailerServiceMock,
                },
                {
                    provide: getModelToken(Role.name),
                    useValue: roleModelMock,
                },
            ],
        }).compile();

        userService = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(userService).toBeDefined();
    });

    describe('create', () => {
        it('should create a user', async () => {
            const createUserDto = {
                name: 'Test User',
                email: 'testuser@gmail.com',
                password: 'TestPassword123',
                gender: 'male',
            };

            const mockUser = {
                ...createUserDto,
                role: 2,
                isVerified: false,
                verificationToken: 'some-token',
            };

            userModelMock.create.mockResolvedValue(mockUser);
            mailerServiceMock.sendUserEmail.mockResolvedValue(null);

            const result = await userService.create(createUserDto);

            expect(result).toEqual({
                message: 'Thank you for registering with us. An email containing a verification link has been sent to your registered email address. Please check your inbox to complete the registration process.',
            });
        });

        it('should throw a BadRequestException if required fields are missing', async () => {
            const incompleteUser = {
                name: '',
                email: 'testuser@gmail.com',
                password: 'TestPassword123',
                gender: 'male',
            };

            try {
                await userService.create(incompleteUser);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
                expect(error.message).toBe('Invalid Inputs!');
            }
        });

        it('should throw a BadRequestException for duplicate email', async () => {
            const createUserDto = {
                name: 'Test User',
                email: 'testuser@gmail.com',
                password: 'TestPassword123',
                gender: 'male',
            };

            userModelMock.create.mockRejectedValue({
                message: 'E11000 duplicate key error',
            });

            try {
                await userService.create(createUserDto);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
                expect(error.message).toBe('User with that email already exist.');
            }
        });

        it('should throw an InternalServerErrorException for other errors', async () => {
            const createUserDto = {
                name: 'Test User',
                email: 'testuser@gmail.com',
                password: 'TestPassword123',
                gender: 'male',
            };

            userModelMock.create.mockRejectedValue(new Error('Some other error'));

            try {
                await userService.create(createUserDto);
            } catch (error) {
                expect(error).toBeInstanceOf(InternalServerErrorException);
            }
        });
    });

    describe('findAll', () => {
        it('should return an array of users', async () => {
            const users = [
                { name: 'Nambaje Edwin', email: 'nambajedwin1@gmail.com' },
                { name: 'Edwin Nambaje', email: 'nambajedwin2@gmail.com' },
            ];
            userModelMock.find.mockResolvedValue(users);

            const result = await userService.findAll();

            expect(result).toEqual(users);
        });

        it('should throw an InternalServerErrorException if an error occurs', async () => {
            const errorMessage = 'An error occurred while fetching users';
            userModelMock.find.mockRejectedValue(new Error(errorMessage));

            try {
                await userService.findAll();
            } catch (error) {
                expect(error).toBeInstanceOf(InternalServerErrorException);
                expect(error.message).toBe('Internal Server Error');
            }
        });
    });

    describe('findOne', () => {
        it('should return a user by ID', async () => {
            const userId = 'some-id';
            const user = { _id: userId, name: 'Nambaje Edwin', email: 'nambajedwin@gmail.com' };

            userModelMock.findById.mockResolvedValue(user);

            const result = await userService.findOne(userId);

            expect(result).toEqual(user);
        });

        it('should throw a BadRequestException if user is not found', async () => {
            const userId = 'non-existing-id';
            userModelMock.findById.mockResolvedValue(null);

            try {
                await userService.findOne(userId);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
                expect(error.message).toBe('User Not Found');
            }
        });

        it('should throw an InternalServerErrorException for other errors', async () => {
            const userId = 'some-id';
            userModelMock.findById.mockRejectedValue(new Error('Some other error'));

            try {
                await userService.findOne(userId);
            } catch (error) {
                expect(error).toBeInstanceOf(InternalServerErrorException);
            }
        });
    });

    describe('update', () => {
        it('should update a user', async () => {
            const userId = 'some-id';
            const updateUserDto = { name: 'Updated Name' };
            const updatedUser = { _id: userId, ...updateUserDto };
            userModelMock.findByIdAndUpdate.mockResolvedValue(updatedUser);
            const result = await userService.update(userId, updateUserDto);
            expect(result).toEqual(updatedUser);
        });

        it('should throw BadRequestException if user is not found', async () => {
            const userId = 'non-existing-id';
            const updateUserDto = { name: 'Updated Name' };
            userModelMock.findByIdAndUpdate.mockResolvedValue(null);
            try {
                await userService.update(userId, updateUserDto);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
                expect(error.message).toBe('User Not Found');
            }
        });
    });

    describe('remove', () => {
        it('should remove a user', async () => {
            const userId = 'some-id';
            const deletedUser = { _id: userId, name: 'John Doe', email: 'john.doe@example.com' };

            userModelMock.findByIdAndDelete.mockResolvedValue(deletedUser);

            const result = await userService.remove(userId);

            expect(result).toEqual(deletedUser);
        });
    });

    describe('assignRolesToUser', () => {
        it('should assign roles to a user', async () => {
            const userId = 'some-id';
            const roleIds = ['role-id-1', 'role-id-2'];
            const user = {
                _id: userId,
                roles: [],
                save: jest.fn(),
            };

            roleModelMock.find.mockResolvedValue([
                { _id: 'role-id-1', roleName: 'Role 1', description: 'Description 1' },
                { _id: 'role-id-2', roleName: 'Role 2', description: 'Description 2' },
            ]);

            userModelMock.findById.mockResolvedValue(user);

            const result = await userService.assignRolesToUser(userId, roleIds);

            expect(result).toEqual(user);
            expect(user.roles).toEqual(['role-id-1', 'role-id-2']);
            expect(user.save).toHaveBeenCalled();
        });

        it('should throw NotFoundException if user is not found', async () => {
            const userId = 'non-existing-id';
            const roleIds = ['role-id-1', 'role-id-2'];

            userModelMock.findById.mockResolvedValue(null);

            try {
                await userService.assignRolesToUser(userId, roleIds);
            } catch (error) {
                expect(error).toBeInstanceOf(InternalServerErrorException);
            }
        });

        it('should throw ConflictException if user already has a role', async () => {
            const userId = 'some-id';
            const roleIds = ['role-id-1', 'role-id-2'];

            const user = {
                _id: userId,
                roles: ['role-id-2'],
            };

            userModelMock.findById.mockResolvedValue(user);

            try {
                await userService.assignRolesToUser(userId, roleIds);
            } catch (error) {
                expect(error).toBeInstanceOf(InternalServerErrorException);
            }
        });

        it('should throw NotFoundException if a role does not exist', async () => {
            const userId = 'some-id';
            const roleIds = ['role-id-1', 'role-id-2'];

            userModelMock.findById.mockResolvedValue({ _id: userId, roles: [] });

            roleModelMock.find.mockResolvedValue([]);

            try {
                await userService.assignRolesToUser(userId, roleIds);
            } catch (error) {
                expect(error).toBeInstanceOf(InternalServerErrorException);
            }
        });
    });

    describe('unassignUserRole', () => {
        it('should throw BadRequestException if user does not exist', async () => {
            const userId = 'non-existing-id';
            const roleId = 'role-id-1';

            userModelMock.findById.mockResolvedValue(null);

            try {
                await userService.unassignUserRole(userId, roleId);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
                expect(error.message).toBe('User does not exist');
            }
        });
    });
});
