import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { IBreadcrumb } from '../../components/breadcrump/cerqel-breadcrumb.interface';
import { BreadcrumpComponent } from '../../components/breadcrump/breadcrump.component';
import { ClientWalletPanelComponent } from '../../components/client-wallet-panel/client-wallet-panel.component';

@Component({
  selector: 'app-client-wallet',
  standalone: true,
  imports: [
    CommonModule,
    TranslatePipe,
    TitleCasePipe,
    BreadcrumpComponent,
    ClientWalletPanelComponent,
  ],
  templateUrl: './client-wallet.component.html',
  styleUrl: './client-wallet.component.scss',
})
export class ClientWalletComponent implements OnInit {
  private route = inject(ActivatedRoute);
  languageService = inject(LanguageService);

  pageName = signal('client_wallet.pageName');
  clientId = 0;
  bredCrumb: IBreadcrumb = { crumbs: [] };

  ngOnInit() {
    this.clientId = Number(this.route.snapshot.params['id']);
    this.getBreadCrumb();
  }

  getBreadCrumb() {
    this.bredCrumb = {
      crumbs: [
        { label: this.languageService.translate('Home'), routerLink: '/dashboard-admin' },
        { label: this.languageService.translate('wallet_management.pageName'), routerLink: '/wallet-management' },
        { label: `${this.languageService.translate(this.pageName())} #${this.clientId}` },
      ],
    };
  }
}
