import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-payment.component.html',
  styleUrls: ['./confirm-payment.component.css'],
})
export class ConfirmPaymentComponent {
  deliveryInfo: any;
successMessage: string = '';
  constructor(public dataService: DataService, private router: Router) {
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

message: string = '';
isSubmitting = false;

confirmOrder() {
  const order = {
    createdDate: new Date(),
    totalPrice: this.cartTotal,
    userName: this.deliveryInfo.fullName,
    phoneNumber: this.deliveryInfo.phoneNumber,
    address: this.deliveryInfo.detailedAddress,
    governorate: this.deliveryInfo.governorate,
    orderItems: this.cartItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      totalPrice: item.totalPrice
    }))
  };

  this.dataService.placeOrder(order).subscribe({
    next: res => {
      this.successMessage = 'تم تأكيد الطلب! سيتم التوصيل خلال ٤٨ ساعة.';
      this.dataService.clearCart();
      setTimeout(() => this.router.navigate(['/thankful-page']), 2000);
    },
    error: err => {
      console.error('فشل في إرسال الطلب', err);
    }
  });
}



  cancelOrder() {
    this.router.navigate(['/cart']);
  }
}
