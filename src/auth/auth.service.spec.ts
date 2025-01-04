import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userModel: Model<UserDocument>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken('User'),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userModel = module.get<Model<UserDocument>>(getModelToken('User'));
    jwtService = module.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
  });

  describe('AuthService', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  // describe('register', () => {
  //   it('should throw ConflictException if email is already registered', async () => {
  //     jest
  //       .spyOn(userModel, 'findOne')
  //       .mockResolvedValueOnce({} as UserDocument);

  //     await expect(
  //       service.register({
  //         email: 'test@test.com',
  //         password: 'password123',
  //       } as any),
  //     ).rejects.toThrow(ConflictException);
  //   });

  //   it('should register a new user', async () => {
  //     jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(null);
  //     jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashedPassword');
  //     jest
  //       .spyOn(userModel.prototype, 'save')
  //       .mockResolvedValueOnce({} as UserDocument);
  //     jest
  //       .spyOn(service, 'generateUniqueAccountNumber')
  //       .mockResolvedValueOnce(123456789);
  //     jest.spyOn(jwtService, 'sign').mockReturnValue('token');

  //     const result = await service.register({
  //       email: 'test@test.com',
  //       password: 'password123',
  //     } as any);

  //     expect(result).toEqual({
  //       accessToken: 'token',
  //       refreshToken: 'token',
  //       userData: {},
  //     });
  //   });
  // });

  // describe('login', () => {
  //   it('should throw UnauthorizedException if email is not found', async () => {
  //     jest.spyOn(userModel, 'findOne').mockReturnValueOnce({
  //       select: jest.fn().mockResolvedValueOnce(null),
  //     } as any);

  //     await expect(
  //       service.login({
  //         email: 'test@test.com',
  //         password: 'password123',
  //       } as any),
  //     ).rejects.toThrow(UnauthorizedException);
  //   });

  //   it('should throw UnauthorizedException if password is invalid', async () => {
  //     jest.spyOn(userModel, 'findOne').mockReturnValueOnce({
  //       select: jest.fn().mockResolvedValueOnce({
  //         password: 'hashedPassword',
  //       } as UserDocument),
  //     } as any);
  //     jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);

  //     await expect(
  //       service.login({
  //         email: 'test@test.com',
  //         password: 'password123',
  //       } as any),
  //     ).rejects.toThrow(UnauthorizedException);
  //   });

  //   it('should return access and refresh tokens if credentials are valid', async () => {
  //     jest.spyOn(userModel, 'findOne').mockReturnValueOnce({
  //       select: jest.fn().mockResolvedValueOnce({
  //         password: 'hashedPassword',
  //       } as UserDocument),
  //     } as any);
  //     jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);
  //     jest.spyOn(jwtService, 'sign').mockReturnValue('token');

  //     const result = await service.login({
  //       email: 'test@test.com',
  //       password: 'password123',
  //     } as any);

  //     expect(result).toEqual({
  //       accessToken: 'token',
  //       refreshToken: 'token',
  //     });
  //   });
  // });
});
