import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User, userSchema } from './schemas/user.schema';
import { Connection, Model, connect } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { user } from './stubs/create-user.dto.stub';
import { BadRequestException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let userModel: Model<User>

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create()
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection
    userModel = mongoConnection.model(User.name, userSchema)
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, {
        provide: getModelToken(User.name), useValue: userModel
      }],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase()
    await mongoConnection.close()
    await mongod.stop()
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({})
    }
  })

  it('should be defined', async () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const userCreated = await controller.create(user());
    expect(userCreated.name).toBe('test user');
    expect(userCreated.email).toBe('testuser1@gmail.com');
  })
  it('should throw an error if a user already exist', async () => {
    const userCreated = await controller.create(user());
    await expect(controller.create(user())).rejects.toThrow(BadRequestException)
  })

  it('should throw an error if a user already exist', async () => {
    const userCreated = await controller.create(user());
    await expect(controller.create(user())).rejects.toThrow(BadRequestException)
  })

  it('should get all users', async () => {
    await controller.create(user());
    const usersFound = await controller.findAll();
    expect(usersFound).toBeInstanceOf(Array);
    expect(usersFound).toHaveLength(1);
  })

  it('should get a specific user', async () => {
    const userCreated = await controller.create(user());
    const userFound = await controller.findOne((userCreated._id).toString());
    expect(userFound.name).toBe('test user');
    expect(userFound.email).toBe('testuser1@gmail.com');
  })

  it('should update a specific user', async () => {
    const userCreated = await controller.create(user());
    const userUpdated = await controller.update((userCreated._id).toString(), {
      name: 'test user updated'
    });
    expect(userUpdated.name).toBe('test user updated');
  })

  it('should delete a specific user', async () => {
    const userCreated = await controller.create(user());
    const userDeleted = await controller.remove((userCreated._id).toString());
    expect(userDeleted.name).toBe('test user');
    expect(userDeleted.email).toBe('testuser1@gmail.com');
  })
});
