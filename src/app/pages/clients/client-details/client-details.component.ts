import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from '../../../services/api.service';
import { LanguageService } from '../../../services/language.service';
import { IBreadcrumb } from '../../../components/breadcrump/cerqel-breadcrumb.interface';
import { BreadcrumpComponent } from '../../../components/breadcrump/breadcrump.component';
import { ClientWalletPanelComponent } from '../../../components/client-wallet-panel/client-wallet-panel.component';
import { InputTextComponent } from '../../../components/input-text/input-text.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    TitleCasePipe,
    BreadcrumpComponent,
    ClientWalletPanelComponent,
    InputTextComponent,
  ],
  templateUrl: './client-details.component.html',
  styleUrl: './client-details.component.scss',
})
export class ClientDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  languageService = inject(LanguageService);

  pageName = signal('client.pageName_View_crumb');
  clientId = 0;
  bredCrumb: IBreadcrumb = { crumbs: [] };

  form = new FormGroup({
    name: new FormControl({ value: '', disabled: true }),
    phone: new FormControl({ value: '', disabled: true }),
    email: new FormControl({ value: '', disabled: true }),
    isActive: new FormControl({ value: '', disabled: true }),
  });

  ngOnInit() {
    this.clientId = Number(this.route.snapshot.params['id']);
    this.getBreadCrumb();
    this.api.get(`Users/${this.clientId}`).subscribe((res: any) => {
      const user = res?.data ?? res;
      this.form.patchValue({
        name: user?.name ?? user?.userName ?? '',
        phone: user?.phone ?? '',
        email: user?.email ?? '',
        isActive: user?.isActive
          ? this.languageService.translate('commission_settings.active')
          : this.languageService.translate('commission_settings.inactive'),
      });
    });
  }

  getBreadCrumb() {
    this.bredCrumb = {
      crumbs: [
        { label: this.languageService.translate('Home'), routerLink: '/dashboard-admin' },
        { label: this.languageService.translate('client.pageName'), routerLink: '/clients' },
        { label: this.languageService.translate(this.pageName()) },
      ],
    };
  }
}
