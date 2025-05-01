import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { StoreComponent } from './pages/store/store.component';
import { CartComponent } from './pages/cart/cart.component';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/register/register.component';
import { ThankfulPageComponent } from './pages/thankful-page/thankful-page.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { ConfirmPaymentComponent } from './pages/confirm-payment/confirm-payment.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'store', component: StoreComponent },
  { path: 'cart', component: CartComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'thank-you', component: ThankfulPageComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'confirm-payment', component: ConfirmPaymentComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
