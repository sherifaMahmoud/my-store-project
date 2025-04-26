
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ]
})
export class PaymentComponent {
  deliveryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dataService: DataService,
    private router: Router
  ) {
    this.deliveryForm = this.fb.group({
      fullName: ['', Validators.required],
      governorate: ['', Validators.required],
      detailedAddress: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      additionalPhone: [''],
      additionalInfo: ['']
    });
  }

  get cartTotal(): number {
    return this.dataService.getCartItems().reduce(
      (sum, item) => sum + item.totalPrice, 0
    );
  }

  onSubmit() {
    if (this.deliveryForm.valid) {
      const deliveryInfo = this.deliveryForm.value;
      this.router.navigate(['/confirm-payment'], { state: { deliveryInfo } });
    } else {
      Object.keys(this.deliveryForm.controls).forEach(key => {
        const control = this.deliveryForm.get(key);
        control?.markAsTouched();
      });
    }
  }}
