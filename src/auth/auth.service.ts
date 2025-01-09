import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  // Generate access token
  generateAccessToken(user: UserDocument): string {
    const payload = { email: user.email, sub: user._id, role: user.role };
    return this.jwtService.sign(payload, {
      expiresIn: process.env.ACCESSTOKENEXPIRATION,
    }); // Access token expires in 5 minutes
  }

  // Generate refresh toke
  generateRefreshToken(user: UserDocument): string {
    const payload = { sub: user._id };
    return this.jwtService.sign(payload, {
      expiresIn: process.env.REFRESHTOKENEXPIRATION,
    }); // Refresh token expires in 7 days
  }
  // helper function to validae user
  async validateUser(userId: string): Promise<UserDocument> {
    return this.userModel.findById(userId).exec();
  }
  // Generate a unique numeric account number
  async generateUniqueAccountNumber(): Promise<number> {
    let accountNumber: number;
    let isUnique = false;

    while (!isUnique) {
      accountNumber = Math.floor(100000000 + Math.random() * 900000000); // 9 digits

      // check if it exists in the user collection already
      const existingUser = await this.userModel.findOne({ accountNumber });
      if (!existingUser) {
        isUnique = true;
      }
    }

    return accountNumber;
  }
  // Register a new user
  async register(registerUser: RegisterUserDto): Promise<any> {
    const {} = registerUser;
    // check if email existing user collection
    const { email, password, ...rest } = registerUser;
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    // hass password
    const hashedPassword = await bcrypt.hash(password, 15);

    // Generate a unique numeric account number
    const accountNumber = await this.generateUniqueAccountNumber();

    // create new user
    const newUser = new this.userModel({
      email,
      password: hashedPassword,
      accountNumber,
      ...rest,
    });
    const savedUser = await newUser.save();

    const accessToken = this.generateAccessToken(savedUser);
    const refreshToken = this.generateRefreshToken(savedUser);

    return {
      user_details: savedUser,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  // Login user
  async login(loginUser: LoginUserDto): Promise<any> {
    const { email, password } = loginUser;
    const user = await this.userModel
      .findOne({ email })
      .select('+password')
      .exec();
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    return {
      user_details: user,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  // refesh token to get only access token
  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
    access_token: string;
  }> {
    const { refreshToken: refreshToken } = refreshTokenDto;
    const decoded = this.jwtService.verify(refreshToken);
    const user = await this.userModel.findById(decoded.sub);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    const accessToken = this.generateAccessToken(user);

    return { access_token: accessToken };
  }

  // get user data

  async getUserData(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
