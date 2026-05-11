import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  cards: any[] = [];
  ednaa: any[] = [];
  fustan: any[] = [];
  offers: any[] = [];

  constructor(
    private dataService: DataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }

    this.dataService.getNewItems().subscribe((items: any[]) => {
      this.ednaa = items.filter((item) => item.categoryName === 'عباية').slice(0, 6);
      this.fustan = items.filter((item) => item.categoryName === 'فساتين').slice(0, 6);
    });

    this.dataService.getOffers().subscribe((offers: any[]) => {
      const offerImages = ['offer.jpeg', '8.jpeg', '15.jpeg', '7.jpeg', '9.jpeg', '111.jpeg', '55.jpeg', 'offer2.jpeg'];
      this.offers = offers.map((offer, index) => ({
        ...offer,
        image: 'assets/images/' + (offerImages[index] || 'default.jpg'),
      }));
    });
  }

  addToCart(item: any) {
    this.dataService.addToCart(item);
  }
}