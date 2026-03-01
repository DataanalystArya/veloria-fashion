import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CartItem {
    size: string;
    productId: bigint;
    quantity: bigint;
}
export interface Order {
    id: bigint;
    status: string;
    principal: Principal;
    total: number;
    paymentMethod: string;
    createdAt: bigint;
    items: Array<CartItem>;
}
export interface Product {
    id: bigint;
    originalPrice: number;
    name: string;
    description: string;
    sizes: Array<string>;
    imageUrl: string;
    isFeatured: boolean;
    discount: bigint;
    category: string;
    isNew: boolean;
    price: number;
}
export interface backendInterface {
    addCartItem(item: CartItem): Promise<void>;
    addProduct(product: Product): Promise<void>;
    addToWishlist(productId: bigint): Promise<void>;
    clearCart(): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getCartItems(): Promise<Array<CartItem>>;
    getCategoryProducts(category: string): Promise<Array<Product>>;
    getFeaturedProducts(): Promise<Array<Product>>;
    getNewArrivals(): Promise<Array<Product>>;
    getProduct(id: bigint): Promise<Product>;
    getUserOrders(): Promise<Array<Order>>;
    getWishlist(): Promise<Array<bigint>>;
    isInWishlist(productId: bigint): Promise<boolean>;
    placeOrder(paymentMethod: string): Promise<Order>;
    removeCartItem(productId: bigint): Promise<void>;
    removeFromWishlist(productId: bigint): Promise<void>;
    searchProducts(keyword: string): Promise<Array<Product>>;
    updateCartItem(productId: bigint, newQuantity: bigint): Promise<void>;
}
