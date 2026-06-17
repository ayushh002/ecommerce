import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CartService } from '../cart/cart.service';
import { ProductsService } from '../products/products.service';
import { PlaceOrderDto } from './dto/place-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private cartService: CartService,
    private productsService: ProductsService,
  ) {}

  async placeOrder(userId: string, placeOrderDto: PlaceOrderDto): Promise<OrderDocument> {
    const cart = await this.cartService.viewCart(userId);
    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Your shopping cart is empty');
    }

    const orderItems: any[] = [];
    
    for (const item of cart.items) {
      const product = await this.productsService.findOne(item.productId.toString());
      
      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Product ${product.name} is out of stock. Available: ${product.stock}, Requested: ${item.quantity}`,
        );
      }

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });

      const updatedStock = product.stock - item.quantity;
      await this.productsService.update(product._id.toString(), { stock: updatedStock });
    }

    const userObjId = new Types.ObjectId(userId);

    const order = new this.orderModel({
      userId: userObjId,
      products: orderItems,
      totalAmount: cart.totalPrice,
      paymentMethod: placeOrderDto.paymentMethod || 'COD',
      status: 'Pending',
    });

    const savedOrder = await order.save();

    await this.cartService.clearCart(userId);

    return savedOrder;
  }

  async getMyOrders(userId: string): Promise<OrderDocument[]> {
    const userObjId = new Types.ObjectId(userId);
    return this.orderModel.find({ userId: userObjId }).sort({ createdAt: -1 }).exec();
  }

  async getOrderById(userId: string, orderId: string): Promise<OrderDocument> {
    const order = await this.orderModel.findById(orderId).exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (order.userId.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to view this order');
    }

    return order;
  }
}
