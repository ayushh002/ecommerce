import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { ProductsService } from '../products/products.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    private productsService: ProductsService,
  ) {}

  async addToCart(userId: string, addToCartDto: AddToCartDto): Promise<CartDocument> {
    const { productId, quantity } = addToCartDto;

    const product = await this.productsService.findOne(productId);

    const userObjId = new Types.ObjectId(userId);
    const productObjId = new Types.ObjectId(productId);

    const existingCartItem = await this.cartModel.findOne({ userId: userObjId, productId: productObjId }).exec();

    const targetQuantity = existingCartItem 
      ? existingCartItem.quantity + quantity 
      : quantity;

    if (product.stock < targetQuantity) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${product.stock}, Requested in cart: ${targetQuantity}`,
      );
    }

    if (existingCartItem) {
      existingCartItem.quantity = targetQuantity;
      return existingCartItem.save();
    } else {
      const newCartItem = new this.cartModel({
        userId: userObjId,
        productId: productObjId,
        quantity,
      });
      return newCartItem.save();
    }
  }

  async viewCart(userId: string) {
    const userObjId = new Types.ObjectId(userId);
    const items = await this.cartModel
      .find({ userId: userObjId })
      .populate('productId')
      .exec();

    const validItems = items.filter(item => item.productId !== null);

    let totalPrice = 0;
    const formattedItems = validItems.map(item => {
      const product = item.productId as any;
      const subTotal = product.price * item.quantity;
      totalPrice += subTotal;

      return {
        id: item._id,
        productId: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: item.quantity,
        stock: product.stock,
        subTotal,
      };
    });

    return {
      items: formattedItems,
      totalPrice,
    };
  }

  async updateQuantity(userId: string, productId: string, quantity: number): Promise<CartDocument> {
    const product = await this.productsService.findOne(productId);
    
    if (product.stock < quantity) {
      throw new BadRequestException(`Insufficient stock. Available: ${product.stock}`);
    }

    const userObjId = new Types.ObjectId(userId);
    const productObjId = new Types.ObjectId(productId);

    const cartItem = await this.cartModel.findOne({ userId: userObjId, productId: productObjId }).exec();
    if (!cartItem) {
      throw new NotFoundException('Product not found in your cart');
    }

    cartItem.quantity = quantity;
    return cartItem.save();
  }

  async removeFromCart(userId: string, productId: string): Promise<void> {
    const userObjId = new Types.ObjectId(userId);
    const productObjId = new Types.ObjectId(productId);
    const result = await this.cartModel.deleteOne({ userId: userObjId, productId: productObjId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Product not found in your cart');
    }
  }

  async clearCart(userId: string): Promise<void> {
    const userObjId = new Types.ObjectId(userId);
    await this.cartModel.deleteMany({ userId: userObjId }).exec();
  }
}
