import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (config: ConfigService) => {
    //     return {
    //       signOptions: {
    //         expiresIn: CONSTANTS.JWT_EXPIRATION_TIME,
    //       },
    //       global: true,
    //       secret: config.get('JWT_SECRET') || '',
    //     };
    //   },
    //   inject: [ConfigService],
    // }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
