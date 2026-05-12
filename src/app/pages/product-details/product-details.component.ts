import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  Inject,
  PLATFORM_ID
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

import { DataService } from '../../core/services/data.service';

import { ActivatedRoute, RouterLink } from '@angular/router';

import { CommonModule } from '@angular/common';

import { Subscription } from 'rxjs';

import { CartService } from '../../core/services/cart.services';

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
    private cdr: ChangeDetectorRef,
    private cartService: CartService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }

    this.routeSub = this.route.params.subscribe((params) => {

      const productId = params['id'];

      if (productId && !isNaN(productId)) {
        this.loadProductData(productId);
      }
    });
  }

  loadProductData(productId: string | number): void {

    const id =
      typeof productId === 'string'
        ? parseInt(productId, 10)
        : productId;

    this.dataService.viewItemDetails(id).subscribe({

      next: (data) => {

        this.product = data;

        this.dataService.getAllProducts().subscribe((products) => {

          this.relatedProducts = products
            .filter((p) => p.productId !== this.product.productId)
            .sort(() => 0.5 - Math.random())
            .slice(0, 6);

          this.groupedRelatedProducts = this.chunkArray(
            this.relatedProducts,
            3
          );

          this.cdr.detectChanges();
        });

        if (isPlatformBrowser(this.platformId)) {
          window.scrollTo(0, 0);
        }
      },

      error: (err) =>
        console.error('خطأ أثناء جلب بيانات المنتج:', err),
    });
  }

  chunkArray(array: any[], chunkSize: number): any[][] {

    const result = [];

    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }

    return result;
  }

  get truncatedDescription() {

    if (this.product?.description) {

      if (
        this.product.description.length > this.maxDescriptionLength &&
        this.isTruncated
      ) {
        return this.product.description.substring(
          0,
          this.maxDescriptionLength
        );
      }

      return this.product.description;
    }

    return '';
  }

  toggleDescription() {
    this.isTruncated = !this.isTruncated;
  }

  addToCart(): void {
    this.cartService.addToCart(this.product);
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }
}