import { Model, Types } from 'mongoose';
import { CartDocument } from './schemas/cart.schema';
import { ProductsService } from '../products/products.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
export declare class CartService {
    private cartModel;
    private productsService;
    constructor(cartModel: Model<CartDocument>, productsService: ProductsService);
    addToCart(userId: string, addToCartDto: AddToCartDto): Promise<CartDocument>;
    viewCart(userId: string): Promise<{
        items: {
            id: Types.ObjectId;
            productId: any;
            name: any;
            price: any;
            imageUrl: any;
            quantity: number;
            stock: any;
            subTotal: number;
        }[];
        totalPrice: number;
    }>;
    updateQuantity(userId: string, productId: string, quantity: number): Promise<CartDocument>;
    removeFromCart(userId: string, productId: string): Promise<void>;
    clearCart(userId: string): Promise<void>;
}
