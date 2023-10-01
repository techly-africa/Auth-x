import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { LoginUserDto } from './login-user.dto';
import * as bcrypt from 'bcrypt'
import {JwtService} from '@nestjs/jwt'

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel : Model<User>,
        private jwtServices : JwtService,
    ){}


    async loginUser(user: LoginUserDto) : Promise<{token : string, message: string}> {
        const {email, password} = user;
        if(!email || !password) {
            throw new BadRequestException("Please fill in all field");
        }
        const existUser = await this.userModel.findOne({email});
        if(!existUser){
            throw new BadRequestException("Invalid Credentials")
        }
        const passwordMatch = await bcrypt.compare(password, existUser.password);
        if(!passwordMatch){
            throw new BadRequestException("Invalid Credentials");
        }
        const token = this.jwtServices.sign({
            id: existUser._id,
            name: existUser.name,
            role: existUser.role
        })
        return {
            token: token,
            message: `Welcome, ${existUser.name}! Your login was successful, and we're thrilled to have you join the MPACash community. Get ready to explore a world of convenient financial services at your fingertips.`
        }
      }
}
