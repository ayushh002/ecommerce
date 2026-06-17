import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class UpdateCartQuantityDto {
  @ApiProperty({ description: 'The new quantity for the cart item', example: 3 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;
}
