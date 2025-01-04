import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionSchema } from './schemas/transaction.schema';
import { UserSchema } from '../auth/schemas/user.schema';
import { AuthModule } from '../auth/auth.module';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Transaction', schema: TransactionSchema },
      { name: 'User', schema: UserSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  providers: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}
