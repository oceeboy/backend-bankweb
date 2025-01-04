import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ITransaction } from './schemas/transaction.schema';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { TransactionStatus } from 'src/common/constants/index.enum';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transaction')
@UseGuards(AuthGuard)
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  // create a new transaction

  @Post('withdraw')
  @UseGuards(AuthGuard)
  async withdrawalRequest(
    @Req() req,
    @Body() transactionDto: CreateTransactionDto,
  ): Promise<{ transaction: ITransaction; balance: number }> {
    return this.transactionService.createTransaction(
      transactionDto,
      req.user.sub,
    ); // req.user.sub is the user's id
  }

  @Get('all')
  @UseGuards(AuthGuard)
  async getAllTransactions(@Req() req): Promise<ITransaction[]> {
    return this.transactionService.getAllTransactions(req.user.sub);
  }

  @Delete('delete')
  @UseGuards(AuthGuard)
  async deleteTransaction() {
    return await this.transactionService.deleteAllTransactions();
  }
  @Put(':transactionId/status')
  async updateTransactionStatus(
    @Param('transactionId') transactionId: string,
    @Body('status') status: TransactionStatus,
  ) {
    try {
      const transaction = await this.transactionService.updateTransactionStatus(
        transactionId,
        status,
      );
      return transaction;
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to update status');
    }
  }

  @Put(':transactionId/update')
  @UseGuards(AuthGuard)
  async updateTransaction(
    @Param('transactionId') transactionId: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.updateTransactionField(
      transactionId,
      updateTransactionDto,
    );
  }
}
