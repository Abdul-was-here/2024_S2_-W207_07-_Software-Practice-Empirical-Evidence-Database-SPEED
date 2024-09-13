import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  private users = [
    { email: 'moderator@example.com', password: 'moderatorpass', role: 'Moderator' },
    { email: 'analyst@example.com', password: 'analystpass', role: 'Analyst' },
  ];

  async validateUser(email: string, password: string) {
    const user = this.users.find(user => user.email === email && user.password === password);
    return user ? user : null;
  }



  async login(email: string, password: string): Promise<string | null> {
    const user = this.users.find((user) => user.email === email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user.email, role: user.role }, 'secret_key', { expiresIn: '1h' });
      return token;
    }
    return null;
  }

  async getProfile(email: string): Promise<{ email: string; role: string } | null> {
    const user = this.users.find((user) => user.email === email);
    return user ? { email: user.email, role: user.role } : null;
  }
}
