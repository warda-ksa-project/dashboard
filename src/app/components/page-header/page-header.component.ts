import { Component, Input } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { BreadcrumpComponent } from '../breadcrump/breadcrump.component';
import { IBreadcrumb } from '../breadcrump/cerqel-breadcrumb.interface';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [TitleCasePipe, TranslatePipe, BreadcrumpComponent],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() icon = 'pi pi-list';
  @Input() breadcrumb?: IBreadcrumb;
}
