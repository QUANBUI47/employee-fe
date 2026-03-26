import { Component, inject, input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserInfo } from '../../model/home.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/service/auth.service';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './side-bar.html',
  styleUrls: ['./side-bar.css'],
})
export class SideBar {

  user = input<UserInfo | null>(null);
  roleLabel = input<string>('');
  private authService = inject(AuthService);
  private router = inject(Router);


  menus = [
    {
      id: 1,
      label: 'Employee',
      path: '/employee',
      icon: '/icons/employee-icon.svg',
      iconActive: '/icons/employee-icon-ac.svg'
    }
  ];

  logout() {
    this.authService.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}