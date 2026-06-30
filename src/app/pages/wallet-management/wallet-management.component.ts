import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../services/api.service';
import { LanguageService } from '../../services/language.service';
import { SelectComponent } from '../../components/select/select.component';
import { IBreadcrumb } from '../../components/breadcrump/cerqel-breadcrumb.interface';
import { BreadcrumpComponent } from '../../components/breadcrump/breadcrump.component';
import { TraderFinancialPanelComponent } from '../../components/trader-financial-panel/trader-financial-panel.component';

@Component({
  selector: 'app-wallet-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    TitleCasePipe,
    ButtonModule,
    SelectComponent,
    BreadcrumpComponent,
    TraderFinancialPanelComponent,
  ],
  templateUrl: './wallet-management.component.html',
  styleUrl: './wallet-management.component.scss',
})
export class WalletManagementComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  languageService = inject(LanguageService);

  pageName = signal('wallet_management.pageName');
  bredCrumb: IBreadcrumb = { crumbs: [] };
  clientsList: { name: string; code: number }[] = [];
  tradersList: { name: string; code: number }[] = [];
  selectedLang = 'ar';
  selectedTraderId = 0;

  clientForm = new FormGroup({
    clientId: new FormControl<number>(0),
  });

  traderForm = new FormGroup({
    traderId: new FormControl<number>(0),
  });

  ngOnInit() {
    this.selectedLang = this.languageService.translationService.currentLang;
    this.getBreadCrumb();
    this.languageService.translationService.onLangChange.subscribe((e) => {
      this.selectedLang = e.lang;
      this.getBreadCrumb();
      this.buildClientOptions();
      this.buildTraderOptions();
    });
    this.loadLookups();
  }

  private clientsRaw: any[] = [];
  private tradersRaw: any[] = [];

  loadLookups() {
    this.api.get('Users/by-type/3').subscribe((res: any) => {
      this.clientsRaw = res?.data ?? res ?? [];
      this.buildClientOptions();
    });
    this.api.get('Traders').subscribe((res: any) => {
      this.tradersRaw = res?.data ?? [];
      this.buildTraderOptions();
    });
  }

  private buildClientOptions() {
    this.clientsList = this.clientsRaw.map((c) => ({
      code: c.id,
      name: `${c.name ?? c.userName ?? '#' + c.id} — ${c.phone ?? ''}`,
    }));
  }

  private buildTraderOptions() {
    this.tradersList = this.tradersRaw.map((t) => ({
      code: t.id ?? t.userId,
      name:
        this.selectedLang === 'ar'
          ? t.storeName ?? t.arName ?? t.userName ?? `#${t.id}`
          : t.storeName ?? t.enName ?? t.userName ?? `#${t.id}`,
    }));
  }

  getBreadCrumb() {
    this.bredCrumb = {
      crumbs: [
        { label: this.languageService.translate('Home'), routerLink: '/dashboard-admin' },
        { label: this.languageService.translate(this.pageName()) },
      ],
    };
  }

  openClientWallet() {
    const id = Number(this.clientForm.value.clientId);
    if (!id || id <= 0) return;
    this.router.navigate(['/client/view', id]);
  }

  onTraderSelected(id: number) {
    this.selectedTraderId = Number(id) || 0;
    this.traderForm.patchValue({ traderId: this.selectedTraderId });
  }
}
