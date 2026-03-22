import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService } from '../../services/home.service';
import { Employee } from '../../model/home.model';

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-edit.component.html'
})
export class EmployeeEditComponent implements OnInit {
  employeeForm!: FormGroup;
  employeeId!: number;
  isLoading = true;
  isSaving = false;
  message: { type: 'success' | 'error', text: string } | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private homeService: HomeService,
    private cdr: ChangeDetectorRef
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.employeeId = +id;
        this.loadEmployee();
      }
    });
  }

  createForm() {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      dob: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      languages: [[]],
      certificates: [[]]
    });
  }

  loadEmployee() {
    this.isLoading = true;
    this.message = null;
    console.log(`[DEBUG] Bắt đầu gọi API lấy nhân viên ID: ${this.employeeId}`);
    
    this.homeService.getEmployee(this.employeeId).subscribe({
      next: (data: Employee) => {
        console.log('[DEBUG] API trả về dữ liệu:', data);
        
        // Cập nhật giá trị vào form có thể fail nếu dữ liệu không phải object
        try {
          this.employeeForm.patchValue({
            name: data.name,
            dob: data.dob,
            phone: data.phone,
            address: data.address,
            languages: data.languages || [],
            certificates: data.certificates || []
          });
        } catch (e) {
          console.error('[ERROR] Lỗi khi patchValue:', e);
        }
        
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[ERROR] Lỗi khi gọi API employee', err);
        this.message = { type: 'error', text: 'Không thể tải thông tin nhân viên.' };
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit() {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.message = null;

    const updatedData = this.employeeForm.value;
    
    this.homeService.updateEmployee(this.employeeId, updatedData).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.message = { type: 'success', text: 'Cập nhật thành công!' };
      },
      error: (err) => {
        console.error('Error updating', err);
        this.isSaving = false;
        this.message = { type: 'error', text: 'Cập nhật thất bại. Vui lòng thử lại.' };
      }
    });
  }

  goBack() {
    this.router.navigate(['/employee', this.employeeId]);
  }
}
