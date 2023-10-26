import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ObjectId } from 'mongoose';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from './schemas/user.schema';
import { Role } from 'src/role/schemas/role.schema';
import { Request } from 'express';
import { UserGuard } from '../auth/Guards/user.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }
  @ApiTags('User Management')
  @ApiOperation({ summary: 'Create a user' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @ApiTags('User Management')
  @ApiOperation({ summary: 'Get all users' })
  @Get()
  findAll() {
    return this.userService.findAll();
  }
  @ApiTags('User Management')
  @ApiOperation({ summary: 'Get a specific user' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
  @ApiTags('User Management')
  @ApiOperation({ summary: 'Delete a specific user' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @ApiTags('User Management')
  @ApiOperation({ summary: 'Update a specific user' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }
  @ApiTags('User Role Management')
  @ApiOperation({ summary: 'Assign User roles' })
  @Post(':userId/assign-roles')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        roleIds: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      },
    },
  })
  async assignRolesToUser(
    @Param('userId') userId: string,
    @Body() body: { roleIds: string[] },
  ) {
    const { roleIds } = body;
    const user = await this.userService.assignRolesToUser(userId, roleIds);

    return user;
  }

  @ApiTags('User Role Management')
  @ApiOperation({ summary: 'View Roles of a certain User' })
  @Get(':id/roles')
  async findUserRoles(@Param('id') userId: string) {
    return this.userService.findOneWithRoles(userId);
  }

  @ApiTags('User Role Management')
  @ApiOperation({ summary: 'Remove roles from a user ' })
  @Post(':userId/unassign-role/:roleId')
  async unassignUserRole(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
  ): Promise<{ message: string }> {
    return this.userService.unassignUserRole(userId, roleId);
  }
  @ApiTags('User Management')
  @ApiOperation({ summary: 'Suspend a User' })
  @Delete(':userId/temporary')
  async deleteUser(
    @Param('userId') userId: string,
  ): Promise<{ message: string }> {
    return this.userService.deleteUser(userId);
  }
  @ApiTags('User Management')
  @ApiOperation({ summary: 'Display Deleted Users' })
  @Get('deleted/users')
  async findDeletedUsers(): Promise<User[]> {
    return this.userService.displayDeletedUsers();
  }

  @ApiTags('User Management')
  @ApiOperation({ summary: 'Restore Suspended User' })
  @Post(':userId/restore')
  async restoreUser(@Param('userId') userId: string): Promise<User> {
    return this.userService.restoreDeletedUsers(userId);
  }
  @ApiTags('User Management')
  @UseGuards(UserGuard)
  @ApiOperation({ summary: 'Enable 2FA for a user' })
  @Post('/enable-2fa')
  @ApiBearerAuth()
  async enable2FA(@Req() request: Request) {
    return this.userService.enable2FA(request);
  }
  @ApiTags('User Management')
  @UseGuards(UserGuard)
  @ApiOperation({ summary: 'Disable 2FA for a user' })
  @ApiBearerAuth()
  @Post('/disable-2fa')
  async disable2FA(@Req() request: Request) {
    return this.userService.disable2FA(request);
  }
}
