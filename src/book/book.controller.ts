import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { BookService } from './book.service';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { User } from '@prisma/client';
import { CreateBookDto } from './dto/createBook.dto';
import { EditBookDto } from './dto/editBook.dto';

@UseGuards(AuthGuard)
@Controller('books')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get('/:id')
  async getBookById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookId: number,
  ) {
    return this.bookService.getBookById(userId, bookId);
  }

  @Get('/')
  async getAllTakenBooks(@GetUser('id') userId: User['id']) {
    return this.bookService.getAllTakenBooks(userId);
  }

  @Post('/')
  async createBook(
    @GetUser('id') userId: number,
    @Body() bookDto: CreateBookDto,
  ) {
    return this.bookService.createBook(userId, bookDto);
  }

  @Patch('/:id')
  async editBook(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookId: number,
    @Body() bookDto: EditBookDto,
  ) {
    return this.bookService.editBook(userId, bookId, bookDto);
  }

  @Delete('/:id')
  async deleteBook(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookId: number,
  ) {
    return this.bookService.deleteBook(userId, bookId);
  }
}
