import { Component, OnInit } from '@angular/core';
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

  constructor(private dataService: DataService) {}

 ngOnInit() {
  window.scrollTo(0, 0);

  this.dataService.getNewItems().subscribe((items: any[]) => {
    this.ednaa = items
      .filter((item) => item.categoryName === 'عباية')
      .slice(0, 6);
    this.fustan = items
      .filter((item) => item.categoryName === 'فساتين')
      .slice(0, 6);
  });

  this.dataService.getOffers().subscribe((offers: any[]) => {
    console.log(offers);

    const offerImages = [
      'offer.jpeg',
      '8.jpeg',
      '15.jpeg',
      '7.jpeg',
      '9.jpeg',
      '111.jpeg',
      '55.jpeg',
      'offer2.jpeg',


    ];

    this.offers = offers.map((offer, index) => ({
      ...offer,
      image: 'assets/images/' + (offerImages[index] || 'default.jpg'), // تحديث هنا مع المسار الثابت
    }));
  });
}

  addToCart(item: any) {
    this.dataService.addToCart(item);
  }
}
