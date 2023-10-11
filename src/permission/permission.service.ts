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

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: Model<Permission>,
  ) {}

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
}
