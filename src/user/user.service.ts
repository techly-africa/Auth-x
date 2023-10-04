import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private mailerServices: MailService
    ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password, gender } = createUserDto;
    if (!name || !email || !password || !gender) {
      throw new BadRequestException('Invalid Inputs!');
    }
    try {
      const salt = 10
      const hash = await bcrypt.hash(createUserDto.password, salt)
      createUserDto.password = hash

      const verificationToken = uuidv4();

      const newUser = await this.userModel.create({
        ...createUserDto,
        role: 2,
        isVerified: false,
        verificationToken
      });

      await this.mailerServices.sendUserEmail(createUserDto.name, verificationToken, createUserDto.email);

      return newUser
    } catch(error) {
      if(error.message.includes('E11000 duplicate key error')) {
        return Promise.reject(new BadRequestException('User with that email already exist.'))
      }
      return Promise.reject(new InternalServerErrorException())
    }

  }

  async findAll(): Promise<User[]> {
    try {
      // const token = req.headers.authorization.token    //  here I had the idea of returning a number of users based on the role of the request initiator
      const users = await this.userModel.find()

      return users
    } catch(error) {
      throw new InternalServerErrorException()
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const userFound = await this.userModel.findById(id)
      if(!userFound) {
        throw new BadRequestException('Not Found')
      }
      return userFound
    } catch(error) {
      if(error.message.includes('Not Found')) {
        throw new BadRequestException('User Not Found')
      }
      throw new InternalServerErrorException()
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      if(updateUserDto.hasOwnProperty('password')) {
        const salt = 10
        const hash = await bcrypt.hash(updateUserDto.password, salt)
        updateUserDto.password = hash
      }
      const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, {returnDocument: 'after'})
      if(!updatedUser){
        throw new BadRequestException('Not Found')
      }
      return updatedUser
    } catch(error) {
      if(error.message.includes('Not Found')) {
        throw new BadRequestException('User Not Found')
      }
      throw new InternalServerErrorException()
    }
  }

  async remove(id: string): Promise<User> {
    try {
      const DeletedUser = await this.userModel.findByIdAndDelete(id)
      return DeletedUser
    } catch(error) {
      throw new InternalServerErrorException()
    }
  }
}
