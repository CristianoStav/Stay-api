import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError } from 'mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const createdUser = await this.userModel.create(createUserDto);

      return createdUser;
    } catch (err) {
      if (err.type === MongooseError) {
        const error: MongooseError = err;

        if (error.message.includes('duplicate')) {
          console.log('err ->>', error.message);
          throw new BadRequestException(
            `already exists a account with email (${error.message.substring(
              83,
              error.message.length - 2,
            )})`,
          );
        }
      }
      return err;
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    console.log(
      '🚀 ~ file: users.service.ts:42 ~ UserService ~ update ~ UpdateUserDto:',
      JSON.stringify(UpdateUserDto),
    );
    const user = await this.userModel.findOne({ _id: id });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    console.log(
      '🚀 ~ file: users.service.ts:51 ~ UserService ~ update ~ updateUserDto:',
      updateUserDto,
    );

    const updatedUser = await this.userModel.findByIdAndUpdate(
      { _id: id },
      { $set: updateUserDto },
      { new: true },
    );

    return updatedUser;
  }

  async delete(id: string) {
    const user = await this.userModel.findOne({ _id: id });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return this.userModel.findOneAndDelete({ _id: id });
  }
}
