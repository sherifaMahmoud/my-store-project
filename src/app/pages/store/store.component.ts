import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [ CommonModule, RouterLink],
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {
  products: any[] = [];
  visibleProducts: any[] = [];
  productsPerPage = 6;
  currentIndex = 0;

  sortOptions = ['الأحدث', 'الأكثر بيعًا', 'التوافر', 'السعر من الأقل للأعلى', 'السعر من الأعلى للأقل'];
  categories = ['فساتين', 'إدناءات', 'خمارات', 'نقاب', 'إكسسوارات'];
  prices = ['0-100 ج', '100-250 ج', '250-400 ج', '400-700 ج', '+700 ج'];
  colors = ['أحمر', 'أزرق', 'وردي', 'رمادي', 'أبيض'];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.dataService.getNewItems().subscribe((data: any[]) => {
      console.log('البيانات اللي جت:', data); // <-- هنا
      this.products = data;
      this.loadMore();
    });
  }


  loadMore() {
    const nextProducts = this.products.slice(this.currentIndex, this.currentIndex + this.productsPerPage);
    this.visibleProducts = [...this.visibleProducts, ...nextProducts];
    this.currentIndex += this.productsPerPage;
  }

  addToCart(product: any) {
    this.dataService.addToCart(product);
  }
}
