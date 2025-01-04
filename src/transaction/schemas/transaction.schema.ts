import {
  TransactionStatus,
  TransactionType,
} from 'src/common/constants/index.enum';
import { Schema, Document, Types } from 'mongoose';

export interface ITransaction extends Document {
  userId: Types.ObjectId;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  requiresCode: boolean;
  code?: string;
  narration: string;
  createdAt: Date;
  updatedAt: Date;
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
});
