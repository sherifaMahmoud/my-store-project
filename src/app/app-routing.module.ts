import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { StoreComponent } from './pages/store/store.component';
import { CartComponent } from './pages/cart/cart.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ThankfulPageComponent } from './pages/thankful-page/thankful-page.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { ConfirmPaymentComponent } from './pages/confirm-payment/confirm-payment.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';

const routes: Routes = [
  { path: '', component: HomeComponent }, // الصفحة الرئيسية
  { path: 'store', component: StoreComponent }, // صفحة المتجر
  { path: 'cart', component: CartComponent }, // صفحة العربة
  { path: 'login', component: LoginComponent }, // صفحة تسجيل الدخول
  { path: 'signup', component: RegisterComponent }, // صفحة التسجيل
  { path: 'thank-you', component: ThankfulPageComponent }, // صفحة الشكر
  { path: 'payment', component: PaymentComponent }, // صفحة الدفع
  { path: 'confirm-payment', component: ConfirmPaymentComponent }, // صفحة تأكيد الدفع
  { path: 'product-details/:id', component: ProductDetailsComponent }, // صفحة تفاصيل المنتج
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // تحميل التوجيهات
  exports: [RouterModule], // تصدير التوجيهات لاستخدامها في مكونات أخرى
})
export class AppRoutingModule {}
