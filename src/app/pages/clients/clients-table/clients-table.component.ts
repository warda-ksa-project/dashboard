import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../../services/api.service';
import { LanguageService } from '../../../services/language.service';
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { BreadcrumpComponent } from '../../../components/breadcrump/breadcrump.component';

@Component({
  selector: 'app-clients-table',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslatePipe,
    TitleCasePipe,
    TableModule,
    ButtonModule,
    BreadcrumpComponent,
  ],
  templateUrl: './clients-table.component.html',
  styleUrl: './clients-table.component.scss',
})
export class ClientsTableComponent implements OnInit {
  private api = inject(ApiService);
  languageService = inject(LanguageService);

  pageName = signal('client.pageName');
  clients: any[] = [];
  bredCrumb: IBreadcrumb = { crumbs: [] };

  ngOnInit() {
    this.getBreadCrumb();
    this.api.get('Users/by-type/3').subscribe((res: any) => {
      this.clients = res?.data ?? res ?? [];
    });
  }

  getBreadCrumb() {
    this.bredCrumb = {
      crumbs: [
        { label: this.languageService.translate('Home'), routerLink: '/dashboard-admin' },
        { label: this.languageService.translate(this.pageName()) },
      ],
    };
  }
}
