import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/service/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {

  data: any; error: string | null = null;
  private auth = inject(AuthService);

  constructor() {
    this.auth.me().subscribe({
      next: (res) => this.data = res,
      error: (err) => this.error = err?.error?.message ?? 'Lỗi tải dữ liệu',
    });
  }

}
