import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class PlaceOrderDto {
  @ApiProperty({ description: 'Payment method (only COD supported)', example: 'COD', enum: ['COD'], default: 'COD' })
  @IsOptional()
  @IsEnum(['COD'])
  paymentMethod?: string = 'COD';
}
