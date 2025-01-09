import {
  TransactionStatus,
  TransactionType,
} from '../../common/constants/index.enum';
import { Schema, Document, Types } from 'mongoose';

export interface ITransaction extends Document {
  userId: Types.ObjectId;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;

  code?: string;
  narration: string;
  createdAt: Date;
  updatedAt: Date;
  iban?: string;
  bic?: string;
  recipientName?: string;
}

export const TransactionSchema = new Schema<ITransaction>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: Object.values(TransactionType),

    required: true,
  },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: Object.values(TransactionStatus),
    default: TransactionStatus.PENDING,
    required: true,
  },

  code: { type: String },
  narration: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  // Fields specific to money transfer in Germany
  iban: { type: String }, // International Bank Account Number
  bic: { type: String }, // Bank Identifier Code
  recipientName: { type: String }, // Full name of the recipient
});
