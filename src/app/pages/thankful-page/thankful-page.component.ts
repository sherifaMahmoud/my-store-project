import { Component } from '@angular/core';
import { FooterComponent } from '../../shared/footer/footer.component';
import { CartComponent } from "../cart/cart.component";

@Component({
  selector: 'app-thankful-page',
  imports: [FooterComponent, CartComponent],
  standalone: true,
  templateUrl: './thankful-page.component.html',
  styleUrls: ['./thankful-page.component.css']
})
export class ThankfulPageComponent {

}
