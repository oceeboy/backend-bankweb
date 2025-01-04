import { Types } from 'mongoose';
import {
  TransactionStatus,
  TransactionType,
} from 'common/constants/index.enum';

import {
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  IsBoolean,
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

  @IsBoolean()
  @IsOptional()
  requiresCode?: boolean;

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
}
