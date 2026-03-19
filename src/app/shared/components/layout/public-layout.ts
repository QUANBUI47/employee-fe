import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicLayoutDesktop } from './public-layout-desktop/public-layout-desktop';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [PublicLayoutDesktop],
  template: `
    <app-public-layout-desktop>
      <ng-content></ng-content>
    </app-public-layout-desktop>
  `,
})
export class PublicLayoutComponent implements OnInit {
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      console.log(data);
    });
  }
}
