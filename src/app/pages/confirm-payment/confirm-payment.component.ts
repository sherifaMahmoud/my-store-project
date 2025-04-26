import { Component } from '@angular/core';
import { FooterComponent } from '../../shared/footer/footer.component';
import { DataService } from '../../core/services/data.service';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-confirm-payment',
  imports: [FooterComponent, RouterLink],
  standalone : true,
  templateUrl: './confirm-payment.component.html',
  styleUrls: ['./confirm-payment.component.css']
})
export class ConfirmPaymentComponent {
  constructor(public dataService: DataService) {}

  clearCart() {
    this.dataService.getCartItems().forEach(item => {
      this.dataService.removeFromCart(item);
    });
  }
}
