import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermDto } from './DTO/create-perm.dto';

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
}
