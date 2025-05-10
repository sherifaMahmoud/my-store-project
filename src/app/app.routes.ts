import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { StoreComponent } from './pages/store/store.component';
import { CartComponent } from './pages/cart/cart.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ThankfulPageComponent } from './pages/thankful-page/thankful-page.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { ConfirmPaymentComponent } from './pages/confirm-payment/confirm-payment.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';


export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'store', component: StoreComponent },
  { path: 'cart', component: CartComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'thankful-page', component: ThankfulPageComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'confirm-payment', component: ConfirmPaymentComponent },
  { path: 'product-details/:id', component: ProductDetailsComponent },
];
