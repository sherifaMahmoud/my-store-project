import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  Router,
  RouterLink
} from '@angular/router';

import { DataService }
  from '../../core/services/data.service';

@Component({
  selector: 'app-register',

  standalone: true,

  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink
  ],

  templateUrl: './register.component.html',

  styleUrls: ['./register.component.css'],
})

export class RegisterComponent {

  registerForm: FormGroup;

  isLoading = false;

  submitted = false;

  errorMessage = '';

  constructor(

    private fb: FormBuilder,

    private router: Router,

    private dataService: DataService

  ) {

    this.registerForm =
      this.fb.group({

        userName: [

          '',

          [
            Validators.required,
            Validators.minLength(3)
          ]
        ],

        email: [

          '',

          [
            Validators.required,
            Validators.email
          ]
        ],

        password: [

          '',

          [

            Validators.required,

            Validators.pattern(
              /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/
            )
          ]
        ]
      });
  }

  register() {

    this.submitted = true;

    this.errorMessage = '';

    // ===== Password Pattern =====
    if (
      this.registerForm
        .get('password')
        ?.errors?.['pattern']
    ) {

      this.errorMessage =
        'كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم و8 خانات على الأقل';

      return;
    }

    // ===== Invalid Form =====
    if (this.registerForm.invalid) {

      this.errorMessage =
        'يرجى ملء جميع الحقول بشكل صحيح';

      return;
    }

    this.isLoading = true;

    const userData =
      this.registerForm.value;

    this.dataService
      .registerUser(userData)
      .subscribe({

        next: (res) => {

          this.isLoading = false;

          if (
            res.message ===
            'User has been created successfully'
          ) {

            this.showToast(
              'تم إنشاء الحساب بنجاح'
            );

            this.router.navigate(
              ['/login']
            );
          }

          else {

            this.errorMessage =
              'حدث خطأ أثناء إنشاء الحساب';
          }
        },

        error: (err) => {

          this.isLoading = false;

          console.log(err.error);

          const errors =
            err.error?.[''] || [];

          const errorText =
            errors.join(' ').toLowerCase();

          // username exists
          if (
            errorText.includes('username') &&
            errorText.includes('taken')
          ) {

            this.errorMessage =
              'اسم المستخدم مستخدم بالفعل';
          }

          // email exists
          else if (
            errorText.includes('email') &&
            errorText.includes('taken')
          ) {

            this.errorMessage =
              'البريد الإلكتروني مستخدم بالفعل';
          }

          else {

            this.errorMessage =
              'حدث خطأ أثناء إنشاء الحساب';
          }
        },
      });
  }

  showToast(message: string) {

    const toast =
      document.createElement('div');

    toast.className =
      'custom-toast';

    toast.innerText = message;

    document.body.appendChild(toast);

    setTimeout(() => {

      toast.classList.add('show');

    }, 100);

    setTimeout(() => {

      toast.classList.remove('show');

      setTimeout(() => {

        toast.remove();

      }, 300);

    }, 3000);
  }

  get passwordValue(): string {

    return this.registerForm
      .get('password')
      ?.value || '';
  }
}