import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CartService {

    cartItems: any[] = [];

    private cartCount = new BehaviorSubject<number>(0);

    cartCount$ = this.cartCount.asObservable();

    addToCart(product: any): void {

        const existingItem = this.cartItems.find(
            item => item.productId === product.productId
        );

        if (existingItem) {

            existingItem.quantity += 1;

            existingItem.totalPrice =
                existingItem.quantity * existingItem.price;

        } else {

            const newItem = {
                ...product,
                quantity: 1,
                totalPrice: product.price
            };

            this.cartItems.push(newItem);
        }

        this.updateCartCount();
    }

    removeFromCart(index: number): void {

        const item = this.cartItems[index];

        if (item.quantity > 1) {

            item.quantity -= 1;

            item.totalPrice =
                item.quantity * item.price;

        } else {

            this.cartItems.splice(index, 1);
        }

        this.updateCartCount();
    }

    deleteItem(index: number): void {

        this.cartItems.splice(index, 1);

        this.updateCartCount();
    }

    clearCart(): void {

        this.cartItems = [];

        this.updateCartCount();
    }

    getCartItems() {

        return this.cartItems;
    }

    updateCartCount(): void {

        const totalCount = this.cartItems.reduce(
            (total, item) => total + item.quantity,
            0
        );

        this.cartCount.next(totalCount);
    }
}