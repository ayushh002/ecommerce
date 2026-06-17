import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'The name of the product', example: 'Logitech MX Master 3S' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'The detailed description of the product', example: 'Ergonomic wireless mouse with high precision scrolling.' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Price of the product', example: 99.99 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ description: 'Available stock quantity', example: 50 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ description: 'Product image URL', example: 'https://example.com/mouse.jpg' })
  @IsNotEmpty()
  @IsString()
  imageUrl: string;

  @ApiProperty({ description: 'Category of the product', example: 'Electronics' })
  @IsNotEmpty()
  @IsString()
  category: string;
}
