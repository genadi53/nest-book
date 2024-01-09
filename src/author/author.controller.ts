import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { AuthorService } from './author.service';

@Controller('author')
export class AuthorController {
  constructor(private authorService: AuthorService) {}

  @Get('/')
  async getAllBooks() {
    return this.authorService.getAll();
  }

  @Get('/books')
  async getAllBooksByAuthor(
    // @Query('id', ParseIntPipe) authorId?: number,
    @Query('name') name: any,
  ) {
    return this.authorService.getAllBooksByAuthor(name);
  }

  @Get('/:id')
  async getBookById(@Param('id', ParseIntPipe) bookId: number) {
    return this.authorService.getAuthorById(bookId);
  }
}
