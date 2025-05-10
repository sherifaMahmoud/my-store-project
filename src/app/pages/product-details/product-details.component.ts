import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],

})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  product: any;
  relatedProducts: any[] = [];
  groupedRelatedProducts: any[][] = []; 
  private routeSub!: Subscription;
  isTruncated: boolean = true;
  maxDescriptionLength: number = 100;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);

    this.routeSub = this.route.params.subscribe(params => {
      const productId = params['id'];
      this.loadProductData(productId);
    });
  }

  loadProductData(productId: string | number): void {
    const id = typeof productId === 'string' ? parseInt(productId, 10) : productId;

    this.dataService.viewItemDetails(id).subscribe({
      next: (data) => {
        console.log('بيانات المنتج:', data);
        this.product = data;

        this.dataService.getAllProducts().subscribe(products => {
          this.relatedProducts = products
            .filter(p => p.category === this.product?.category && p.id !== this.product?.id)
            .slice(0, 9); // ⭐ خليهم 9 عشان كل سلايد فيه 3 منتجات

          this.groupedRelatedProducts = this.chunkArray(this.relatedProducts, 3); // ⭐ اقسمهم مجموعات
          this.cdr.detectChanges();
        });

        window.scrollTo(0, 0);
      },
      error: (err) => {
        console.error('خطأ أثناء جلب بيانات المنتج:', err);
      }
    });
  }

  // ⭐ دالة تقسيم المنتجات كل 3 مع بعض
  chunkArray(array: any[], chunkSize: number): any[][] {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  }

  get truncatedDescription() {
    if (this.product?.description) {
      if (this.product.description.length > this.maxDescriptionLength && this.isTruncated) {
        return this.product.description.substring(0, this.maxDescriptionLength);
      }
      return this.product.description;
    }
    return '';
  }

  toggleDescription() {
    this.isTruncated = !this.isTruncated;
  }

  addToCart(): void {
    this.dataService.addToCart(this.product);
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
