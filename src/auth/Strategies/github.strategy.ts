import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy } from 'passport-github2';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class GIthubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    super(
      {
        clientID: '3fbf4b3b08bf22ad930b',
        clientSecret: '7483df51f0cd132f782841df7eb577df169ba947',
        callbackURL: 'http://localhost:3000/auth/github/callback',
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: (error: any, user?: any, info?: any) => void,
      ) => {
        try {
          const { displayName, email } = profile;
          const user = await this.userModel.findOne({ email });
          if (user) {
            return done(null, user);
          }
          const newUser = await this.userModel.create({
            name: displayName,
            email,
            password: '',
            phone: '',
            isVerified: true,
            gender: '',
          });
          return done(null, newUser);
        } catch (error) {
          return done(error, false);
        }
      },
    );
  }
}
