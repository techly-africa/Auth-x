import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import mongoose, { Model, Types } from 'mongoose';
import { Role } from './schemas/role.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Permission } from '../permission/schemas/permission.schema';

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
      if (!roleName || !description) {
        throw new BadRequestException('Invalid Inputs!');
      }
      const roleExist = await this.rolesModel.findOne({ roleName });

      if (roleExist) {
        throw new BadRequestException('Role Already Exists');
      }
      await this.rolesModel.create({
        ...role,
      });

      return { message: 'Role Created Successfully' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAllRoles(): Promise<Role[]> {
    try {
      const roles = await this.rolesModel.find({ isDeleted: false });

      return roles;
    } catch (error) {
      throw new InternalServerErrorException('Server Error');
    }
  }

  async findOneRole(id: string): Promise<Role> {
    try {
      const role = await this.rolesModel.findById(id);

      if (!role) {
        throw new NotFoundException('Role not found');
      }
      if (role.isDeleted) {
        throw new BadRequestException('Role deleted temporarily');
      }
      return role;
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        throw new BadRequestException('Invalid role ID format');
      } else {
        throw new InternalServerErrorException(error.message);
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
      if (error instanceof mongoose.Error.CastError) {
        throw new BadRequestException('Invalid role ID format');
      } else {
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
  async unassignPermissionFromRole(roleId: string, permissionId: string) {
    const role = await this.rolesModel.findById(roleId);

    if (!role) {
      throw new NotFoundException('Role doesnot exits');
    }
    const permissionIdAsObjectId = new Types.ObjectId(permissionId);
    if (role.permissions.includes(permissionIdAsObjectId)) {
      role.permissions = role.permissions.filter(
        (rolePermId) =>
          rolePermId.toHexString() !== permissionIdAsObjectId.toHexString(),
      );
      await role.save();
      return {
        message: 'Permission unassigned Successfully',
      };
    } else {
      throw new InternalServerErrorException('Server Error');
    }
  }

  async temporarilySuspendRole(roleId: string): Promise<{ message: string }> {
    const role = await this.rolesModel.findById(roleId);
    if (!role) {
      throw new BadRequestException('Role not Found');
    }
    role.isDeleted = true;

    await role.save();

    return {
      message: 'Role Deleted Temporarily',
    };
  }
  async displaySuspendendRoles(): Promise<Role[]> {
    const suspendedRoles = await this.rolesModel.find({ isDeleted: true });
    return suspendedRoles;
  }
}
