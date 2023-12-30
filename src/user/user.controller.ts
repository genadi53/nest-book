import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

interface AuthRequest extends ExpressRequest {
  user?: {
    sub: number;
    email: string;
    iat: number;
    exp: number;
  };
}

@Controller('users')
export class UserController {
  @UseGuards(AuthGuard)
  @Get('/profile')
  getProfile(@Request() req: AuthRequest) {
    console.log(req['user']);
    return 'useras';
  }
}
