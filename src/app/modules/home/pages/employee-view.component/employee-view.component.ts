import { Component, OnInit, signal, computed } from '@angular/core';
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
  employee = signal<Employee | null>(null);
  employeeId!: number;
  isLoading = signal(true);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private homeService: HomeService
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
    this.isLoading.set(true);
    this.isLoading.set(true);
    this.homeService.getEmployee(this.employeeId).subscribe({
      next: (data: Employee) => {
        this.employee.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('[ERROR] Lỗi khi tải chi tiết nhân viên', err);
        this.isLoading.set(false);
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
