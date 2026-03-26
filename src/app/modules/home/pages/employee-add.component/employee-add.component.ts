import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HomeService } from '../../services/home.service';
import { Language, Certificate, EmployeeRequest } from '../../model/home.model';

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-add.component.html',
})
export class EmployeeAddComponent implements OnInit {
  employeeForm!: FormGroup;

  isLoading = signal(false);
  isSaving = signal(false);

  availableLanguages = signal<Language[]>([]);
  uniqueLanguageNames = computed(() => [...new Set(this.availableLanguages().map((l: Language) => l.name))]);
  availableCertificates = signal<Certificate[]>([]);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private homeService: HomeService
  ) { }

  ngOnInit() {
    this.homeService.getLanguages().subscribe(res => {
      this.availableLanguages.set(res);
    });

    this.homeService.getCertificates().subscribe(res => {
      this.availableCertificates.set(res);
    });

    this.initForm();
  }

  initForm() {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      dob: ['', [Validators.required, this.dobValidator]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?\d{9,15}$/)]],
      address: ['', [Validators.required, Validators.maxLength(255)]],
      languages: this.fb.array([]),
      certificates: this.fb.array([])
    });

    this.addLanguage();
    this.addCertificate();
  }

  dobValidator(control: AbstractControl) {
    if (!control.value) return null;
    const value = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return value < today ? null : { notPast: true };
  }

  getFieldError(fieldName: string, control?: AbstractControl): string {
    const c = control || this.employeeForm.get(fieldName);
    if (!c || !this.isTouched(c)) return '';

    if (c.hasError('required')) return this.getRequiredErrorMessage(fieldName);
    if (c.hasError('maxlength')) return this.getMaxLengthErrorMessage(fieldName, c.getError('maxlength').requiredLength);
    if (c.hasError('pattern')) return this.getPatternErrorMessage(fieldName);
    if (c.hasError('notPast')) return 'Ngày sinh phải nhỏ hơn ngày hiện tại.';

    return '';
  }

  private isTouched(control: AbstractControl): boolean {
    return control.touched || control.dirty;
  }

  private getRequiredErrorMessage(fieldName: string): string {
    const labels: Record<string, string> = {
      name: 'Họ và tên',
      dob: 'Ngày sinh',
      phone: 'Số điện thoại',
      address: 'Địa chỉ',
      name_lang: 'Tên ngoại ngữ',
      level: 'Trình độ',
      id_cert: 'Chứng chỉ'
    };
    return `${labels[fieldName] || fieldName} là bắt buộc.`;
  }

  private getMaxLengthErrorMessage(fieldName: string, length: number): string {
    return `Trường này không được vượt quá ${length} ký tự.`;
  }

  private getPatternErrorMessage(fieldName: string): string {
    if (fieldName === 'phone') return 'Số điện thoại không đúng định dạng (9-15 chữ số, có thể bắt đầu bằng +).';
    return 'Định dạng không hợp lệ.';
  }

  get languages() {
    return this.employeeForm.get('languages') as FormArray;
  }

  get certificates() {
    return this.employeeForm.get('certificates') as FormArray;
  }

  addLanguage() {
    this.languages.push(this.fb.group({
      name: ['', Validators.required],
      level: ['', Validators.required]
    }));
  }

  removeLanguage(index: number) {
    this.languages.removeAt(index);
  }

  addCertificate() {
    this.certificates.push(this.fb.group({
      id: ['', Validators.required]
    }));
  }

  removeCertificate(index: number) {
    this.certificates.removeAt(index);
  }

  getLevelsForLanguage(langName: string): Language[] {
    if (!langName) return [];
    return this.availableLanguages().filter(l => l.name === langName);
  }

  goBack() {
    this.router.navigate(['/employee']);
  }

  onSubmit() {
    this.employeeForm.markAllAsTouched();
    if (this.employeeForm.invalid) {
      return;
    }

    this.isSaving.set(true);
    this.isSaving.set(true);

    const formVal = this.employeeForm.value;
    const newEmployeeData: EmployeeRequest = {
      name: formVal.name,
      dob: formVal.dob,
      phone: formVal.phone,
      address: formVal.address,
      languageIds: formVal.languages ? formVal.languages.map((lang: any) => lang.level).filter((id: number) => id) : [],
      certificateIds: formVal.certificates ? formVal.certificates.map((cert: any) => cert.id).filter((id: number) => id) : []
    };

    this.homeService.createEmployee(newEmployeeData).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.router.navigate(['/employee'], { queryParams: { action: 'add' } });
      },
      error: (err) => {
        this.isSaving.set(false);
        console.error('Create failed', err);
      }
    });
  }
}
