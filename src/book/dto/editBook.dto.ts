import { IsOptional, IsString } from 'class-validator';

export class EditBookDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  author_name?: string;
}
