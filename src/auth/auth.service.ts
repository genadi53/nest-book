import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
// import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  signup(dto: AuthDto) {
    return { message: `Hello ${dto.name}` };
  }

  login(dto: AuthDto) {
    console.log(dto);
    return 'signup';
  }
}
