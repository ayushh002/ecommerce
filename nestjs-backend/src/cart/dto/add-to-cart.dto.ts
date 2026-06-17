import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({ description: 'The product ID to add', example: '60c72b2f9b1d8e2568e61234' })
  @IsNotEmpty()
  @IsMongoId()
  productId: string;

  @ApiProperty({ description: 'The quantity to add (minimum 1)', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;
}
