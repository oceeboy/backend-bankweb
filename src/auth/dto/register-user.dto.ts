import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsDate,
  IsEnum,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { AccountStatus } from 'common/constants/account-status.enum';
import { CurrencyCode } from 'common/constants/currency.enum';
import { Role } from 'common/constants/role.enum';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsDate()
  @IsNotEmpty()
  dateOfBirth: Date;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @IsOptional()
  balance?: number;

  @IsEnum(CurrencyCode)
  @IsOptional()
  currency?: CurrencyCode;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsBoolean()
  @IsOptional()
  isFrozen?: boolean;

  @IsString()
  @IsOptional()
  otp?: string;

  @IsEnum(AccountStatus)
  @IsOptional()
  accountStatus?: AccountStatus;

  @IsBoolean()
  @IsOptional()
  kycVerified?: boolean;
}
