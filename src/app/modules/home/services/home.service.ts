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
}