"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_schema_1 = require("./schemas/order.schema");
const cart_service_1 = require("../cart/cart.service");
const products_service_1 = require("../products/products.service");
let OrdersService = class OrdersService {
    orderModel;
    cartService;
    productsService;
    constructor(orderModel, cartService, productsService) {
        this.orderModel = orderModel;
        this.cartService = cartService;
        this.productsService = productsService;
    }
    async placeOrder(userId, placeOrderDto) {
        const cart = await this.cartService.viewCart(userId);
        if (!cart.items || cart.items.length === 0) {
            throw new common_1.BadRequestException('Your shopping cart is empty');
        }
        const orderItems = [];
        for (const item of cart.items) {
            const product = await this.productsService.findOne(item.productId.toString());
            if (product.stock < item.quantity) {
                throw new common_1.BadRequestException(`Product ${product.name} is out of stock. Available: ${product.stock}, Requested: ${item.quantity}`);
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
        const userObjId = new mongoose_2.Types.ObjectId(userId);
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
    async getMyOrders(userId) {
        const userObjId = new mongoose_2.Types.ObjectId(userId);
        return this.orderModel.find({ userId: userObjId }).sort({ createdAt: -1 }).exec();
    }
    async getOrderById(userId, orderId) {
        const order = await this.orderModel.findById(orderId).exec();
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${orderId} not found`);
        }
        if (order.userId.toString() !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to view this order');
        }
        return order;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        cart_service_1.CartService,
        products_service_1.ProductsService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map