import { Model } from 'mongoose';
import { OrderDocument } from './schemas/order.schema';
import { CartService } from '../cart/cart.service';
import { ProductsService } from '../products/products.service';
import { PlaceOrderDto } from './dto/place-order.dto';
export declare class OrdersService {
    private orderModel;
    private cartService;
    private productsService;
    constructor(orderModel: Model<OrderDocument>, cartService: CartService, productsService: ProductsService);
    placeOrder(userId: string, placeOrderDto: PlaceOrderDto): Promise<OrderDocument>;
    getMyOrders(userId: string): Promise<OrderDocument[]>;
    getOrderById(userId: string, orderId: string): Promise<OrderDocument>;
}
