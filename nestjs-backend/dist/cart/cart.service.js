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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const cart_schema_1 = require("./schemas/cart.schema");
const products_service_1 = require("../products/products.service");
let CartService = class CartService {
    cartModel;
    productsService;
    constructor(cartModel, productsService) {
        this.cartModel = cartModel;
        this.productsService = productsService;
    }
    async addToCart(userId, addToCartDto) {
        const { productId, quantity } = addToCartDto;
        const product = await this.productsService.findOne(productId);
        const userObjId = new mongoose_2.Types.ObjectId(userId);
        const productObjId = new mongoose_2.Types.ObjectId(productId);
        const existingCartItem = await this.cartModel.findOne({ userId: userObjId, productId: productObjId }).exec();
        const targetQuantity = existingCartItem
            ? existingCartItem.quantity + quantity
            : quantity;
        if (product.stock < targetQuantity) {
            throw new common_1.BadRequestException(`Insufficient stock. Available: ${product.stock}, Requested in cart: ${targetQuantity}`);
        }
        if (existingCartItem) {
            existingCartItem.quantity = targetQuantity;
            return existingCartItem.save();
        }
        else {
            const newCartItem = new this.cartModel({
                userId: userObjId,
                productId: productObjId,
                quantity,
            });
            return newCartItem.save();
        }
    }
    async viewCart(userId) {
        const userObjId = new mongoose_2.Types.ObjectId(userId);
        const items = await this.cartModel
            .find({ userId: userObjId })
            .populate('productId')
            .exec();
        const validItems = items.filter(item => item.productId !== null);
        let totalPrice = 0;
        const formattedItems = validItems.map(item => {
            const product = item.productId;
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
    async updateQuantity(userId, productId, quantity) {
        const product = await this.productsService.findOne(productId);
        if (product.stock < quantity) {
            throw new common_1.BadRequestException(`Insufficient stock. Available: ${product.stock}`);
        }
        const userObjId = new mongoose_2.Types.ObjectId(userId);
        const productObjId = new mongoose_2.Types.ObjectId(productId);
        const cartItem = await this.cartModel.findOne({ userId: userObjId, productId: productObjId }).exec();
        if (!cartItem) {
            throw new common_1.NotFoundException('Product not found in your cart');
        }
        cartItem.quantity = quantity;
        return cartItem.save();
    }
    async removeFromCart(userId, productId) {
        const userObjId = new mongoose_2.Types.ObjectId(userId);
        const productObjId = new mongoose_2.Types.ObjectId(productId);
        const result = await this.cartModel.deleteOne({ userId: userObjId, productId: productObjId }).exec();
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException('Product not found in your cart');
        }
    }
    async clearCart(userId) {
        const userObjId = new mongoose_2.Types.ObjectId(userId);
        await this.cartModel.deleteMany({ userId: userObjId }).exec();
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(cart_schema_1.Cart.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        products_service_1.ProductsService])
], CartService);
//# sourceMappingURL=cart.service.js.map