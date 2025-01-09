import {
  TransactionStatus,
  TransactionType,
} from '../../common/constants/index.enum';
import { Types } from 'mongoose';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsDate,
  // Length,
} from 'class-validator';

export class CreateTransactionDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: Types.ObjectId;

  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsEnum(TransactionStatus)
  @IsNotEmpty()
  status: TransactionStatus;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsNotEmpty()
  narration: string;

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;

  // New fields for money transfers in Germany this is a test
  @IsString()
  @IsOptional()
  iban?: string;

  @IsString()
  @IsOptional()
  // @Length(8, 11, { message: 'BIC must be either 8 or 11 characters long.' })
  bic?: string;

  @IsString()
  @IsOptional()
  recipientName?: string;

  @IsString()
  @IsOptional()
  reference?: string;
}
