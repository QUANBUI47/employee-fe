import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService } from '../../services/home.service';
import { Employee } from '../../model/home.model';

@Component({
  selector: 'app-employee-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-view.component.html'
})
export class EmployeeViewComponent implements OnInit {
  employee: Employee | null = null;
  employeeId!: number;
  isLoading = true;
  message: { type: 'success' | 'error', text: string } | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private homeService: HomeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.employeeId = +id;
        this.loadEmployee();
      }
    });
  }

  loadEmployee() {
    this.isLoading = true;
    this.message = null;
    this.homeService.getEmployee(this.employeeId).subscribe({
      next: (data: Employee) => {
        this.employee = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[ERROR]', err);
        this.message = { type: 'error', text: 'Không thể tải thông tin nhân viên.' };
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goToEdit() {
    this.router.navigate(['/employee', this.employeeId, 'edit']);
  }

  goBack() {
    this.router.navigate(['/employee']);
  }
}
