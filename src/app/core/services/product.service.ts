import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/api/Products`; // ✅ بدل الـ localhost

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addProduct(formData: FormData, headers?: HttpHeaders): Observable<any> {
    return this.http.post(this.apiUrl, formData, { headers });
  }

  deleteProduct(id: number, headers?: HttpHeaders): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }
}
