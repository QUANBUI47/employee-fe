import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('accessToken');

  if (!token) {
    router.navigateByUrl('/login');
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    const now = Date.now();

    if (now > exp) {
      localStorage.removeItem('accessToken');
      router.navigateByUrl('/login');
      return false;
    }

    return true;

  } catch (e) {
    localStorage.removeItem('accessToken');
    router.navigateByUrl('/login');
    return false;
  }
};