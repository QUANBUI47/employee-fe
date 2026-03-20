import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeService } from '../../services/home.service';
import { Employee, Page } from '../../model/home.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  employees: Employee[] = [];
  page = 0;
  size = 10;
  totalPages = 0;
  totalElements = 0;

  /** Mảng số trang (0-based) - cách này ổn định hơn [].constructor */
  pages: number[] = [];

  keyword = '';

  constructor(private homeService: HomeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    console.log(`[DEBUG] Đang load trang ${this.page} (keyword: "${this.keyword}")`);

    this.homeService.getEmployees(this.page, this.size, this.keyword)
      .subscribe({
        next: (res: Page<Employee>) => {
          this.employees = res.content;
          this.totalPages = res.totalPages;
          this.totalElements = res.totalElements;
          this.cdr.detectChanges();

          // Tạo lại mảng trang mỗi lần load
          this.pages = Array.from({ length: this.totalPages }, (_, i) => i);

          console.log(`[DEBUG] Nhận được: trang ${res.number}, tổng ${this.totalPages} trang, ${this.employees.length} nhân viên`);
        },
        error: (err) => {
          console.error('[ERROR] Gọi API thất bại:', err);
        }
      });
  }

  search() {
    this.page = 0;
    this.loadEmployees();
  }

  goPrev() {
    if (this.page > 0) {
      this.page--;
      this.loadEmployees();
    }
  }

  goNext() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.loadEmployees();
    }
  }

  goToPage(p: number) {
    if (p >= 0 && p < this.totalPages) {
      this.page = p;
      this.loadEmployees();
    }
  }

  // Hiển thị "Hiển thị 1–10 trong 17 nhân viên"
  get showingFrom(): number {
    return this.page * this.size + 1;
  }

  get showingTo(): number {
    const end = (this.page + 1) * this.size;
    return Math.min(end, this.totalElements);
  }
}