import { Body, Controller, Get, Param, Post, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PlaceOrderDto } from './dto/place-order.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Place a new order from current cart items' })
  @ApiResponse({ status: 201, description: 'Order successfully placed.' })
  @ApiResponse({ status: 400, description: 'Empty cart or insufficient stock.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async placeOrder(@Request() req: any, @Body() placeOrderDto: PlaceOrderDto) {
    return this.ordersService.placeOrder(req.user.userId, placeOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all orders for the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of user orders.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getMyOrders(@Request() req: any) {
    return this.ordersService.getMyOrders(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific order by ID' })
  @ApiResponse({ status: 200, description: 'Order details.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden access to another user order.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  async getOrderById(@Request() req: any, @Param('id') id: string) {
    return this.ordersService.getOrderById(req.user.userId, id);
  }
}
