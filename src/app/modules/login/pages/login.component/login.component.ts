import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../service/login.service'; 

@Component({
  standalone: true,
  selector: 'app-login-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export default class LoginComponent {
  private fb = inject(FormBuilder);
  private loginService = inject(LoginService);
  private router = inject(Router);

  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.maxLength(100)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  loading = false;
  error: string | null = null;

  showPassword = false;
  togglePassword() { this.showPassword = !this.showPassword; }

  get f() { return this.loginForm.controls; }

  submit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = null;

    this.loginService.login$(this.loginForm.value as { username: string; password: string })
      .subscribe({
        next: (res) => {
          localStorage.setItem('accessToken', res.accessToken);
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          this.error = err?.error?.message ?? 'Đăng nhập thất bại';
          this.loading = false;
        }
      });
  }
}