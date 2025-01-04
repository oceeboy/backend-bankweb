import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { TransactionService } from './transaction.service';
import { BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { ITransaction } from './schemas/transaction.schema';
import { UserDocument } from '../auth/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';

describe('TransactionService', () => {
  let service: TransactionService;
  let transactionModel: Model<ITransaction>;
  let userModel: Model<UserDocument>;
  let jwtServive: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getModelToken('Transaction'),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            startSession: jest.fn().mockReturnValue({
              startTransaction: jest.fn(),
              commitTransaction: jest.fn(),
              abortTransaction: jest.fn(),
              endSession: jest.fn(),
            }),
          },
        },
        {
          provide: getModelToken('User'),
          useValue: {
            findById: jest.fn(),
            save: jest.fn(),
            startSession: jest.fn().mockReturnValue({
              startTransaction: jest.fn(),
              commitTransaction: jest.fn(),
              abortTransaction: jest.fn(),
              endSession: jest.fn(),
            }),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    transactionModel = module.get<Model<ITransaction>>(
      getModelToken('Transaction'),
    );
    userModel = module.get<Model<UserDocument>>(getModelToken('User'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a valid transaction', async () => {
    const user = {
      _id: 'userId',
      accountStatus: 'active',
      kycVerified: true,
      balance: 1000,
      save: jest.fn().mockResolvedValueOnce(true),
    };

    const transactionDto = {
      type: 'DEPOSIT',
      amount: 1000,
      status: 'PENDING',
      requiresCode: true,
      code: '123456',
      narration: 'Salary for June',
    };

    jest.spyOn(userModel, 'findById').mockResolvedValueOnce(user as any);
    jest.spyOn(transactionModel.prototype, 'save').mockResolvedValueOnce({
      _id: 'transactionId',
      type: 'deposit',
      amount: 100,
      user: 'userId',
    } as any);

    const result = await service.createTransaction(transactionDto, 'userId');

    expect(result.balance).toBe(1100);
    expect(result.transaction).toMatchObject({
      type: 'deposit',
      amount: 100,
      user: 'userId',
    });
    expect(user.save).toHaveBeenCalled();
    expect(transactionModel.prototype.save).toHaveBeenCalled();
  });

  it('should throw error if user is not found', async () => {
    jest.spyOn(userModel, 'findById').mockResolvedValueOnce(null);

    await expect(
      service.createTransaction(
        { type: 'deposit', amount: 100 },
        'invalidUserId',
      ),
    ).rejects.toThrow(BadRequestException);

    expect(userModel.findById).toHaveBeenCalledWith('invalidUserId');
  });

  it('should require transaction code if KYC is not completed', async () => {
    const user = {
      _id: 'userId',
      accountStatus: 'active',
      kycVerified: false,
      code: '123456',
      save: jest.fn().mockResolvedValueOnce(true),
    };

    jest.spyOn(userModel, 'findById').mockResolvedValueOnce(user as any);

    await expect(
      service.createTransaction({ type: 'deposit', amount: 100 }, 'userId'),
    ).rejects.toThrow(
      'Transaction code is required because KYC is not completed',
    );
  });

  it('should throw error for invalid transaction code', async () => {
    const user = {
      _id: 'userId',
      accountStatus: 'active',
      kycVerified: false,
      code: '123456',
      save: jest.fn().mockResolvedValueOnce(true),
    };

    jest.spyOn(userModel, 'findById').mockResolvedValueOnce(user as any);

    await expect(
      service.createTransaction(
        { type: 'deposit', amount: 100, code: '654321' },
        'userId',
      ),
    ).rejects.toThrow('Invalid transaction code. Please contact bank support');
  });

  it('should enforce 3-minute cooldown between transactions', async () => {
    const user = {
      _id: 'userId',
      accountStatus: 'active',
      kycVerified: true,
      balance: 1000,
      save: jest.fn().mockResolvedValueOnce(true),
    };

    const lastTransaction = {
      createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    };

    jest.spyOn(userModel, 'findById').mockResolvedValueOnce(user as any);
    jest
      .spyOn(transactionModel, 'findOne')
      .mockResolvedValueOnce(lastTransaction as any);

    await expect(
      service.createTransaction({ type: 'deposit', amount: 100 }, 'userId'),
    ).rejects.toThrow('Transactions can only be made 3 minutes apart');

    expect(userModel.findById).toHaveBeenCalledWith('userId');
    expect(transactionModel.findOne).toHaveBeenCalledWith({ user: 'userId' });
  });

  it('should throw error for insufficient funds on withdrawal', async () => {
    const user = {
      _id: 'userId',
      accountStatus: 'active',
      kycVerified: true,
      balance: 50,
      save: jest.fn().mockResolvedValueOnce(true),
    };

    jest.spyOn(userModel, 'findById').mockResolvedValueOnce(user as any);

    await expect(
      service.createTransaction({ type: 'withdrawal', amount: 100 }, 'userId'),
    ).rejects.toThrow('Insufficient funds');
  });
});
