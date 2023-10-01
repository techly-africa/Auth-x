import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ObjectId } from 'mongoose';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/auth/auth.guard';

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
  @UseGuards(AdminGuard)
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
}
