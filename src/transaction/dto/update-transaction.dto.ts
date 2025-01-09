import { Types } from 'mongoose';
import {
  TransactionStatus,
  TransactionType,
} from '../../common/constants/index.enum';

import {
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  IsNumber,
  IsDate,
} from 'class-validator';

export class UpdateTransactionDto {
  @IsMongoId()
  @IsOptional()
  userId?: Types.ObjectId;

  @IsEnum(TransactionType)
  @IsOptional()
  type?: TransactionType;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsEnum(TransactionStatus)
  @IsOptional()
  status?: TransactionStatus;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  narration?: string;

  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @IsDate()
  @IsOptional()
  updatedAt?: Date;

  // New fields for money transfers in Germany
  @IsString()
  @IsOptional()
  iban?: string;

  @IsString()
  @IsOptional()
  bic?: string;

  @IsString()
  @IsOptional()
  recipientName?: string;

  @IsString()
  @IsOptional()
  reference?: string;
}
