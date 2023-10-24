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
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @ApiTags('Role Management')
  @ApiOperation({ summary: 'Create a Role' })
  @Post()
  async CreateRole(
    @Body()
    role: CreateRoleDto,
  ): Promise<{ message: string }> {
    return this.roleService.createRole(role);
  }
  @ApiTags('Role Management')
  @ApiOperation({ summary: 'View all Roles' })
  @Get()
  async findAll(): Promise<Role[]> {
    return this.roleService.findAllRoles();
  }
  @ApiTags('Role Management')
  @ApiOperation({ summary: 'View a Role by Id' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.roleService.findOneRole(id);
  }
  @ApiTags('Role Management')
  @ApiOperation({ summary: 'Permanently delete a role' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.roleService.removeRole(id);
  }
  @ApiTags('Role Management')
  @ApiOperation({ summary: 'Update a role' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @ApiTags('Role Permission Managent')
  @ApiOperation({ summary: 'Assign Permissions to roles' })
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
  @ApiOperation({ summary: 'View Permission of a certain role' })
  @Get(':roleId/permissions')
  async findRolePermissions(
    @Param('roleId')
    roleId: string,
  ) {
    return this.roleService.findRoleWithPermissions(roleId);
  }

  @ApiTags('Role Permission Managent')
  @ApiOperation({ summary: 'Unassign permission to a role' })
  @Post(':roleId/unassign-permission/:permId')
  async unassignPermission(
    @Param('roleId') roleId: string,
    @Param('permId') permId: string,
  ) {
    return this.roleService.unassignPermissionFromRole(roleId, permId);
  }

  @ApiTags('Role Management')
  @ApiOperation({ summary: 'Suspend a role ' })
  @Delete(':roleId/temporary')
  async temporarilySuspendRole(
    @Param('roleId') roleId: string,
  ): Promise<{ message: string }> {
    return this.roleService.temporarilySuspendRole(roleId);
  }
  @ApiTags('Role Management')
  @ApiOperation({ summary: 'View suspended roles' })
  @Get('temporary/deleted/roles')
  async findSuspendedRoles(): Promise<Role[]> {
    return this.roleService.displaySuspendendRoles();
  }

  @ApiTags('Role Management')
  @ApiOperation({ summary: 'Restore Suspended Roles' })
  @Post(':roleId/restore')
  async restoreRole(@Param('roleId') roleId: string): Promise<Role> {
    return this.roleService.restoreSuspendedRole(roleId);
  }
}
