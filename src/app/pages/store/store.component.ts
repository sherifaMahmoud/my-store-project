import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css'],
})
export class StoreComponent implements OnInit {
  products: any[] = [];
  visibleProducts: any[] = [];
  productsPerPage = 6;
  currentIndex = 0;
  priceRanges: string[] = [];

  categories = ['فساتين', 'إدناءات', 'خمارات', 'نقاب', 'إكسسوارات'];
  prices = ['0-100 ج', '100-250 ج', '250-400 ج', '400-700 ج', '+700 ج'];
  colors = ['أحمر', 'أزرق', 'وردي', 'رمادي', 'أبيض'];

  selectedSort: string = '';
  selectedCategories: string[] = []; // مصفوفة جديدة
  selectedPriceRanges: string[] = []; // مصفوفة جديدة
  selectedColors: string[] = []; // مصفوفة جديدة

  constructor(private dataService: DataService) {}
  generatePriceRanges(products: any[]): string[] {
    const prices = products.map((p) => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    const ranges = [];
    const step = Math.ceil((max - min) / 4);

    for (let i = min; i < max; i += step) {
      const to = i + step;
      ranges.push(`${i}-${to} ج`);
    }

    return ranges;
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.dataService.getNewItems().subscribe((data: any[]) => {
      this.products = data;

      // استخراج التصنيفات من المنتجات بدل ما تكون ثابتة
      this.categories = [...new Set(data.map((p) => p.categoryName))];
      this.colors = [...new Set(data.map((p) => p.color))];
      this.priceRanges = this.generatePriceRanges(data); // هنوضحها تحت

      this.loadMore();
    });
  }

  loadMore() {
    const filteredProducts = this.filterProducts();
    const nextProducts = filteredProducts.slice(
      this.currentIndex,
      this.currentIndex + this.productsPerPage
    );
    this.visibleProducts = [...this.visibleProducts, ...nextProducts];
    this.currentIndex += this.productsPerPage;
  }

  addToCart(product: any) {
    this.dataService.addToCart(product);
  }

  filterProducts() {
    let filtered = this.products;

    if (this.selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        this.selectedCategories.includes(product.categoryName)
      );
    }

    if (this.selectedPriceRanges.length > 0) {
      filtered = filtered.filter((product) => {
        const price = product.price;
        return this.selectedPriceRanges.some((range) => {
          const [min, max] = range
            .split('-')
            .map((num) => parseInt(num.replace(' ج', '').trim(), 10));
          return price >= min && (max ? price <= max : true);
        });
      });
    }

    if (this.selectedColors.length > 0) {
      filtered = filtered.filter((product) =>
        this.selectedColors.includes(product.color)
      );
    }

    return this.sortProducts(filtered);
  }

  sortProducts(products: any[]) {
    switch (this.selectedSort) {
      case 'الأحدث':
        return products.sort((a, b) => b.id - a.id);
      case 'الأكثر بيعًا':
        return products.sort((a, b) => b.sales - a.sales);
      case 'التوافر':
        return products.sort((a, b) => b.stock - a.stock);
      case 'السعر من الأقل للأعلى':
        return products.sort((a, b) => a.price - b.price);
      case 'السعر من الأعلى للأقل':
        return products.sort((a, b) => b.price - a.price);
      default:
        return products;
    }
  }

  toggleCategory(category: string) {
    const index = this.selectedCategories.indexOf(category);
    if (index === -1) {
      this.selectedCategories.push(category);
    } else {
      this.selectedCategories.splice(index, 1);
    }

    this.currentIndex = 0;
    const filtered = this.filterProducts();
    this.visibleProducts = filtered.slice(0, this.productsPerPage);
    this.currentIndex = this.productsPerPage;
  }

  togglePriceRange(price: string) {
    const index = this.selectedPriceRanges.indexOf(price);
    if (index === -1) {
      this.selectedPriceRanges.push(price);
    } else {
      this.selectedPriceRanges.splice(index, 1);
    }

    this.currentIndex = 0;
    const filtered = this.filterProducts();
    this.visibleProducts = filtered.slice(0, this.productsPerPage);
    this.currentIndex = this.productsPerPage;
  }

  toggleColor(color: string) {
    const index = this.selectedColors.indexOf(color);
    if (index === -1) {
      this.selectedColors.push(color);
    } else {
      this.selectedColors.splice(index, 1);
    }

    this.currentIndex = 0;
    const filtered = this.filterProducts();
    this.visibleProducts = filtered.slice(0, this.productsPerPage);
    this.currentIndex = this.productsPerPage;
  }
}
