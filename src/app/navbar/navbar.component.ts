import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DataService } from '../core/services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  cartCount = 0;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.cartCount$.subscribe(count => {
      this.cartCount = count;
      console.log('Current cart count:', count); // للتأكد من وصول البيانات
    });
  }
}

