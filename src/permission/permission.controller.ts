import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermDto } from './DTO/create-perm.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdatePermDto } from './DTO/update-perm.dto';
import { Permission } from './schemas/permission.schema';

@ApiTags('Permission Management')
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionServices: PermissionService) {}

  @Post()
  async createPermission(
    @Body()
    permission: CreatePermDto,
  ) {
    return this.permissionServices.createPermission(permission);
  }

  @Get()
  async findAllPermissions() {
    return this.permissionServices.findAllPermissions();
  }

  @Get(':permId')
  async findPermissionById(
    @Param('permId')
    permId: string,
  ) {
    return this.permissionServices.findPermissionById(permId);
  }

  @Patch(':id')
  async updatePermission(
    @Param('id')
    id: string,
    @Body()
    updatedPermission: UpdatePermDto,
  ) {
    return this.permissionServices.updatePermission(id, updatedPermission);
  }

  @Delete(':id')
  async deletePermission(
    @Param('id')
    id: string,
  ) {
    return this.permissionServices.deletePermission(id);
  }
  @Get('temporary/deleted/permissions')
  async findSuspendendPermissions(): Promise<Permission[]> {
    return this.permissionServices.displaySuspendendPermissions();
  }

  @Delete(':permId/temporary')
  async temporarilyDeletePermission(
    @Param('permId') permId: string,
  ): Promise<{ message: string }> {
    return this.permissionServices.temporarilySuspendPermission(permId);
  }
}
