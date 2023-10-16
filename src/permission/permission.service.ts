import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Permission } from './schemas/permission.schema';
import mongoose, { Model } from 'mongoose';
import { CreatePermDto } from './DTO/create-perm.dto';
import { UpdatePermDto } from './DTO/update-perm.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: Model<Permission>,
  ) { }

  async createPermission(perm: CreatePermDto): Promise<Permission> {
    const { name, description } = perm;

    if (!name || !description) {
      throw new BadRequestException('Invalid Inputs');
    }
    try {
      const permissionExist = await this.permissionModel.findOne({ name });
      if (permissionExist) {
        throw new ConflictException('Permission Already exists');
      }
      const newPermission = await this.permissionModel.create(perm);
      return newPermission;
    } catch (error) {
      throw new InternalServerErrorException('Error', error.message);
    }
  }

  async findAllPermissions(): Promise<Permission[]> {
    const permissions = await this.permissionModel.find();

    return permissions;
  }

  async findPermissionById(permId): Promise<Permission> {
    try {
      const permisionExist = await this.permissionModel.findById(permId);
      if (!permisionExist) {
        throw new NotFoundException(
          `Permission with id${permId} does not exist `,
        );
      }
      return permisionExist;
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        // Handle invalid ID format errors
        throw new BadRequestException('Invalid Permission ID format');
      } else {
        throw new InternalServerErrorException('Server Error', error.message);
      }
    }
  }

  async updatePermission(
    id: string,
    updatedPerm: UpdatePermDto,
  ): Promise<Permission> {
    try {
      const permission = await this.permissionModel.findById(id);
      if (!permission) {
        throw new NotFoundException('Permission does not exist');
      }
      if (updatedPerm.name) {
        permission.name = updatedPerm.name;
      }
      if (updatedPerm.description) {
        permission.description = updatedPerm.description;
      }

      const updatedPermission = await permission.save();
      return updatedPermission;
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        // Handle invalid ID format errors
        throw new BadRequestException('Invalid Permission ID format');
      } else {
        throw new InternalServerErrorException('Server Error', error.message);
      }
    }
  }

  async deletePermission(id: string): Promise<{ message: string }> {
    try {
      const permission = await this.permissionModel.findById(id);
      if (!permission) {
        throw new NotFoundException(`Permission with Id ${id} not found`);
      }
      await this.permissionModel.findByIdAndDelete(permission);

      return {
        message: 'Permission Deleted Successfully',
      };
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        // Handle invalid ID format errors
        throw new BadRequestException('Invalid Permission ID format');
      } else {
        throw new InternalServerErrorException('Server Error', error.message);
      }
    }
  }
}
