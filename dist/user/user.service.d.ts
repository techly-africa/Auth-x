import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
export declare class UserService {
    private configService;
    private userModel;
    constructor(configService: ConfigService, userModel: Model<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(req: Request): Promise<User[]>;
    findOne(id: string): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<User>;
}
