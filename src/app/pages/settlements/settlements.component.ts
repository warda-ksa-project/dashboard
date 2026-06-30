import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FinancialService } from '../../services/financial.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { SelectComponent } from '../../components/select/select.component';
import { InputTextComponent } from '../../components/input-text/input-text.component';
import { IBreadcrumb } from '../../components/breadcrump/cerqel-breadcrumb.interface';
import { BreadcrumpComponent } from '../../components/breadcrump/breadcrump.component';

@Component({
  selector: 'app-settlements',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    TranslatePipe,
    TitleCasePipe,
    SelectComponent,
    InputTextComponent,
    BreadcrumpComponent,
  ],
  templateUrl: './settlements.component.html',
  styleUrl: './settlements.component.scss',
})
export class SettlementsComponent implements OnInit {
  private financial = inject(FinancialService);
  languageService = inject(LanguageService);

  pageName = signal('settlements.pageName');
  batches: any[] = [];
  batchOptions: { name: string; code: number }[] = [];
  selectedLang = 'ar';
  bredCrumb: IBreadcrumb = { crumbs: [] };
  creating = false;
  marking = false;

  markPaidForm = new FormGroup({
    batchId: new FormControl<number>(0, Validators.required),
    transferReference: new FormControl('', Validators.required),
  });

  ngOnInit() {
    this.selectedLang = this.languageService.translationService.currentLang;
    this.getBreadCrumb();
    this.languageService.translationService.onLangChange.subscribe((e) => {
      this.selectedLang = e.lang;
      this.getBreadCrumb();
      this.buildBatchOptions();
    });
    this.load();
  }

  getBreadCrumb() {
    this.bredCrumb = {
      crumbs: [
        { label: this.languageService.translate('Home'), routerLink: '/dashboard-admin' },
        { label: this.languageService.translate(this.pageName()) },
      ],
    };
  }

  load() {
    this.financial.getSettlements().subscribe((res: any) => {
      this.batches = res?.data ?? res ?? [];
      this.buildBatchOptions();
    });
  }

  buildBatchOptions() {
    const pending = this.batches.filter((b) => b.status === 1 || b.status === 2);
    this.batchOptions = pending.map((b) => ({
      code: b.id,
      name: `${b.batchReference} — ${b.totalAmount} ${b.currency}`,
    }));
  }

  createBatch() {
    this.creating = true;
    this.financial.createSettlementBatch().subscribe({
      next: () => {
        this.creating = false;
        this.load();
      },
      error: () => (this.creating = false),
    });
  }

  markPaid() {
    if (this.markPaidForm.invalid) {
      this.markPaidForm.markAllAsTouched();
      return;
    }
    const batchId = this.markPaidForm.value.batchId;
    const transferReference = this.markPaidForm.value.transferReference?.trim();
    if (!batchId || batchId <= 0 || !transferReference) return;

    this.marking = true;
    this.financial.markSettlementPaid(batchId, transferReference).subscribe({
      next: () => {
        this.marking = false;
        this.markPaidForm.reset({ batchId: 0, transferReference: '' });
        this.load();
      },
      error: () => (this.marking = false),
    });
  }

  statusLabel(status: number): string {
    const keys: Record<number, string> = {
      1: 'settlements.status_draft',
      2: 'settlements.status_processing',
      3: 'settlements.status_paid',
      4: 'settlements.status_cancelled',
    };
    return this.languageService.translate(keys[status] ?? 'settlements.status_unknown');
  }
}
