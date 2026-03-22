import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { Employee, Page } from '../model/home.model';

@Injectable({ providedIn: 'root' })
export class HomeService {

  constructor(private http: HttpClient) {}

  getEmployees(page: number = 0, size: number = 10, q: string = '') {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('q', q);

    return this.http.get<Page<Employee>>(
      `${environment.baseUrl}${environment.endpoints.employees}`,
      { params }
    );
  }

  getEmployee(id: number) {
    return this.http.get<Employee>(
      `${environment.baseUrl}${environment.endpoints.employees}/${id}`
    );
  }

  updateEmployee(id: number, employeeData: any) {
    return this.http.put<Employee>(
      `${environment.baseUrl}${environment.endpoints.employees}/${id}`,
      employeeData
    );
  }

  deleteEmployee(id: number) {
    return this.http.delete(
      `${environment.baseUrl}${environment.endpoints.employees}/${id}`
    );
  }
}