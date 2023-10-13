import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from 'src/mail/mail.service';
import { Role } from 'src/role/schemas/role.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private mailerServices: MailService,
    @InjectModel(Role.name)
    private roleModel: Model<Role>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<{ message: string }> {
    const { name, email, password, gender } = createUserDto;
    if (!name || !email || !password || !gender) {
      throw new BadRequestException('Invalid Inputs!');
    }
    try {
      const salt = 10;
      const hash = await bcrypt.hash(createUserDto.password, salt);
      createUserDto.password = hash;

      const verificationToken = uuidv4();

      const newUser = await this.userModel.create({
        ...createUserDto,
        role: 2,
        isVerified: false,
        verificationToken,
      });

      await this.mailerServices.sendUserEmail(
        createUserDto.name,
        verificationToken,
        createUserDto.email,
      );

      return {
        message:
          'Thank you for registering with us. An email containing a verification link has been sent to your registered email address. Please check your inbox to complete the registration process.',
      };
    } catch (error) {
      if (error.message.includes('E11000 duplicate key error')) {
        return Promise.reject(
          new BadRequestException('User with that email already exist.'),
        );
      }
      return Promise.reject(new InternalServerErrorException());
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const users = await this.userModel.find();

      return users;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const userFound = await this.userModel.findById(id);
      if (!userFound) {
        throw new BadRequestException('Not Found');
      }
      return userFound;
    } catch (error) {
      if (error.message.includes('Not Found')) {
        throw new BadRequestException('User Not Found');
      }
      throw new InternalServerErrorException();
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      if (updateUserDto.hasOwnProperty('password')) {
        const salt = 10;
        const hash = await bcrypt.hash(updateUserDto.password, salt);
        updateUserDto.password = hash;
      }
      const updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        updateUserDto,
        { returnDocument: 'after' },
      );
      if (!updatedUser) {
        throw new BadRequestException('Not Found');
      }
      return updatedUser;
    } catch (error) {
      if (error.message.includes('Not Found')) {
        throw new BadRequestException('User Not Found');
      }
      throw new InternalServerErrorException();
    }
  }

  async remove(id: string): Promise<User> {
    try {
      const DeletedUser = await this.userModel.findByIdAndDelete(id);
      return DeletedUser;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findOneWithRoles(userId: string) {
    return this.userModel
      .findById(userId)
      .populate({
        path: 'roles',
        select: 'roleName description',
      })
      .exec();
  }
  async assignRolesToUser(userId: string, roleIds: string[]) {
    try {
      const user = await this.userModel.findById(userId);

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      const existingRoles = user.roles.map((roleId) => roleId.toString());

      for (const roleId of roleIds) {
        if (existingRoles.includes(roleId)) {
          throw new ConflictException(
            `User already has the role with ID ${roleId}`,
          );
        }
      }

      const roles = await this.roleModel.find({ _id: { $in: roleIds } });

      if (roles.length !== roleIds.length) {
        throw new NotFoundException('Role does not exist');
      }

      user.roles = user.roles.concat(roles.map((role) => role._id));
      await user.save();

      return user;
    } catch (error) {
      throw new InternalServerErrorException('Server error', error.message);
    }
  }

  async unassignUserRole(
    userId: string,
    roleId: string,
  ): Promise<{ message: string }> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    // Convert the roleId string to an ObjectId
    const roleIdAsObjectId = new Types.ObjectId(roleId);
    if (user.roles.includes(roleIdAsObjectId)) {
      // Remove the roleId from the user's roles array
      user.roles = user.roles.filter(
        (userRoleId) =>
          userRoleId.toHexString() !== roleIdAsObjectId.toHexString(),
      );
      await user.save();

      return { message: 'Role unassigned successfully' };
    } else {
      throw new BadRequestException('User does not have the specified role');
    }
  }
}
