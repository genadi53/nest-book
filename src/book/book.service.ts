import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/createBook.dto';
import { EditBookDto } from './dto/editBook.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookService {
  constructor(private readonly prisma: PrismaService) {}

  getAllBooks() {
    return this.prisma.book.findMany();
  }

  async getBookById(bookId: number) {
    return this.prisma.book.findUnique({ where: { id: bookId } });
  }

  async getAllTakenBooks(userId: number) {
    try {
      const { books } = await this.prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: {
          books: { include: { book: true } },
        },
      });
      return { books };
    } catch (err) {
      console.error(err);
      return new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }
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
      return this.prisma.book.create({
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
      return this.prisma.book.create({
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

  async takeBook(userId: number, bookId: number) {
    try {
      const book = await this.prisma.book.findUnique({
        where: { id: bookId },
      });

      if (!book) throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);

      await this.prisma.takenBooks.create({
        data: {
          book_id: bookId,
          user_id: userId,
        },
      });
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  async returnTakenBook(userId: number, bookId: number) {
    try {
      const book = await this.prisma.book.findUnique({
        where: { id: bookId },
      });

      if (!book) throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);

      await this.prisma.takenBooks.update({
        data: {
          returnedAt: new Date(),
        },
        where: {
          user_id_book_id: {
            book_id: bookId,
            user_id: userId,
          },
        },
      });
    } catch (err) {
      console.error(err);
      return err;
    }
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
