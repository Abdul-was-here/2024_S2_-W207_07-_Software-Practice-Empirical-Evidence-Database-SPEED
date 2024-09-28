import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { IUser } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private userModel: Model<IUser>,
  ) {}

  // 验证用户是否存在并密码正确
  async validateUser(email: string, password: string) {
    const user = await this.userModel.findOne({ email }).exec();
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  // 登录用户并生成 JWT
  async login(email: string, password: string): Promise<string | null> {
    const user = await this.validateUser(email, password);
    if (user) {
      const token = jwt.sign(
        { email: user.email, role: user.role },
        process.env.JWT_SECRET, // 使用环境变量存储密钥
        { expiresIn: '1h' }
      );
      return token;
    }
    return null;
  }

  // 注册新用户
  async register(email: string, password: string, role: string): Promise<any> {
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      return null; // 如果用户已经存在，返回 null
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      email,
      password: hashedPassword,
      role,
    });
    return newUser.save();
  }
}

