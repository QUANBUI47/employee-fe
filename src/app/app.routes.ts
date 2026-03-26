import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

import LoginComponent from './modules/login/pages/login.component/login.component';
import { HomeComponent } from './modules/home/pages/home.component/home.component';
import { EmployeeComponent } from './modules/home/pages/employee.component/employee.component';
import { EmployeeEditComponent } from './modules/home/pages/employee-edit.component/employee-edit.component';
import { EmployeeViewComponent } from './modules/home/pages/employee-view.component/employee-view.component';
import { EmployeeAddComponent } from './modules/home/pages/employee-add.component/employee-add.component';

export const routes: Routes = [

  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard],
    children: [
      { path: 'employee', component: EmployeeComponent },
      { path: 'employee/add', component: EmployeeAddComponent },
      { path: 'employee/:id', component: EmployeeViewComponent },
      { path: 'employee/:id/edit', component: EmployeeEditComponent },
      { path: '', redirectTo: 'employee', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: 'login' }
];