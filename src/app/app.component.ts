import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "./shared/footer/footer.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { AuthService } from './core/services/auth.service';
import { OnInit } from '@angular/core';
@Component({
  selector: 'app-root',
  standalone : true,
  imports: [RouterOutlet, FooterComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.initializeTokenFromUrl();
  }
}
