import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { UserInfo } from '../../modules/home/model/home.model';
import { environment } from '../../../environments/environments';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  private userSignal = signal<UserInfo | null>(null);
  user = this.userSignal.asReadonly();

  loadUser() {
    if (this.userSignal()) return;

    this.http
      .get<UserInfo>(`${environment.baseUrl}${environment.endpoints.auth.me}`)
      .pipe(
        tap(user => {
          console.log("ME USER LOADED >>>", user);
          this.userSignal.set(user);
        })
      )
      .subscribe({
        error: err => console.warn("ME ERROR:", err)
      });
  }

  logout() {
    localStorage.removeItem('accessToken');
    this.userSignal.set(null);
  }
}
