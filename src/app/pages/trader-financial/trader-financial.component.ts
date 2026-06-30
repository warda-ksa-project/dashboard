import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialService } from '../../services/financial.service';

@Component({
  selector: 'app-trader-financial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trader-financial.component.html',
})
export class TraderFinancialComponent implements OnInit {
  private financial = inject(FinancialService);
  data: any;

  ngOnInit() {
    this.financial.getTraderDashboard().subscribe((res: any) => {
      this.data = res?.data ?? res;
    });
  }
}
