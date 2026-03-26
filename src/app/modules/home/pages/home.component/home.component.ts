import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideBar } from "../../components/side-bar/side-bar";
import { RouterOutlet } from '@angular/router';
import { ROLE_LABELS } from '../../model/home.model';
import { AuthService } from '../../../../core/service/auth.service';

@Component({
  selector: 'app-home.component',
  standalone: true,
  imports: [CommonModule, SideBar, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  private auth = inject(AuthService);

  user = this.auth.user;
  roleLabel = computed(() => {
    const u = this.user();
    return u ? (ROLE_LABELS[u.role] || u.role) : '';
  });

  constructor() { }

  ngOnInit() {
    this.auth.loadUser();
  }
}