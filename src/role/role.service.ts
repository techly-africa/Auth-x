import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import mongoose, { Model } from 'mongoose';
import { Role } from './schemas/role.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name)
    private rolesModel: Model<Role>,
  ) {}

  async createRole(role: CreateRoleDto): Promise<{ message: string }> {
    const { roleName, description } = role;

    try {
      // Validate inputs
      if (!roleName || !description) {
        throw new BadRequestException('Invalid Inputs!');
      }

      // Check if the role already exists
      const roleExist = await this.rolesModel.findOne({ roleName });

      if (roleExist) {
        throw new BadRequestException('Role Already Exists');
      }

      // Create the role
      await this.rolesModel.create({
        ...role,
      });

      return { message: 'Role Created Successfully' };
    } catch (error) {
      // Handle any errors
      throw new InternalServerErrorException(
        'Role creation failed',
        error.message,
      );
    }
  }

  async findAllRoles(): Promise<Role[]> {
    try {
      const roles = await this.rolesModel.find();

      return roles;
    } catch (error) {
      throw new InternalServerErrorException('Server Error');
    }
  }

  async findOneRole(id: string): Promise<Role> {
    try {
      // Find the role by ID
      const role = await this.rolesModel.findById(id);

      // Check if the role exists
      if (!role) {
        throw new NotFoundException('Role not found');
      }

      // Return the found role
      return role;
    } catch (error) {
      // Handle any errors
      if (error instanceof mongoose.Error.CastError) {
        // Handle invalid ID format errors
        throw new BadRequestException('Invalid role ID format');
      } else {
        // Handle other errors
        throw new InternalServerErrorException('Server Error', error.message);
      }
    }
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    try {
      const role = await this.rolesModel.findById(id);
      if (!role) {
        throw new BadRequestException(`Role with ${id} does not exist`);
      }
      if (updateRoleDto.roleName) {
        role.roleName = updateRoleDto.roleName;
      }
      if (updateRoleDto.description) {
        role.description = updateRoleDto.description;
      }

      const updatedRole = await role.save();

      return updatedRole;
    } catch (error) {
      // Handle any errors
      if (error instanceof mongoose.Error.CastError) {
        // Handle invalid ID format errors
        throw new BadRequestException('Invalid role ID format');
      } else {
        // Handle other errors
        throw new InternalServerErrorException('Server Error', error.message);
      }
    }
  }

  async removeRole(id: string): Promise<{ message: string }> {
    const role = await this.rolesModel.findByIdAndDelete(id);
    if (!role) {
      throw new BadRequestException(`Role with ${id} does not exist`);
    }
    return {
      message: 'Role Deleted Successfully',
    };
  }
}
