import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/schemas/user.schema';
import { LoginUserDto } from './login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { generateOTP } from 'src/user/utils/codeGenerator';
import { getExpiry } from 'src/user/utils/dateUtility';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtServices: JwtService,
    private mailerServices: MailService,
  ) { }

  async loginUser(
    user: LoginUserDto,
  ): Promise<{ token?: string; message: string }> {
    const { phone, email, password } = user;
    if ((!phone && !email) || !password) {
      throw new BadRequestException(
        'Please provide either email or phone and password',
      );
    }

    let existUser;
    if (email) {
      existUser = await this.userModel.findOne({ email });
    } else if (phone) {
      existUser = await this.userModel.findOne({ phone });
    }

    if (!existUser) {
      throw new BadRequestException('Invalid Credentials');
    }
    console.log(existUser)

    const passwordMatch = await bcrypt.compare(password, existUser.password);
    if (!passwordMatch) {
      throw new BadRequestException('Invalid Credentials');
    }

    if (!existUser.isVerified) {
      throw new BadRequestException('Please verify your Email');
    }

    if (existUser.isDeleted) {
      throw new BadRequestException('User is Suspended');
    }
    if (!existUser.mfa_enabled) {
      const token = this.jwtServices.sign({
        id: existUser._id,
        name: existUser.name,
        role: existUser.role,
      });
      return {
        token: token,
        message: `Welcome, ${existUser.name}! Your login was successful, and we're thrilled to have you join our community.`,
      };
    }
    const otp = generateOTP(6);
    existUser.mfa_code = otp;
    existUser.mfa_timeout = getExpiry();
    await existUser.save();
    await this.mailerServices.sendUserOtp(otp, existUser.email);
    return { message: 'OTP sent to your email' };
  }

  async verifyUserToken(token: string): Promise<{ message: string }> {
    const user = await this.userModel.findOne({ verificationToken: token });
    if (!user) {
      throw new NotFoundException('Invalid verification token');
    }
    user.isVerified = true;

    await user.save();

    return {
      message: 'Email Verification Successful',
    };
  }
}
