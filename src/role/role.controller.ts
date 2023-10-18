import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './schemas/role.schema';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @ApiTags('Role Management')
  @Post()
  async CreateRole(
    @Body()
    role: CreateRoleDto,
  ): Promise<{ message: string }> {
    return this.roleService.createRole(role);
  }
  @ApiTags('Role Management')
  @Get()
  async findAll(): Promise<Role[]> {
    return this.roleService.findAllRoles();
  }
  @ApiTags('Role Management')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.roleService.findOneRole(id);
  }
  @ApiTags('Role Management')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }
  @ApiTags('Role Management')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.roleService.removeRole(id);
  }
  @ApiTags('Role Permission Managent')
  @Post(':roleId/assign-permission')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        permissionIds: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      },
    },
  })
  async assignPermissionsToRoles(
    @Param('roleId') roleId: string,

    @Body()
    body: { permissionIds: string[] },
  ) {
    const { permissionIds } = body;
    const role = await this.roleService.assignPermissionToRole(
      roleId,
      permissionIds,
    );
    return role;
  }
  @ApiTags('Role Permission Managent')
  @Get(':roleId/permissions')
  async findRolePermissions(
    @Param('roleId')
    roleId: string,
  ) {
    return this.roleService.findRoleWithPermissions(roleId);
  }

  @ApiTags('Role Permission Managent')
  @Post(':roleId/unassign-permission/:permId')
  async unassignPermission(
    @Param('roleId') roleId: string,
    @Param('permId') permId: string,
  ) {
    return this.roleService.unassignPermissionFromRole(roleId, permId);
  }
}
