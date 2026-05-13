import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.services';

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

  selectedCategories: string[] = [];
  selectedPriceRanges: string[] = [];
  selectedColors: string[] = [];

  constructor(
    private dataService: DataService,
    private cartService: CartService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }

    this.dataService.getNewItems().subscribe((data: any[]) => {

      this.products = data.filter(
        (product) =>
          product.isActive === true &&
          product.stockQuantity > 0
      );
      this.categories = [...new Set(data.map((p) => p.categoryName))];

      this.colors = [...new Set(data.map((p) => p.color))];

      this.priceRanges = this.generatePriceRanges(data);

      this.loadMore();
    });
  }

  generatePriceRanges(products: any[]): string[] {

    const prices = products.map((p) => p.price);

    const min = Math.min(...prices);

    const max = Math.max(...prices);

    const ranges = [];

    const step = Math.ceil((max - min) / 4);

    for (let i = min; i < max; i += step) {
      ranges.push(`${i}-${i + step} ج`);
    }

    return ranges;
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

    if (product.stockQuantity > 0) {

      // يضيف للسلة
      this.cartService.addToCart(product);

      // يقلل الكمية
      product.stockQuantity--;

      // لو خلص يشيله من الصفحة
      if (product.stockQuantity === 0) {

        this.products =
          this.products.filter(
            p => p.productId !== product.productId
          );

        this.visibleProducts =
          this.visibleProducts.filter(
            p => p.productId !== product.productId
          );
      }
    }
  }

  filterProducts() {

    let filtered = this.products;

    if (this.selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        this.selectedCategories.includes(p.categoryName)
      );
    }

    if (this.selectedPriceRanges.length > 0) {

      filtered = filtered.filter((product) => {

        const price = product.price;

        return this.selectedPriceRanges.some((range) => {

          const [min, max] = range
            .split('-')
            .map((n) => parseInt(n.replace(' ج', '').trim(), 10));

          return price >= min && (max ? price <= max : true);
        });
      });
    }

    if (this.selectedColors.length > 0) {
      filtered = filtered.filter((p) =>
        this.selectedColors.includes(p.color)
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

    index === -1
      ? this.selectedCategories.push(category)
      : this.selectedCategories.splice(index, 1);

    this.resetVisible();
  }

  togglePriceRange(price: string) {

    const index = this.selectedPriceRanges.indexOf(price);

    index === -1
      ? this.selectedPriceRanges.push(price)
      : this.selectedPriceRanges.splice(index, 1);

    this.resetVisible();
  }

  toggleColor(color: string) {

    const index = this.selectedColors.indexOf(color);

    index === -1
      ? this.selectedColors.push(color)
      : this.selectedColors.splice(index, 1);

    this.resetVisible();
  }

  resetVisible() {

    this.currentIndex = 0;

    this.visibleProducts = this.filterProducts().slice(
      0,
      this.productsPerPage
    );

    this.currentIndex = this.productsPerPage;
  }
}