import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import mongoose, { Model } from 'mongoose';
import { Role } from './schemas/role.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Permission } from 'src/permission/schemas/permission.schema';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name)
    private rolesModel: Model<Role>,
    @InjectModel(Permission.name)
    private permissionModel: Model<Permission>,
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

  async assignPermissionToRole(
    roleId: string,
    permissionIds: string[],
  ): Promise<{ message: string }> {
    try {
      const role = await this.rolesModel.findById(roleId);

      if (!role) {
        throw new NotFoundException('Role not found');
      }

      const existingPermissions = role.permissions.map((permissionId) =>
        permissionId.toString(),
      );

      for (const permissionId of permissionIds) {
        if (existingPermissions.includes(permissionId)) {
          throw new ConflictException(
            `Role already has the permission with ID ${permissionId}`,
          );
        }
      }

      const permissions = await this.permissionModel.find({
        _id: { $in: permissionIds },
      });

      if (permissions.length !== permissionIds.length) {
        throw new NotFoundException('Permission does not exist');
      }

      role.permissions = role.permissions.concat(
        permissions.map((permission) => permission._id),
      );

      await role.save();
      return {
        message: 'Permission assigned to role Successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException('Server error', error.message);
    }
  }
  async findRoleWithPermissions(roleId: string) {
    try {
      const role = await this.rolesModel
        .findById(roleId)
        .populate({
          path: 'permissions',
          select: 'name description',
        })
        .exec();
  
      return role;
    } catch (error) {
      console.error(`Error finding role with permissions: ${error}`);
      throw error;
    }
  }
  
}
