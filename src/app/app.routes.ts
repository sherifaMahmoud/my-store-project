import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { StoreComponent } from './pages/store/store.component';
import { CartComponent } from './pages/cart/cart.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ThankfulPageComponent } from './pages/thankful-page/thankful-page.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { ConfirmPaymentComponent } from './pages/confirm-payment/confirm-payment.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { authGuard } from './auth/auth.guard';
export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // عامة
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // محمية
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'store', component: StoreComponent, canActivate: [authGuard] },
  { path: 'cart', component: CartComponent, canActivate: [authGuard] },
  { path: 'payment', component: PaymentComponent, canActivate: [authGuard] },
  { path: 'confirm-payment', component: ConfirmPaymentComponent, canActivate: [authGuard] },
  { path: 'thankful-page', component: ThankfulPageComponent, canActivate: [authGuard] },
  { path: 'product-details/:id', component: ProductDetailsComponent, canActivate: [authGuard] },
];
