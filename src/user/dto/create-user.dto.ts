import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty , IsString} from "class-validator"
import { appendFile } from "fs"

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    name: string

    @ApiProperty()
    email: string

    @ApiProperty()
    @IsNotEmpty()
    password: string

    @ApiProperty()
    role?: 0 | 1 | 2

    @ApiProperty()
    phone?: string

    @ApiProperty()
    gender?: string;

    @ApiProperty()
    verificationToken? : string

    @ApiProperty()
    isVerified? : boolean
}
