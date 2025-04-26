import { Component } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../shared/footer/footer.component';
@Component({
  selector: 'app-login',
  imports: [FooterComponent, RouterLink ],
  standalone : true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  constructor(private dataService: DataService) {}
  login() {
    this.dataService.loginUser(this.credentials).subscribe({
      next: (response) => console.log('Login success', response),
      error: (error) => console.error('Login failed', error)
    });
  }
}
