import { OrdersService } from './orders.service';
import { PlaceOrderDto } from './dto/place-order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    placeOrder(req: any, placeOrderDto: PlaceOrderDto): Promise<import("./schemas/order.schema").OrderDocument>;
    getMyOrders(req: any): Promise<import("./schemas/order.schema").OrderDocument[]>;
    getOrderById(req: any, id: string): Promise<import("./schemas/order.schema").OrderDocument>;
}
