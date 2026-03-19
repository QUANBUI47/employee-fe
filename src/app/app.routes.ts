import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { DashboardComponent } from './pages/dashboard.component/dashboard.component';
import LoginComponent from './modules/login/pages/login.component/login.component';

export const routes: Routes = [

    { path: 'login', component: LoginComponent },
    { path: '', component: DashboardComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: '' }

];
