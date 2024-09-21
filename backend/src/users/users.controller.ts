import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import * as jwt from 'jsonwebtoken';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  async login(@Body() body, @Res() res) {
    const { email, password } = body;
    const token = await this.usersService.login(email, password);

    if (!token) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid credentials' });
    }

    // 成功登录后返回 JWT 令牌
    return res.status(HttpStatus.OK).json({ token });
  }

  @Post('profile')
  async getProfile(@Body() body, @Res() res) {
    const { token } = body;
    try {
      const decoded = jwt.verify(token, 'secret_key');
      return res.status(HttpStatus.OK).json(decoded);
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid token' });
    }
  }
}

