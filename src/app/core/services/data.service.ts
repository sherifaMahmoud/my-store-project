import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private cartItems = new BehaviorSubject<any[]>([]);
  private cartItemCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartItemCount.asObservable();
  isLogined = new BehaviorSubject<boolean>(false);

  constructor(
    private _HttpClient: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const cart = this.getCartItemsFromStorage();
    if (cart) {
      this.cartItems.next(cart);
      this.cartItemCount.next(this.getTotalCount(cart));
    }
  }

  getCartItems(): any[] {
    return this.cartItems.value;
  }

  addToCart(item: any) {
    const foundItem = this.cartItems.value.find(p => p.id === item.id);
    let updatedCart;

    if (foundItem) {
      foundItem.quantity += 1;
      foundItem.totalPrice = item.price * foundItem.quantity;
      updatedCart = [...this.cartItems.value];
    } else {
      const newItem = { ...item, quantity: 1, totalPrice: item.price };
      updatedCart = [...this.cartItems.value, newItem];
    }

    this.cartItems.next(updatedCart);
    this.cartItemCount.next(this.getTotalCount(updatedCart));
    this.setCartItemsToStorage(updatedCart);
  }

  removeItemFromCart(item: any) {
    const foundItem = this.cartItems.value.find(p => p.id === item.id);
    let updatedCart = [...this.cartItems.value];

    if (foundItem) {
      if (foundItem.quantity > 1) {
        foundItem.quantity -= 1;
        foundItem.totalPrice = item.price * foundItem.quantity;
      } else {
        updatedCart = updatedCart.filter(p => p.id !== item.id);
      }
    }

    this.cartItems.next(updatedCart);
    this.cartItemCount.next(this.getTotalCount(updatedCart));
    this.setCartItemsToStorage(updatedCart);
  }

  removeFromCart(item: any) {
    const updated = this.cartItems.value.filter(product => product.id !== item.id);
    this.cartItems.next(updated);
    this.cartItemCount.next(this.getTotalCount(updated));
    this.setCartItemsToStorage(updated);
  }

  clearCart() {
    this.cartItems.next([]);
    this.cartItemCount.next(0);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem("cartItems");
    }
  }

  getNewItems(): Observable<any> {
    return this._HttpClient.get('http://localhost:7248/api/Products');
  }

  viewItemDetails(id: number): Observable<any> {
    return this._HttpClient.get(`http://localhost:7248/api/Products/${id}`);
  }

  loginUser(data: any): Observable<any> {
    return this._HttpClient.post('https://fatmaessa-001-site1.anytempurl.com/api/Account/Login', data);
  }

  registerUser(data: any): Observable<any> {
    return this._HttpClient.post('https://fatmaessa-001-site1.anytempurl.com/api/Account/Register', data);
  }


  getAllProducts(): Observable<any[]> {
    return this._HttpClient.get<any[]>('http://localhost:7248/api/Products');
  }

  private setCartItemsToStorage(cart: any[]) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem("cartItems", JSON.stringify(cart));
    }
  }

  private getCartItemsFromStorage(): any[] {
    if (isPlatformBrowser(this.platformId)) {
      const value = localStorage.getItem("cartItems");
      return value ? JSON.parse(value) : [];
    }
    return [];
  }

  private getTotalCount(cart: any[]): number {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }



}
