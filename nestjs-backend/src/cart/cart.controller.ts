import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartQuantityDto } from './dto/update-cart-quantity.dto';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({ summary: 'Add a product to the shopping cart' })
  @ApiResponse({ status: 201, description: 'Product successfully added to cart.' })
  @ApiResponse({ status: 400, description: 'Bad request / Insufficient stock.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async addToCart(@Request() req: any, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(req.user.userId, addToCartDto);
  }

  @Get()
  @ApiOperation({ summary: 'View items in the shopping cart' })
  @ApiResponse({ status: 200, description: 'Shopping cart details.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async viewCart(@Request() req: any) {
    return this.cartService.viewCart(req.user.userId);
  }

  @Put(':productId')
  @ApiOperation({ summary: 'Update product quantity in the cart' })
  @ApiResponse({ status: 200, description: 'Cart item successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad request / Insufficient stock.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Product not found in cart.' })
  async updateQuantity(
    @Request() req: any,
    @Param('productId') productId: string,
    @Body() updateCartQuantityDto: UpdateCartQuantityDto,
  ) {
    return this.cartService.updateQuantity(req.user.userId, productId, updateCartQuantityDto.quantity);
  }

  @Delete(':productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a product from the cart' })
  @ApiResponse({ status: 204, description: 'Product successfully removed from cart.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Product not found in cart.' })
  async removeFromCart(@Request() req: any, @Param('productId') productId: string) {
    await this.cartService.removeFromCart(req.user.userId, productId);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Clear all items from the cart' })
  @ApiResponse({ status: 204, description: 'Cart successfully cleared.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async clearCart(@Request() req: any) {
    await this.cartService.clearCart(req.user.userId);
  }
}
