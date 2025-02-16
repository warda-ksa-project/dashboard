import { Component, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { IBreadcrumb } from './cerqel-breadcrumb.interface';

@Component({
  selector: 'app-breadcrump',
  standalone: true,
  imports: [Breadcrumb],
  templateUrl: './breadcrump.component.html',
  styleUrl: './breadcrump.component.scss'
})
export class BreadcrumpComponent {

  @Input() breadcrumbProps!: IBreadcrumb;
  items: MenuItem[] | undefined;

  home: MenuItem | undefined;

  ngOnInit() {
      this.items = [
          { label: 'Profile' }
      ];

      this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
  }

}
