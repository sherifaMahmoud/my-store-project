import { Component, OnInit, OnDestroy, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';

import { DataService } from '../core/services/data.service';
import { ProductService } from '../core/services/product.service';
import { CartService } from '../core/services/cart.services';

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
  filteredProducts: any[] = [];

  isMobileView = false;
  currentUrl = '';

  products: any[] = [];

  constructor(
    private dataService: DataService,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {

    // cart count
    this.subscription = this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });

    // track route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentUrl = event.urlAfterRedirects;
      });

    this.checkViewport();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  // ============ SHOW / HIDE LOGIC ============
  isAuthPage(): boolean {
    return this.currentUrl.includes('login') || this.currentUrl.includes('register');
  }

  // ============ RESPONSIVE ============
  @HostListener('window:resize')
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

  // ============ SEARCH ============
  toggleSearch() {
    if (isPlatformBrowser(this.platformId)) {
      this.showSearch = !this.showSearch;

      if (!this.showSearch) {
        this.searchQuery = '';
        this.filteredProducts = [];
      }
    }
  }

  filterProducts() {
    if (!this.searchQuery) {
      this.filteredProducts = [...this.products];
      return;
    }

    const search = this.searchQuery.toLowerCase();

    this.filteredProducts = this.products.filter(p =>
      p.name?.toLowerCase().includes(search) ||
      p.description?.toLowerCase().includes(search)
    );
  }

  goToProduct(product: any) {
    console.log(product);
    this.showSearch = false;
    this.searchQuery = '';
    this.closeNavbar();
  }

  // ============ NAVBAR ============
  closeNavbar() {
    if (isPlatformBrowser(this.platformId)) {
      const navbar = document.getElementById('navbarCollapse');
      navbar?.classList.remove('show');
    }
  }

  // optional logout
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}