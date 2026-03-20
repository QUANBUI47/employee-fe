import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideBar } from "../../components/side-bar/side-bar";
import { RouterOutlet } from '@angular/router';
import { ROLE_LABELS, UserInfo } from '../../model/home.model';
import { AuthService } from '../../../../core/service/auth.service';

@Component({
  selector: 'app-home.component',
  standalone: true,
  imports: [CommonModule, SideBar, RouterOutlet], // 👈 THÊM CommonModule
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  
  user?: UserInfo;
  roleLabel = '';

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.loadUser();

    this.auth.user$.subscribe(res => {
      if (res) {
        this.user = res;
        this.roleLabel = ROLE_LABELS[res.role] || res.role;
      }
    });
  }
}