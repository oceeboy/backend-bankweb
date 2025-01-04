import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITransaction } from './schemas/transaction.schema';
import { UserDocument } from '../auth/schemas/user.schema';
import {
  TransactionStatus,
  TransactionType,
} from 'common/constants/index.enum';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    @InjectModel('Transaction')
    private readonly transactionModel: Model<ITransaction>,
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  // Helper: Validate enum values
  private validateEnum<T>(value: T, validValues: T[], fieldName: string): void {
    if (!validValues.includes(value)) {
      throw new BadRequestException(
        `Invalid ${fieldName}. Allowed values: ${validValues.join(', ')}`,
      );
    }
  }

  // Helper: Find user and validate account status
  private async findAndValidateUser(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.accountStatus !== 'active') {
      throw new BadRequestException('User account is not active');
    }
    return user;
  }

  // Helper: Validate last transaction timing
  private async validateLastTransactionTiming(userId: string): Promise<void> {
    const lastTransaction = await this.transactionModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(1)
      .exec();

    if (lastTransaction.length > 0) {
      const lastTransactionTime = new Date(
        lastTransaction[0].createdAt,
      ).getTime();
      const timeDiff = Date.now() - lastTransactionTime;
      const THREE_MINUTES_IN_MS = 3 * 60 * 1000;

      if (timeDiff < THREE_MINUTES_IN_MS) {
        throw new BadRequestException(
          'Transactions can only be made 3 minutes apart',
        );
      }
    }
  }

  // Create a new transaction
  async createTransaction(
    transactionDto: CreateTransactionDto,
    userId: string,
  ): Promise<{ transaction: ITransaction; balance: number }> {
    const { type, amount, code, status } = transactionDto;

    const user = await this.findAndValidateUser(userId);

    if (!user.kycVerified) {
      if (!code) {
        throw new BadRequestException(
          'Transaction code is required because KYC is not completed',
        );
      }
      if (user.code !== code) {
        throw new BadRequestException(
          'Invalid transaction code. Please contact bank support',
        );
      }
    }

    await this.validateLastTransactionTiming(userId);

    // Validate transaction type and status
    this.validateEnum(type, Object.values(TransactionType), 'transaction type');
    this.validateEnum(
      status,
      Object.values(TransactionStatus),
      'transaction status',
    );

    if (amount <= 0) {
      throw new BadRequestException(
        'Transaction amount must be greater than zero',
      );
    }

    const session = await this.userModel.startSession();
    session.startTransaction();

    try {
      // Update user's balance
      if (type === TransactionType.DEPOSIT) {
        user.balance += amount;
      } else if (type === TransactionType.WITHDRAWAL) {
        if (user.balance < amount) {
          throw new BadRequestException('Insufficient funds');
        }
        user.balance -= amount;
      }
      await user.save({ session });

      // Create and save the transaction
      const newTransaction = new this.transactionModel({
        userId: user._id,
        ...transactionDto,
      });
      await newTransaction.save({ session });

      // Commit transaction
      await session.commitTransaction();

      return { transaction: newTransaction, balance: user.balance };
    } catch (error) {
      await session.abortTransaction();
      this.logger.error('Transaction failed', error.stack);
      throw error;
    } finally {
      session.endSession();
    }
  }

  // Get all transactions for a user
  async getAllTransactions(userId: string): Promise<ITransaction[]> {
    return this.transactionModel.find({ userId }).exec();
  }

  // Generic update function
  async updateTransactionField(
    transactionId: string,
    updates: Partial<ITransaction>,
  ): Promise<ITransaction> {
    const transaction = await this.transactionModel.findById(transactionId);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    Object.assign(transaction, updates);

    return transaction.save();
  }

  // Delete all transactions
  async deleteAllTransactions(): Promise<void> {
    await this.transactionModel.deleteMany().exec();
  }

  // Delete a specific transaction
  async deleteTransaction(transactionId: string): Promise<{ message: string }> {
    const transaction =
      await this.transactionModel.findByIdAndDelete(transactionId);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return { message: 'Transaction deleted successfully' };
  }

  // Update transaction status
  async updateTransactionStatus(
    transactionId: string,
    status: TransactionStatus,
  ): Promise<ITransaction> {
    this.validateEnum(
      status,
      Object.values(TransactionStatus),
      'transaction status',
    );
    return this.updateTransactionField(transactionId, { status });
  }

  // Update transaction type
  async updateTransactionType(
    transactionId: string,
    type: TransactionType,
  ): Promise<ITransaction> {
    this.validateEnum(type, Object.values(TransactionType), 'transaction type');
    return this.updateTransactionField(transactionId, { type });
  }

  // Update transaction narration
  async updateTransactionNarration(
    transactionId: string,
    narration: string,
  ): Promise<ITransaction> {
    return this.updateTransactionField(transactionId, { narration });
  }

  // Update transaction date
  async updateTransactionDate(
    transactionId: string,
    date: Date,
  ): Promise<ITransaction> {
    return this.updateTransactionField(transactionId, { createdAt: date });
  }

  // Update transaction code
  async updateTransactionCode(
    transactionId: string,
    code: string,
  ): Promise<ITransaction> {
    return this.updateTransactionField(transactionId, { code });
  }

  // Update transaction amount
  async updateTransactionAmount(
    transactionId: string,
    amount: number,
  ): Promise<ITransaction> {
    if (amount <= 0) {
      throw new BadRequestException(
        'Transaction amount must be greater than zero',
      );
    }
    return this.updateTransactionField(transactionId, { amount });
  }
}
