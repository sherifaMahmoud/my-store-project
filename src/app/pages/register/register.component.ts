 import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dataService: DataService
  ) {
    this.registerForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  register() {
    if (this.registerForm.invalid) {
      alert('يرجى ملء جميع الحقول بشكل صحيح.');
      return;
    }

    const userData = this.registerForm.value;

    this.dataService.registerUser(userData).subscribe({
      next: (res) => {
        console.log('✅ Register Response:', res);

        if (res.message === 'User has been created successfully') {
          alert('✅ تم إنشاء الحساب بنجاح!');
          this.router.navigate(['/login']);
        } else if (res.message === 'User was not created successfully') {
          alert('⚠️ المستخدم موجود بالفعل!');
        } else {
          alert('حدث خطأ غير متوقع أثناء التسجيل.');
        }
      },
      error: (err) => {
        console.error('❌ Register Error:', err);
        alert('❌ حدث خطأ في الاتصال بالسيرفر.');
      }
    });
  }
}
