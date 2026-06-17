import { Document, Types } from 'mongoose';
export type CartDocument = Cart & Document;
export declare class Cart {
    userId: Types.ObjectId;
    productId: Types.ObjectId;
    quantity: number;
}
export declare const CartSchema: import("mongoose").Schema<Cart, import("mongoose").Model<Cart, any, any, any, any, any, Cart>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Cart, Document<unknown, {}, Cart, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Cart & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Cart, Document<unknown, {}, Cart, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Cart & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    productId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Cart, Document<unknown, {}, Cart, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Cart & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    quantity?: import("mongoose").SchemaDefinitionProperty<number, Cart, Document<unknown, {}, Cart, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Cart & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Cart>;
