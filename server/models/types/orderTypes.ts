import { GenericProduct } from "./productTypes";
import { User } from "./userTypes";

export interface Product {
    product: GenericProduct;
    quantity: number;
};

export interface Order {
    products: Product[];
    user: User;
};