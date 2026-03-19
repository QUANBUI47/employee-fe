// src/app/modules/login/service/login.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environments';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private http = inject(HttpClient);
  private base = environment.baseUrl;
  private ep = environment.endpoints.auth;

  login$(payload: { username: string; password: string }) {
    return this.http.post<{ tokenType: string; accessToken: string }>(
      `${this.base}${this.ep.login}`,
      payload
    );
  }

  me$() {
    return this.http.get<{ username: string; authorities: { authority: string }[] }>(
      `${this.base}${this.ep.me}`
    );
  }
}