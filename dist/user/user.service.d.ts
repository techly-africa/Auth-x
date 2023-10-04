import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { MailService } from 'src/mail/mail.service';
export declare class UserService {
    private userModel;
    private mailerServices;
    constructor(userModel: Model<User>, mailerServices: MailService);
    create(createUserDto: CreateUserDto): Promise<{
        message: string;
    }>;
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<User>;
}
