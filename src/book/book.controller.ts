import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { BookService } from './book.service';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { CreateBookDto } from './dto/createBook.dto';
import { EditBookDto } from './dto/editBook.dto';

@Controller('books')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get('/')
  async getAllBooks() {
    return this.bookService.getAllBooks();
  }

  @Get('/:id')
  async getBookById(@Param('id', ParseIntPipe) bookId: number) {
    return this.bookService.getBookById(bookId);
  }

  @UseGuards(AuthGuard)
  @Get('/user/:id')
  async getAllTakenBooks(@Param('id', ParseIntPipe) userId: number) {
    return this.bookService.getAllTakenBooks(userId);
  }

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  @Post('/')
  async createBook(
    @GetUser('id') userId: number,
    @Body() bookDto: CreateBookDto,
  ) {
    return this.bookService.createBook(userId, bookDto);
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  async editBook(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookId: number,
    @Body() bookDto: EditBookDto,
  ) {
    return this.bookService.editBook(userId, bookId, bookDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  @Delete('/:id')
  async deleteBook(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookId: number,
  ) {
    return this.bookService.deleteBook(userId, bookId);
  }

  @UseGuards(AuthGuard)
  @Post('/:id/take')
  async takeBook(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookId: number,
  ) {
    return this.bookService.takeBook(userId, bookId);
  }

  @UseGuards(AuthGuard)
  @Post('/:id/return')
  async returnTakenBook(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookId: number,
  ) {
    return this.bookService.returnTakenBook(userId, bookId);
  }
}
