import { Component, Input, OnInit } from '@angular/core';

import { RouterModule } from '@angular/router';
import { UserInfo } from '../../model/home.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './side-bar.html',
  styleUrls: ['./side-bar.css'],
})
export class SideBar {


  @Input() user?: UserInfo;
  @Input() roleLabel = '';



  menus = [
    {
      id: 1,
      label: 'Dashboard',
      path: '/dashboard',
      icon: '/icons/dashboard-icon.svg',
      iconActive: '/icons/dashboard-icon-ac.svg'
    },
    {
      id: 2,
      label: 'Employee',
      path: '/employee',
      icon: '/icons/employee-icon.svg',
      iconActive: '/icons/employee-icon-ac.svg'
    }
  ];
}