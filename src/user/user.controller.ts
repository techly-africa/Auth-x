import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ObjectId } from 'mongoose';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../auth/Guards/admin.guard';

@ApiTags('User Management')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({summary: 'Create a user'})
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({summary: 'Get all users'})
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({summary: 'Get a specific user'})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @ApiOperation({summary: 'Update a specific user'})
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @ApiOperation({summary: 'Delete a specific user'})
  @Delete(':id')

  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Post(":userId/assign-roles")
  async assignRolesToUser(
    @Param("userId") userId: string,
    @Body() body: { roleIds: string[] },
  ) {
    const { roleIds } = body;
    const user = await this.userService.assignRolesToUser(
      userId,
      roleIds,
    );

    return user;
  }

  @Get(':id/roles')
  async findUserRoles(
    @Param('id') userId : string
  ){
    return this.userService.findOneWithRoles(userId);
  }

  @Post(':userId/unassign-role/:roleId')
  async unassignUserRole(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
  ): Promise<{ message: string }> {
    return this.userService.unassignUserRole(userId, roleId)
  }

}
