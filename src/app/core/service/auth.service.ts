import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private base = environment.baseUrl;
  private ep = environment.endpoints;

  me() {
    return this.http.get<{ username: string; authorities: { authority: string }[] }>(
      `${this.base}${this.ep.auth.me}`
    );
  }
}