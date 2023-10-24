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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdatePermDto } from './DTO/update-perm.dto';
import { Permission } from './schemas/permission.schema';

@ApiTags('Permission Management')
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionServices: PermissionService) {}

  @ApiOperation({ summary: 'Create a Permission' })
  @Post()
  async createPermission(
    @Body()
    permission: CreatePermDto,
  ) {
    return this.permissionServices.createPermission(permission);
  }

  @ApiOperation({ summary: 'View All Permissions' })
  @Get()
  async findAllPermissions() {
    return this.permissionServices.findAllPermissions();
  }

  @ApiOperation({ summary: 'View Permission by Id' })
  @Get(':permId')
  async findPermissionById(
    @Param('permId')
    permId: string,
  ) {
    return this.permissionServices.findPermissionById(permId);
  }

  @ApiOperation({ summary: 'Update a Single Permission' })
  @Patch(':id')
  async updatePermission(
    @Param('id')
    id: string,
    @Body()
    updatedPermission: UpdatePermDto,
  ) {
    return this.permissionServices.updatePermission(id, updatedPermission);
  }

  @ApiOperation({ summary: 'Delete a Permission by Id' })
  @Delete(':id')
  async deletePermission(
    @Param('id')
    id: string,
  ) {
    return this.permissionServices.deletePermission(id);
  }

  @ApiOperation({ summary: 'View suspended permissions ' })
  @Get('temporary/deleted/permissions')
  async findSuspendendPermissions(): Promise<Permission[]> {
    return this.permissionServices.displaySuspendendPermissions();
  }
  @ApiOperation({ summary: 'Deleted a permission temporarily' })
  @Delete(':permId/temporary')
  async temporarilyDeletePermission(
    @Param('permId') permId: string,
  ): Promise<{ message: string }> {
    return this.permissionServices.temporarilySuspendPermission(permId);
  }

  @ApiOperation({ summary: 'Restore a suspended permission' })
  @Post(':permId/restore')
  async restorePermission(
    @Param('permId') permId: string,
  ): Promise<Permission> {
    return this.permissionServices.restoreSuspendedPermission(permId);
  }
}
