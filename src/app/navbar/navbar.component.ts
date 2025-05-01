import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { DataService } from '../core/services/data.service';
import { Subscription } from 'rxjs';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  cartCount = 0;
  private subscription!: Subscription;

  showSearch = false;
  searchQuery = '';
  allProducts: string[] = ['خمار', 'إدناء', 'فستان', 'نقاب', 'إكسسوار'];
  filteredProducts: string[] = [];
  isMobileView = false; // متغير جديد لتحديد وضع الجوال

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.subscription = this.dataService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });
    this.checkViewport(); // التحقق من حجم الشاشة عند التهيئة
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkViewport(); // التحقق من حجم الشاشة عند تغيير الحجم
  }

  checkViewport() {
    this.isMobileView = window.innerWidth < 992; // Bootstrap lg breakpoint
    if (!this.isMobileView) {
      this.showSearch = false; // إخفاء البحث عند التوسيع لشاشة كبيرة
      this.searchQuery = '';
      this.filteredProducts = [];
    }
  }

  toggleSearch() {
    // إذا كان في وضع الجوال أو في شاشة كبيرة
    if (this.isMobileView || window.innerWidth >= 992) {
      this.showSearch = !this.showSearch;
      if (!this.showSearch) {
        this.searchQuery = '';
        this.filteredProducts = [];
      }
    }
  }

  onSearch() {
    const query = this.searchQuery.trim().toLowerCase();
    this.filteredProducts = this.allProducts.filter(p =>
      p.toLowerCase().includes(query)
    );
  }

  goToProduct(product: string) {
    console.log('تم اختيار المنتج:', product);
    this.showSearch = false;
    this.searchQuery = '';
    this.closeNavbar();
  }

  closeNavbar() {
    const navbar = document.getElementById('navbarCollapse');
    if (navbar?.classList.contains('show')) {
      navbar.classList.remove('show');
    }
  }
}
