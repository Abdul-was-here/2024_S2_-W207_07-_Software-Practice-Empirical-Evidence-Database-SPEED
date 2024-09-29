import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

// Define the test suite for the UsersController
describe('UsersController (e2e)', () => {
  let app: INestApplication; // Application instance for testing
  let usersService = {
    register: jest.fn(), // Mock function for user registration
    login: jest.fn(),    // Mock function for user login
  };

  // Set up the testing module before each test
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UsersController], // Inject the UsersController
      providers: [
        {
          provide: UsersService, // Provide the mocked UsersService
          useValue: usersService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication(); // Create a NestJS application instance
    await app.init(); // Initialize the application
  });

  // Test case for user registration
  it('/users/register (POST) should register a user', () => {
    // Mock successful registration response
    usersService.register.mockResolvedValueOnce({ email: 'test@example.com' });

    // Send a POST request to register a user
    return request(app.getHttpServer())
      .post('/users/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        role: 'Submitter',
      })
      .expect(HttpStatus.CREATED) // Expect a 201 Created status
      .expect({ message: 'User registered successfully' }); // Expect a success message
  });

  // Test case for attempting to register an existing user
  it('/users/register (POST) should return error for existing user', () => {
    // Mock registration response to indicate user already exists
    usersService.register.mockResolvedValueOnce(null);

    // Send a POST request to register a user
    return request(app.getHttpServer())
      .post('/users/register')
      .send({
        email: 'used@example.com',
        password: 'password123',
        role: 'Submitter',
      })
      .expect(HttpStatus.BAD_REQUEST) // Expect a 400 Bad Request status
      .expect({ message: 'User already exists' }); // Expect an error message
  });

  // Test case for user login
  it('/users/login (POST) should login a user and return a token', () => {
    const token = 'jwt.token.here'; // Mock JWT token
    // Mock successful login response
    usersService.login.mockResolvedValueOnce(token);

    // Send a POST request to login a user
    return request(app.getHttpServer())
      .post('/users/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      })
      .expect(HttpStatus.OK) // Expect a 200 OK status
      .expect({ token }); // Expect the token in the response
  });

  // Test case for invalid login credentials
  it('/users/login (POST) should return error for invalid credentials', () => {
    // Mock login response to indicate invalid credentials
    usersService.login.mockResolvedValueOnce(null);

    // Send a POST request to login a user
    return request(app.getHttpServer())
      .post('/users/login')
      .send({
        email: 'invalid@example.com',
        password: 'wrongpassword',
      })
      .expect(HttpStatus.UNAUTHORIZED) // Expect a 401 Unauthorized status
      .expect({ message: 'Invalid credentials' }); // Expect an error message
  });

  // Clean up the application after all tests
  afterAll(async () => {
    await app.close(); // Close the application
  });
});
