import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';
import { CONSTANTS } from 'src/constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    try {
      const hash = await argon.hash(dto.password);
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          password: hash,
          role: Role.User,
        },
      });

      const access_token = await this.signToken(user.id, user.email);
      return { access_token };
    } catch (err) {
      console.error(err);
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new ForbiddenException('Credentials Taken');
      }
      throw Error(err);
    }
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (!user) throw new ForbiddenException('Incorrect credentials');

      const isMatch = await argon.verify(user.password, dto.password);
      if (!isMatch) throw new ForbiddenException('Incorrect credentials');

      const access_token = await this.signToken(user.id, user.email);
      return { access_token };
    } catch (err) {
      console.error(err);
      throw new ForbiddenException(err.message || 'Incorrect credentials');
    }
  }

  async signToken(userId: number, email: string): Promise<string> {
    const payload = { sub: userId, email };
    return this.jwtService.signAsync(payload, {
      expiresIn: CONSTANTS.JWT_EXPIRATION_TIME,
      secret: this.config.get('JWT_SECRET') || '',
    });
  }
}
