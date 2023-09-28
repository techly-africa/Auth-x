import { CreateUserDto } from "src/user/dto/create-user.dto";

export const user = (): CreateUserDto => {
    return {
        name: "test user",
        email: "testuser1@gmail.com",
        password: 'Testuser123',
    }
}