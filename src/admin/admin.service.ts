import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from '../auth/schemas/user.schema';
import {
  TransactionStatus,
  TransactionType,
} from '../common/constants/index.enum';
import { ITransaction } from '../transaction/schemas/transaction.schema';

@Injectable()
export class AdminService {
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

  // Get all users
  async findAllUsers(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  // find one user with id

  async findOneUser(id: string): Promise<UserDocument> {
    return this.userModel.findById(id).exec();
  }

  // Delete a user by ID
  async deleteUser(userId: string): Promise<void> {
    const user = await this.userModel.findByIdAndDelete(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
  }
  // Freeze or unfreeze a user account
  async freezeAccount(userId: string, freeze: boolean): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.isFrozen = freeze;
    return user.save();
  }
  // Freeze or unfreeze a user account
  async kycVerification(
    userId: string,
    kycVerified: boolean,
  ): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.kycVerified = kycVerified;
    return user.save();
  }
  async updateCode(userId: string, newCode: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.code = newCode;
    return user.save();
  }

  // user update info..

  async updateUser(userId: string, updateUserDto: any): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndUpdate(userId, updateUserDto, {
      new: true,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Update user balance
  async updateUserBalance(
    userId: string,
    newBalance: number,
  ): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (newBalance < 0) {
      throw new BadRequestException('Balance cannot be negative');
    }
    user.balance = newBalance;
    return user.save();
  }

  // all transaction

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

  // to fetch all transaction made by user
}
