import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.services';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {

  cartItems: any[] = [];

  totalAmount: number = 0;

  constructor(
    private cartService: CartService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }

    this.updateItems();
  }

  additemToCart(item: any): void {

    this.cartService.addToCart(item);

    this.updateItems();
  }

  removeItem(index: number): void {

    this.cartService.removeFromCart(index);

    this.updateItems();
  }

  updateItems(): void {

    this.cartItems = this.cartService.getCartItems();

    this.totalAmount = 0;

    this.cartItems.forEach((item) => {

      this.totalAmount += item.totalPrice;
    });
  }

  clearAllCart(): void {

    this.cartService.clearCart();

    this.cartItems = [];

    this.totalAmount = 0;
  }
  deleteItem(index: number): void {

    this.cartItems.splice(index, 1);

    this.updateItems();

    this.cartService.updateCartCount();
  }
}