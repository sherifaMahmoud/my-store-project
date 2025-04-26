import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-store',
  imports: [ RouterLink, CommonModule],
  standalone : true,
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {
  products: any[] = [];


  constructor(private dataService: DataService) {}
  ngOnInit(): void {

    this.dataService.getNewItems().subscribe((data) => {
      this.products = data;
    });

  }

  addToCart(product: any) {
    this.dataService.addToCart(product);
  }}
