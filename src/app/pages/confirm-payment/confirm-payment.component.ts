import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-payment.component.html',
  styleUrls: ['./confirm-payment.component.css']
})
export class ConfirmPaymentComponent {
  deliveryInfo: any;

  constructor(
    public dataService: DataService,
    private router: Router
  ) {
    const nav = this.router.getCurrentNavigation();
    this.deliveryInfo = nav?.extras?.state?.['deliveryInfo'];

    if (!this.deliveryInfo) {
      this.router.navigate(['/']);
    }
  }

  get cartItems() {
    return this.dataService.getCartItems();
  }

  get cartTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  confirmOrder() {
    this.dataService.clearCart();
    this.router.navigate(['/thankful-page']);
  }

  cancelOrder() {
    this.router.navigate(['/cart']);
  }
}
