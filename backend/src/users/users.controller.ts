import { Controller, Post, Get, Body, Res, Req, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 注册用户
  @Post('register')
  async register(@Body() body, @Res() res: Response) {
    const { email, password, role } = body;
    const user = await this.usersService.register(email, password, role);

    if (!user) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'User already exists' });
    }

    return res.status(HttpStatus.CREATED).json({ message: 'User registered successfully' });
  }

  // 用户登录并生成 JWT token
  @Post('login')
  async login(@Body() body, @Res() res: Response) {
    const { email, password } = body;
    const token = await this.usersService.login(email, password);

    if (!token) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid credentials' });
    }

    return res.status(HttpStatus.OK).json({ token });
  }

  // 获取用户信息 (GET /me)，手动验证 token
  @Get('me')
  async getMe(@Req() req: Request, @Res() res: Response) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Authorization header missing' });
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid token format' });
    }

    try {
      // 验证 JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return res.status(HttpStatus.OK).json({ email: decoded.email, role: decoded.role });
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid token' });
    }
  }

  // 获取用户 profile，使用 POST
  @Post('profile')
  async getProfile(@Body() body, @Res() res: Response) {
    const { token } = body;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return res.status(HttpStatus.OK).json(decoded);
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid token' });
    }
  }
}
