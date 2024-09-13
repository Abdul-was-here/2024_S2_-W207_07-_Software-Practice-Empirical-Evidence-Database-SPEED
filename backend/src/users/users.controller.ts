import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import * as jwt from 'jsonwebtoken';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  async login(@Body() body, @Res() res) {
    const { email, password } = body;
    const user = await this.usersService.validateUser(email, password);

    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid credentials' });
    }

    // 生成 JWT 令牌，包含用户角色信息
    const token = jwt.sign({ email: user.email, role: user.role }, 'secret_key', { expiresIn: '1h' });
    return res.status(HttpStatus.OK).json({ token });
  }

  @Post('profile')
  async getProfile(@Body() token: string, @Res() res) {
    try {
      const decoded = jwt.verify(token, 'secret_key');
      return res.status(HttpStatus.OK).json(decoded);
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid token' });
    }
  }
}

