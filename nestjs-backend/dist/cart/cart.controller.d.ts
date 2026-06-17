import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartQuantityDto } from './dto/update-cart-quantity.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    addToCart(req: any, addToCartDto: AddToCartDto): Promise<import("./schemas/cart.schema").CartDocument>;
    viewCart(req: any): Promise<{
        items: {
            id: import("mongoose").Types.ObjectId;
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
    updateQuantity(req: any, productId: string, updateCartQuantityDto: UpdateCartQuantityDto): Promise<import("./schemas/cart.schema").CartDocument>;
    removeFromCart(req: any, productId: string): Promise<void>;
    clearCart(req: any): Promise<void>;
}
