import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalAmount: number = 0;
  constructor(private dataService: DataService) {}
  ngOnInit(): void {
    window.scrollTo(0, 0);

    this.cartItems = this.dataService.getCartItems();
    console.log(this.cartItems);

    this.cartItems.map((i) =>{
      this.totalAmount +=i.totalPrice;
    })
  }

  additemToCart(item: any) {
    this.dataService.addToCart(item);
    this.totalAmount = 0;
    this.updateItems();
  }
  removeItem(item: any): void {
    this.dataService.removeItemFromCart(item);
    this.updateItems();
  }
  updateItems() {
    this.cartItems = this.dataService.getCartItems();
    this.totalAmount =0 ;
    this.cartItems.map((i) =>{
      this.totalAmount +=i.totalPrice;
    })
  }
  clearAllCart() {
    this.dataService.clearCart();
    this.cartItems = [];
    this.totalAmount = 0;
  }
  removeFromCart(item: any): void {
    this.dataService.removeFromCart(item);
    this.updateItems();
  }

}
