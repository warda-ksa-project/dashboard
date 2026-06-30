import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class FinancialService {
  private api = inject(ApiService);

  getPlatformSummary() {
    return this.api.get('Financial/platform/summary');
  }

  getLedger(orderId?: number, page = 1, pageSize = 50) {
    const params = orderId ? `?orderId=${orderId}&page=${page}&pageSize=${pageSize}` : `?page=${page}&pageSize=${pageSize}`;
    return this.api.get(`Financial/ledger${params}`);
  }

  getCommissionSettings() {
    return this.api.get('Financial/commission-settings');
  }

  createCommissionSetting(body: { commissionRate: number; traderId?: number; categoryId?: number; notes?: string }) {
    return this.api.post('Financial/commission-settings', body);
  }

  deleteCommissionSetting(id: number) {
    return this.api.delete('Financial/commission-settings', String(id));
  }

  updateCommissionSetting(body: {
    id: number;
    commissionRate: number;
    isActive: boolean;
    notes?: string;
  }) {
    return this.api.put('Financial/commission-settings', body);
  }

  getSettlements() {
    return this.api.get('Settlements');
  }

  createSettlementBatch() {
    return this.api.post('Settlements', {});
  }

  markSettlementPaid(batchId: number, transferReference: string) {
    return this.api.post(`Settlements/${batchId}/mark-paid`, { transferReference });
  }

  getTraderDashboard(traderId?: number) {
    const q = traderId ? `?traderId=${traderId}` : '';
    return this.api.get(`trader/financial/dashboard${q}`);
  }
}
