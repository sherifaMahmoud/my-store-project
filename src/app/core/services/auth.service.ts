import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5095/api/auth';
  private tokenKey = 'auth_token';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}
  // استخراج التوكن من URL إن وجد
  initializeTokenFromUrl(): void {
    const url = new URL(window.location.href);
    const token = url.searchParams.get('token');

    if (token) {
      this.storeToken(token);
      // إزالة التوكن من URL دون إعادة تحميل الصفحة
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }

  storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }
}
