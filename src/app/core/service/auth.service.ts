import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, filter, tap } from 'rxjs';
import { UserInfo } from '../../modules/home/model/home.model';
import { environment } from '../../../environments/environments';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  private userSubject = new BehaviorSubject<UserInfo | null>(null);
  user$ = this.userSubject.asObservable();

  loadUser() {

    // Nếu đã có user → không call lại
    if (this.userSubject.value) return;

    this.http
      .get<UserInfo>(`${environment.baseUrl}${environment.endpoints.auth.me}`, {
        responseType: 'json'
      } as any)
      .pipe(
        // ❗ BỎ QUA RESPONSE RỖNG / RESPONSE HTML
        filter((res: any) => res && typeof res === 'object' && 'username' in res),
        tap(user => {
          console.log("ME USER LOADED >>>", user);
          this.userSubject.next(user);
        })
      )
      .subscribe({
        error: err => console.warn("ME ERROR:", err)
      });
  }
}
