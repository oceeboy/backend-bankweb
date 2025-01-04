// Objective: Define all enums in the application
import { AccountStatus } from './account-status.enum';
import { CurrencyCode } from './currency.enum';
import { Role } from './role.enum';

enum AccountType {
  SAVINGS = 'savings',
  CHECKING = 'checking',
  BUSINESS = 'business',
}

enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
}

enum TransactionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  DECLINED = 'declined',
  FAILED = 'failed',
}

export {
  Role,
  AccountType,
  TransactionType,
  AccountStatus,
  CurrencyCode,
  TransactionStatus,
};
