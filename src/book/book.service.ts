import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateBookDto } from './dto/createBook.dto';
import { EditBookDto } from './dto/editBook.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookService {
  constructor(private readonly prisma: PrismaService) {}

  async getBookById(userId: number, bookId: number) {
    const isLibrarian = await this.isUserLibrarian(userId);

    if (!isLibrarian) throw new UnauthorizedException('Not Librarian');

    return this.prisma.book.findUnique({ where: { id: bookId } });
  }

  async getAllTakenBooks(userId: number) {
    console.log(userId);
  }

  async createBook(userId: number, bookDto: CreateBookDto) {
    const isLibrarian = await this.isUserLibrarian(userId);

    if (!isLibrarian) throw new UnauthorizedException('Not Librarian');

    const author = await this.prisma.author.findFirst({
      where: {
        name: bookDto.name,
      },
    });

    if (author && author.id) {
      await this.prisma.book.create({
        data: {
          name: bookDto.name,
          description: bookDto.description || '',
          author: {
            connect: {
              id: author.id,
            },
          },
        },
      });
    } else {
      await this.prisma.book.create({
        data: {
          name: bookDto.name,
          description: bookDto.description || '',
          author: {
            create: {
              name: bookDto.author_name,
              description: '',
            },
          },
        },
      });
    }
  }

  async editBook(userId: number, bookId: number, editBookDto: EditBookDto) {
    const isLibrarian = await this.isUserLibrarian(userId);

    if (!isLibrarian) throw new UnauthorizedException('Not Librarian');

    await this.prisma.book.update({
      where: { id: bookId },
      data: {
        ...editBookDto,
      },
    });
  }

  async deleteBook(userId: number, bookId: number) {
    const isLibrarian = await this.isUserLibrarian(userId);

    if (!isLibrarian) throw new UnauthorizedException('Not Librarian');

    await this.prisma.book.update({
      data: { is_deleted: true },
      where: { id: bookId },
    });
  }

  async isUserLibrarian(userId: number) {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { id: userId },
      });

      if (user.role === 'Librarian') {
        return true;
      }

      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
