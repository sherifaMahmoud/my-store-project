import { Component, OnInit } from '@angular/core';
import { FooterComponent } from "../../shared/footer/footer.component";
import { DataService } from '../../core/services/data.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  cards: any[] = [];
  ednaa: any[] = [];
  fustan: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    window.scrollTo(0, 0);
    this.dataService.getNewItems().subscribe((items: any[]) => {
      this.cards = [
        {
          image: items[0]?.image || 'https://via.placeholder.com/400x300?text=Card+1',
          text: 'أحدث كولكشن الصيف 2025  '
        },
        {
          image: items[1]?.image || 'https://via.placeholder.com/400x300?text=Card+2',
          text: ' اشتري 2 واحصلي علي واحد مجانا!'
        },
        {
          image: items[2]?.image || 'https://via.placeholder.com/400x300?text=Card+3',
          text: ' تألقي بتشكيلة متميزة من فساتين يدنين بخصومات تصل الي 30 %  '
        }
      ];

      this.ednaa = items.slice(0, 6);
      this.fustan = items.slice(6, 12);
    });
  }

  addToCart(item: any) {
    this.dataService.addToCart(item);
  }
}
