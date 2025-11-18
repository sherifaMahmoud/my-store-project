import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
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

    // تحقق من وجود توكن عند بدء التشغيل
    if (this.isPlatformBrowser()) {
      this.isLogined.next(!!this.getToken());
    }
  }

  // ============ Token Management ============
  setToken(token: string, role: string): void {
    if (this.isPlatformBrowser()) {
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      this.isLogined.next(true);
    }
  }

  getToken(): string | null {
    if (this.isPlatformBrowser()) {
      return localStorage.getItem('token'); // تأكدي هنا
    }
    return null;
  }

  getRole(): string | null {
    if (this.isPlatformBrowser()) {
      return localStorage.getItem('role');
    }
    return null;
  }

  removeToken(): void {
    if (this.isPlatformBrowser()) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      this.isLogined.next(false);
    }
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  // ============ Auth Headers ============
  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // ============ Authentication Methods ============
  loginUser(data: any): Observable<any> {
    return this._HttpClient.post(
      'http://localhost:5095/api/Account/Login',
      data
    );
  }

  registerUser(data: any): Observable<any> {
    return this._HttpClient.post(
      'http://localhost:5095/api/Account/Register',
      data
    );
  }

  logout(): void {
    this.removeToken();
    this.clearCart();
  }

  // ============ Protected API Calls ============
  getNewItems(): Observable<any> {
    return this._HttpClient.get('http://localhost:5095/api/Products', {
      headers: this.getAuthHeaders(),
    });
  }
  getOffers() {
    return this._HttpClient.get<any[]>('http://localhost:5095/api/Offers');
  }

  getProductById(productId: number) {
    return this._HttpClient.get<any>(
      `http://localhost:5095/api/Products/${productId}`
    );
  }

  viewItemDetails(id: any): Observable<any> {
    return this._HttpClient.get(`http://localhost:5095/api/Products/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getAllProducts(): Observable<any[]> {
    return this._HttpClient.get<any[]>('http://localhost:5095/api/Products', {
      headers: this.getAuthHeaders(),
    });
  }

  searchProducts(query: string): Observable<any[]> {
    return this._HttpClient.get<any[]>(
      `http://localhost:5000/api/products/search?query=${query}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  // ============ Cart Methods ============
  getCartItems(): any[] {
    return this.cartItems.value;
  }

  // addToCart(item: any) {
  //   const foundItem = this.cartItems.value.find(p => p.productId === item.productId);
  //   let updatedCart;

  //   if (foundItem) {
  //     foundItem.quantity += 1;
  //     foundItem.totalPrice = item.price * foundItem.quantity;
  //     updatedCart = [...this.cartItems.value];
  //   } else {
  //     const newItem = { ...item, quantity: 1, totalPrice: item.price };
  //     updatedCart = [...this.cartItems.value, newItem];
  //   }

  //   this.cartItems.next(updatedCart);
  //   this.cartItemCount.next(this.getTotalCount(updatedCart));
  //   this.setCartItemsToStorage(updatedCart);
  // }
  addToCart(item: any) {
    const foundItem = this.cartItems.value.find(
      (p) => p.productId === item.productId
    );
    let updatedCart;

    // حساب السعر بعد الخصم إذا كان موجودًا
    const priceAfterDiscount = item.discount
      ? item.price - (item.price * item.discount) / 100
      : item.price;

    if (foundItem) {
      foundItem.quantity += 1;
      foundItem.totalPrice = priceAfterDiscount * foundItem.quantity; // السعر بعد الخصم
      updatedCart = [...this.cartItems.value];
    } else {
      const newItem = {
        ...item,
        quantity: 1,
        totalPrice: priceAfterDiscount, // السعر بعد الخصم عند إضافة العنصر
      };
      updatedCart = [...this.cartItems.value, newItem];
    }

    this.cartItems.next(updatedCart);
    this.cartItemCount.next(this.getTotalCount(updatedCart));
    this.setCartItemsToStorage(updatedCart);
  }

  removeItemFromCart(item: any) {
    const foundItem = this.cartItems.value.find(
      (p) => p.productId === item.productId
    );
    let updatedCart = [...this.cartItems.value];

    if (foundItem) {
      if (foundItem.quantity > 1) {
        foundItem.quantity -= 1;
        foundItem.totalPrice = item.price * foundItem.quantity;
      } else {
        updatedCart = updatedCart.filter((p) => p.productId !== item.productId);
      }
    }

    this.cartItems.next(updatedCart);
    this.cartItemCount.next(this.getTotalCount(updatedCart));
    this.setCartItemsToStorage(updatedCart);
  }

  removeFromCart(item: any) {
    const updated = this.cartItems.value.filter(
      (product) => product.productId !== item.productId
    );
    this.cartItems.next(updated);
    this.cartItemCount.next(this.getTotalCount(updated));
    this.setCartItemsToStorage(updated);
  }

  clearCart() {
    this.cartItems.next([]);
    this.cartItemCount.next(0);
    this.setCartItemsToStorage([]);
  }
  // ============ Orders ============
  saveOrder(order: any): Observable<any> {
    return this._HttpClient.post('http://localhost:5095/api/Order', order, {
      headers: this.getAuthHeaders(),
    });
  }
  placeOrder(order: any): Observable<any> {
    return this._HttpClient.post('http://localhost:5095/api/Order', order, {
      headers: this.getAuthHeaders(),
    });
  }

  // ============ Helper Methods ============
  private setCartItemsToStorage(cart: any[]) {
    if (this.isPlatformBrowser()) {
      localStorage.setItem('cartItems', JSON.stringify(cart));
    }
  }

  private getCartItemsFromStorage(): any[] {
    if (this.isPlatformBrowser()) {
      const value = localStorage.getItem('cartItems');
      return value ? JSON.parse(value) : [];
    }
    return [];
  }

  private getTotalCount(cart: any[]): number {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  private isPlatformBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
