import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';

import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TransactionModule } from 'src/transaction/transaction.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),

    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret', // need to debug why the key in the .env not working here
      signOptions: { expiresIn: '1d' },
    }),

    forwardRef(() => TransactionModule),
  ],

  providers: [AuthService],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
