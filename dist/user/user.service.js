"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("./schemas/user.schema");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
const uuid_1 = require("uuid");
const mail_service_1 = require("../mail/mail.service");
let UserService = class UserService {
    constructor(userModel, mailerServices) {
        this.userModel = userModel;
        this.mailerServices = mailerServices;
    }
    async create(createUserDto) {
        const { name, email, password, gender } = createUserDto;
        if (!name || !email || !password || !gender) {
            throw new common_1.BadRequestException('Invalid Inputs!');
        }
        try {
            const salt = 10;
            const hash = await bcrypt.hash(createUserDto.password, salt);
            createUserDto.password = hash;
            const verificationToken = (0, uuid_1.v4)();
            const newUser = await this.userModel.create({
                ...createUserDto,
                role: 2,
                isVerified: false,
                verificationToken
            });
            await this.mailerServices.sendUserEmail(createUserDto.name, verificationToken, createUserDto.email);
            return newUser;
        }
        catch (error) {
            if (error.message.includes('E11000 duplicate key error')) {
                return Promise.reject(new common_1.BadRequestException('User with that email already exist.'));
            }
            return Promise.reject(new common_1.InternalServerErrorException());
        }
    }
    async findAll() {
        try {
            const users = await this.userModel.find();
            return users;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException();
        }
    }
    async findOne(id) {
        try {
            const userFound = await this.userModel.findById(id);
            if (!userFound) {
                throw new common_1.BadRequestException('Not Found');
            }
            return userFound;
        }
        catch (error) {
            if (error.message.includes('Not Found')) {
                throw new common_1.BadRequestException('User Not Found');
            }
            throw new common_1.InternalServerErrorException();
        }
    }
    async update(id, updateUserDto) {
        try {
            if (updateUserDto.hasOwnProperty('password')) {
                const salt = 10;
                const hash = await bcrypt.hash(updateUserDto.password, salt);
                updateUserDto.password = hash;
            }
            const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { returnDocument: 'after' });
            if (!updatedUser) {
                throw new common_1.BadRequestException('Not Found');
            }
            return updatedUser;
        }
        catch (error) {
            if (error.message.includes('Not Found')) {
                throw new common_1.BadRequestException('User Not Found');
            }
            throw new common_1.InternalServerErrorException();
        }
    }
    async remove(id) {
        try {
            const DeletedUser = await this.userModel.findByIdAndDelete(id);
            return DeletedUser;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException();
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mail_service_1.MailService])
], UserService);
//# sourceMappingURL=user.service.js.map