import { Controller, Post, Get, Body, Res, Req, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

@Controller('users') // Define the base route for this controller
export class UsersController {
  constructor(private readonly usersService: UsersService) {} // Inject UsersService for handling user-related operations

  // Register a user
  @Post('register') // Define the route for user registration
  async register(@Body() body, @Res() res: Response) {
    const { email, password, role } = body; // Extract email, password, and role from the request body
    const user = await this.usersService.register(email, password, role); // Call the register method from UsersService

    if (!user) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'User already exists' }); // Return a bad request response if the user already exists
    }

    return res.status(HttpStatus.CREATED).json({ message: 'User registered successfully' }); // Return success message on successful registration
  }

  // User login and generate JWT token
  @Post('login') // Define the route for user login
  async login(@Body() body, @Res() res: Response) {
    const { email, password } = body; // Extract email and password from the request body
    const token = await this.usersService.login(email, password); // Call the login method from UsersService

    if (!token) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid credentials' }); // Return unauthorized response if credentials are invalid
    }

    return res.status(HttpStatus.OK).json({ token }); // Return the generated token upon successful login
  }

  // Get user information (GET /me) - Manual token validation
  @Get('me') // Define the route for getting user information
  async getMe(@Req() req: Request, @Res() res: Response) {
    const authHeader = req.headers.authorization; // Get the authorization header from the request

    if (!authHeader) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Authorization header missing' }); // Return unauthorized if the header is missing
    }

    const [type, token] = authHeader.split(' '); // Split the header into type (Bearer) and token

    if (type !== 'Bearer' || !token) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid token format' }); // Return unauthorized for invalid token format
    }

    try {
      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using the secret stored in environment variables
      return res.status(HttpStatus.OK).json({ email: decoded.email, role: decoded.role }); // Return decoded user information
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid token' }); // Return unauthorized if token verification fails
    }
  }

  // Get user profile using POST
  @Post('profile') // Define the route for getting user profile
  async getProfile(@Body() body, @Res() res: Response) {
    const { token } = body; // Extract token from the request body
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
      return res.status(HttpStatus.OK).json(decoded); // Return decoded user profile information
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid token' }); // Return unauthorized if token verification fails
    }
  }
}