import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './schemas/role.schema';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Role Management')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async CreateRole(
    @Body()
    role: CreateRoleDto,
  ): Promise<{ message: string }> {
    return this.roleService.createRole(role);
  }

  @Get()
  async findAll(): Promise<Role[]> {
    return this.roleService.findAllRoles();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.roleService.findOneRole(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.roleService.removeRole(id);
  }

  @Post(':roleId/assign-permission')
  async assignPermissionsToRoles(
    @Param('roleId') roleId: string,
    @Body() body: { permissionIds: string[] },
  ) {
    const { permissionIds } = body;
    const role = await this.roleService.assignPermissionToRole(
      roleId,
      permissionIds,
    );
  }
}
