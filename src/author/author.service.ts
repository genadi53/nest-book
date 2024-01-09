import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthorService {
  constructor(private readonly prismaService: PrismaService) {}

  getAll() {
    return this.prismaService.author.findMany();
  }

  getAuthorById(id: number) {
    return this.prismaService.author.findUnique({
      where: { id: id },
    });
  }

  getAllBooksByAuthor(name: string) {
    return this.prismaService.book.findMany({
      where: {
        author: {
          name: {
            contains: name,
          },
        },
      },
    });
  }
}
