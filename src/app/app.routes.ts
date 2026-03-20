import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

import LoginComponent from './modules/login/pages/login.component/login.component';
import { DashboardComponent } from './modules/home/pages/dashboard.component/dashboard.component';
import { HomeComponent } from './modules/home/pages/home.component/home.component';
import { EmployeeComponent } from './modules/home/pages/employee.component/employee.component';

export const routes: Routes = [

  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'employee', component: EmployeeComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: '' }
];