import { Component } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
declare let ScrollReveal: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule , RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  logined:boolean = false ;

  loginForm = new FormGroup({
    username: new FormControl(null , [Validators.required , Validators.minLength(3) , Validators.maxLength(20) ,Validators.pattern(/^[a-zA-Z0-9]/)] ) ,
    password: new FormControl(null , [Validators.required , Validators.minLength(8) , Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/)])
  }) ;

  constructor(private dataService:DataService ,private _Router:Router){

  }
  login(input: any) {
    this.dataService.loginUser(input.value).subscribe({
      next: (data) => {
        console.log('Login Response:', data);

        if (data.message === "Login successful") {
          this.dataService.isLogined.next(true);
          this._Router.navigate(['./home']);
        } else if (data.message === "User not found" || data.message === "Invalid credentials") {
          alert('المستخدم غير موجود أو البيانات غير صحيحة.');
        } else {
          alert('حدث خطأ غير متوقع.');
        }
      },
      error: (err) => {
        console.error('Login failed', err);
        alert('حدث خطأ في السيرفر. حاول لاحقاً.');
      }
    });
  }



  ngAfterViewInit() {
    ScrollReveal().reveal('.reveal-from-top', {
      reset: true,
      delay: 100,
      distance: '50px',
      duration: 1000,
      origin: 'top',
      easing: 'ease-in-out'
    });
    ScrollReveal().reveal('.reveal-from-bottom', {
      reset: true,
      delay: 100,
      distance: '50px',
      duration: 1000,
      origin: 'bottom',
      easing: 'ease-in-out'
    });
  }
}
