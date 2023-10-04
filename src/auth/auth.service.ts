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


    async loginUser(user: LoginUserDto): Promise<{ token: string; message: string }> {
        const { phone, email, password } = user;
        if ((!phone && !email) || !password) {
          throw new BadRequestException("Please provide either email or phone and password");
        }
      
        let existUser;
        if (email) {
          existUser = await this.userModel.findOne({ email });
        } else if (phone) {
          existUser = await this.userModel.findOne({ phone });
        }
      
        if (!existUser) {
          throw new BadRequestException("Invalid Credentials");
        }
      
        const passwordMatch = await bcrypt.compare(password, existUser.password);
        if (!passwordMatch) {
          throw new BadRequestException("Invalid Credentials");
        }
        const userVerify = await this.userModel.findOne({isVerified: true});
        if(!userVerify) {
          throw new BadRequestException("Please verify your Email")
        }
        const token = this.jwtServices.sign({
          id: existUser._id,
          name: existUser.name,
          role: existUser.role,
        });
      
        return {
          token: token,
          message: `Welcome, ${existUser.name}! Your login was successful, and we're thrilled to have you join the MPACash community. Get ready to explore a world of convenient financial services at your fingertips.`,
        };
      }
      
}
