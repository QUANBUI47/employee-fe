import { Component } from '@angular/core';
import { PublicHeaderDesktop } from '../components/public-header-desktop/public-header-desktop';
import { PublicFooterDesktop } from '../components/public-footer-desktop/public-footer-desktop';

@Component({
  selector: 'app-public-layout-desktop',
  standalone: true,
  imports: [PublicHeaderDesktop, PublicFooterDesktop],
  templateUrl: './public-layout-desktop.html',
  styleUrls: [],
})
export class PublicLayoutDesktop {}
