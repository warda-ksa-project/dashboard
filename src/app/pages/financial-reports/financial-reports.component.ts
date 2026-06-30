import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialService } from '../../services/financial.service';
import { TranslatePipe } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { LanguageService } from '../../services/language.service';
import { IBreadcrumb } from '../../components/breadcrump/cerqel-breadcrumb.interface';
import { BreadcrumpComponent } from '../../components/breadcrump/breadcrump.component';

@Component({
  selector: 'app-financial-reports',
  standalone: true,
  imports: [CommonModule, TranslatePipe, TableModule, BreadcrumpComponent],
  templateUrl: './financial-reports.component.html',
  styleUrl: './financial-reports.component.scss',
})
export class FinancialReportsComponent implements OnInit {
  private financial = inject(FinancialService);
  languageService = inject(LanguageService);

  pageName = signal('financial_reports.pageName');
  summary: any;
  ledger: any[] = [];
  loading = true;
  bredCrumb: IBreadcrumb = { crumbs: [] };

  ngOnInit() {
    this.getBreadCrumb();
    this.languageService.translationService.onLangChange.subscribe(() => this.getBreadCrumb());

    this.financial.getPlatformSummary().subscribe({
      next: (res: any) => {
        this.summary = res?.data ?? res;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
    this.financial.getLedger().subscribe({
      next: (res: any) => {
        this.ledger = res?.data ?? res ?? [];
      },
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

  formatAmount(value: number | null | undefined, currency = 'SAR'): string {
    const n = Number(value ?? 0);
    return `${n.toLocaleString('ar-SA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
  }

  entryTypeLabel(type: number | string): string {
    const key = typeof type === 'number' ? type : Number(type);
    const keys: Record<number, string> = {
      1: 'financial_reports.entry_payment',
      2: 'financial_reports.entry_settlement',
      3: 'financial_reports.entry_refund',
      4: 'financial_reports.entry_payout',
      5: 'financial_reports.entry_adjustment',
    };
    return this.languageService.translate(keys[key] ?? 'financial_reports.entry_unknown');
  }
}
