import { Component, OnInit, OnDestroy, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DataService } from '../core/services/data.service';
import { Subscription } from 'rxjs';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../core/services/product.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  cartCount = 0;
  private subscription!: Subscription;

  showSearch = false;
  searchQuery = '';
  allProducts: string[] = ['خمار', 'إدناء', 'فستان', 'نقاب', 'إكسسوار'];
  filteredProducts: string[] = [];
  isMobileView = false;
  products: any[] = [];

  constructor(
    private dataService: DataService,
    private router: Router,
    private productService: ProductService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    this.checkViewport();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkViewport();
  }

  checkViewport() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobileView = window.innerWidth < 992;
      if (!this.isMobileView) {
        this.showSearch = false;
        this.searchQuery = '';
        this.filteredProducts = [];
      }
    }
  }

  toggleSearch() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.isMobileView || window.innerWidth >= 992) {
        this.showSearch = !this.showSearch;
        if (!this.showSearch) {
          this.searchQuery = '';
          this.filteredProducts = [];
        }
      }
    }
  }

  filterProducts() {
    if (!this.searchQuery) {
      this.filteredProducts = [...this.products];
      return;
    }

    const search = this.searchQuery.toLowerCase();
    this.filteredProducts = this.products.filter(
      (product) =>
        (product.name && product.name.toLowerCase().includes(search)) ||
        (product.description && product.description.toLowerCase().includes(search))
    );
  }

  goToProduct(product: string) {
    console.log('تم اختيار المنتج:', product);
    this.showSearch = false;
    this.searchQuery = '';
    this.closeNavbar();
  }

  closeNavbar() {
    if (isPlatformBrowser(this.platformId)) {
      const navbar = document.getElementById('navbarCollapse');
      if (navbar?.classList.contains('show')) {
        navbar.classList.remove('show');
      }
    }
  }
}