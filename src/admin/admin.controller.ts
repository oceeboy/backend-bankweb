import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from '../common/constants/role.enum';
import { RolesGuard } from '../common/guards/role.guard';

@Controller('admin')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Admin)
// Protect the routes for admin users]
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Get all users
  @Get('users')
  @Roles(Role.Admin)
  async getAllUsers() {
    return this.adminService.findAllUsers();
  }

  // Delete a user
  @Delete('users/:userId')
  @Roles(Role.Admin)
  async deleteUser(@Param('userId') userId: string) {
    return this.adminService.deleteUser(userId);
  }

  // Freeze or unfreeze a user account
  @Patch('users/:userId/freeze')
  async freezeAccount(
    @Param('userId') userId: string,
    @Body('freeze') freeze: boolean,
  ) {
    return this.adminService.freezeAccount(userId, freeze);
  }

  // Update user information
  @Patch('users/:userId')
  @Roles(Role.Admin)
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: any,
  ) {
    return this.adminService.updateUser(userId, updateUserDto);
  }

  // Approve or decline a transaction

  @Get('transactions/:userid')
  @Roles(Role.Admin)
  async getAllTransactions(@Param('userid') userid: string) {
    return this.adminService.getAllTransactions(userid);
  }
}
