import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import type { User } from '@prisma/client';

export const GetUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    if (data) {
      return req.user?.[data];
    }
    return req.user;
  },
);
