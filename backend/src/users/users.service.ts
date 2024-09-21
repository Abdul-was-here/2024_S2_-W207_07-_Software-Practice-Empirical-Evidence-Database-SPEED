import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  private users = [
    {
      email: 'moderator@example.com',
      password: bcrypt.hashSync('moderatorpass', 10),  // 哈希后的密码
      role: 'Moderator',
    },
    {
      email: 'analyst@example.com',
      password: bcrypt.hashSync('analystpass', 10),    // 哈希后的密码
      role: 'Analyst',
    },
  ];

  async validateUser(email: string, password: string) {
    const user = this.users.find(user => user.email === email);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  async login(email: string, password: string): Promise<string | null> {
    const user = await this.validateUser(email, password);
    if (user) {
      const token = jwt.sign(
        { email: user.email, role: user.role },
        'secret_key',  // 请使用更安全的秘钥
        { expiresIn: '1h' }
      );
      return token;
    }
    return null;
  }

  async getProfile(email: string): Promise<{ email: string; role: string } | null> {
    const user = this.users.find((user) => user.email === email);
    return user ? { email: user.email, role: user.role } : null;
  }
}
