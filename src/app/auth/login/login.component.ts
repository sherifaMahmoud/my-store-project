import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { Router, RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements AfterViewInit {
  logined: boolean = false;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  loginForm = new FormGroup({
    userName: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
    ]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  constructor(
    private dataService: DataService,
    private _Router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.checkLoginStatus();
  }

  login() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'يرجى التأكد من إدخال اسم المستخدم وكلمة المرور بشكل صحيح.';
      return;
    }

    this.isLoading = true;
    const credentials = this.loginForm.value;

    this.dataService.loginUser(credentials).subscribe({
      next: (data) => {
        this.isLoading = false;
        if (data.message === 'Login successful') {
          this.dataService.setToken(data.token, data.role);
          this.dataService.isLogined.next(true);

          if (data.role === 'admin') {
            this._Router.navigate(['/home']); // أو أي route تاني عندك
          } else {
            this._Router.navigate(['/home']);
          }
        } else {
          this.errorMessage = 'المستخدم غير موجود أو البيانات غير صحيحة.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('❌ Login failed:', err);
        this.errorMessage = 'حدث خطأ في الاتصال بالسيرفر. تحقق من أن الـ API يعمل.';
      },
    });
  }

  async ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const ScrollReveal = (await import('scrollreveal')).default;
      ScrollReveal().reveal('.reveal-from-top', {
        reset: true,
        delay: 100,
        distance: '50px',
        duration: 1000,
        origin: 'top',
        easing: 'ease-in-out',
      });
      ScrollReveal().reveal('.reveal-from-bottom', {
        reset: true,
        delay: 100,
        distance: '50px', // ✅ اتصلحت
        duration: 1000,
        origin: 'bottom',
        easing: 'ease-in-out',
      });
    }
  }

  checkLoginStatus() {
    const token = this.dataService.getToken();
    const isAdmin = this.dataService.isAdmin();
    console.log('Is token stored?', token ? 'Yes' : 'No');
    console.log('Is admin logged in?', isAdmin ? 'Yes' : 'No');
    this.dataService.isLogined.subscribe((isLoggedIn) => {
      console.log('Is user logged in?', isLoggedIn);
    });
  }

}
