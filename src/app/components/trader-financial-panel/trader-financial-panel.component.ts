import { Component, Input, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { FinancialService } from '../../services/financial.service';

@Component({
  selector: 'app-trader-financial-panel',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './trader-financial-panel.component.html',
  styleUrl: './trader-financial-panel.component.scss',
})
export class TraderFinancialPanelComponent implements OnChanges {
  @Input({ required: true }) traderId = 0;

  private financial = inject(FinancialService);
  data: any;
  loading = false;

  ngOnChanges() {
    if (this.traderId > 0) {
      this.load();
    }
  }

  load() {
    this.loading = true;
    this.financial.getTraderDashboard(this.traderId).subscribe({
      next: (res: any) => {
        this.data = res?.data ?? res;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  formatAmount(value: number | null | undefined, currency = 'SAR'): string {
    const n = Number(value ?? 0);
    return `${n.toLocaleString('ar-SA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
  }
}
