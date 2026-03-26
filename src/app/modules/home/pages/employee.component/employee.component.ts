import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HomeService } from '../../services/home.service';
import { Employee, Page } from '../../model/home.model';
import { FormsModule } from '@angular/forms';
import { DeleteDialogComponent } from '../../components/delete-dialog/delete-dialog.component';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, FormsModule, DeleteDialogComponent],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
})
export class EmployeeComponent implements OnInit {

  columns = [
    { key: 'name', label: 'Tên nhân viên', width: '25%' },
    { key: 'dob', label: 'Ngày sinh', width: '15%' },
    { key: 'phone', label: 'Số điện thoại', width: '15%' },
    { key: 'address', label: 'Địa chỉ', width: '35%' },
    { key: 'actions', label: 'Hành động', width: '10%' }
  ];

  employees = signal<Employee[]>([]);
  page = signal(0);
  size = signal(10);
  totalPages = signal(0);
  totalElements = signal(0);

  keyword = signal('');
  isDeleteDialogOpen = signal(false);
  employeeToDelete = signal<Employee | null>(null);
  isDeleting = signal(false);
  successMessage = signal<string | null>(null);

  pages = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i));
  showingFrom = computed(() => this.page() * this.size() + 1);
  showingTo = computed(() => {
    const end = (this.page() + 1) * this.size();
    return Math.min(end, this.totalElements());
  });

  private searchSubject = new Subject<string>();

  constructor(
    private homeService: HomeService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['action'] === 'add') {
        this.successMessage.set('Tạo mới nhân viên thành công!');
        this.clearQueryParam();
      } else if (params['action'] === 'edit') {
        this.successMessage.set('Cập nhật nhân viên thành công!');
        this.clearQueryParam();
      }
      
      if (this.successMessage()) {
        setTimeout(() => {
          this.successMessage.set(null);
        }, 4000);
      }
    });

    this.searchSubject.pipe(
      debounceTime(150),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.page.set(0);
      this.keyword.set(searchTerm);
      this.loadEmployees();
    });

    this.loadEmployees();
  }

  clearQueryParam() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { action: null },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  loadEmployees() {
    this.homeService.getEmployees(this.page(), this.size(), this.keyword())
      .subscribe({
        next: (res: Page<Employee>) => {
          this.employees.set(res.content);
          this.totalPages.set(res.totalPages);
          this.totalElements.set(res.totalElements);
        },
        error: (err) => {
          console.error('[ERROR] Gọi API thất bại:', err);
        }
      });
  }

  search() {
    this.page.set(0);
    this.loadEmployees();
  }

  goPrev() {
    if (this.page() > 0) {
      this.page.update(p => p - 1);
      this.loadEmployees();
    }
  }

  goNext() {
    if (this.page() < this.totalPages() - 1) {
      this.page.update(p => p + 1);
      this.loadEmployees();
    }
  }

  goToPage(p: number) {
    if (p >= 0 && p < this.totalPages()) {
      this.page.set(p);
      this.loadEmployees();
    }
  }

  goToDetail(id: number) {
    this.router.navigate(['/employee', id]);
  }

  goToAdd() {
    this.router.navigate(['/employee/add']);
  }

  onSearchInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.keyword.set(val);
    this.searchSubject.next(val);
  }

  onView(id: number, event: Event) {
    event.stopPropagation();
    this.goToDetail(id);
  }

  onEdit(id: number, event: Event) {
    event.stopPropagation();
    this.router.navigate(['/employee', id, 'edit']);
  }

  onDelete(employee: Employee, event: Event) {
    event.stopPropagation();
    this.employeeToDelete.set(employee);
    this.isDeleteDialogOpen.set(true);
  }

  cancelDelete() {
    this.isDeleteDialogOpen.set(false);
    this.employeeToDelete.set(null);
  }

  confirmDelete() {
    const employee = this.employeeToDelete();
    if (!employee) return;
    this.isDeleting.set(true);
    this.homeService.deleteEmployee(employee.id).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.isDeleteDialogOpen.set(false);
        this.employeeToDelete.set(null);
        this.loadEmployees();
      },
      error: (err) => {
        console.error('Delete error', err);
        this.isDeleting.set(false);
        alert('Có lỗi xảy ra khi xóa nhân viên!');
      }
    });
  }
}