import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-thankful-page',
  standalone: true,
  templateUrl: './thankful-page.component.html',
  styleUrls: ['./thankful-page.component.css']
})
export class ThankfulPageComponent {
  constructor(private router: Router) {}

  goToHome() {
    this.router.navigate(['/']);
  }
}
