import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Model } from 'mongoose';
import { Role } from './schemas/role.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RoleService {

  constructor(
    @InjectModel(Role.name)
    private rolesModel : Model<Role>
  ) {}

  async createRole(role: CreateRoleDto):Promise<{message: string}> {
    const {roleName, description} = role;
    if(!roleName || !description) {
      throw new BadRequestException('Invalid Inputs!');
    }
    try {
      const roleExist = await this.rolesModel.findOne({roleName});

      if(roleExist) {
        throw new BadRequestException('Role Already Exists');
      }
      await this.rolesModel.create({
        ...role
      });
      return {message: 'Role Created Succesful'}
      
    } catch (error) {
      
    }
  }

  async findAllRoles(): Promise<Role[]> {
    try {
      const roles = await this.rolesModel.find()

      return roles
      
    } catch (error) {
      throw new InternalServerErrorException('Server Error')
    }
  }

  findOne(id: string) {
    return `This action returns a #${id} role`;
  }

  update(id: string, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: string) {
    return `This action removes a #${id} role`;
  }
}
