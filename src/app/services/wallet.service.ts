import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class WalletAdminService {
  private api = inject(ApiService);

  getBalance(clientId: number) {
    return this.api.get(`Wallet/${clientId}/balance`);
  }

  getTransactions(clientId: number) {
    return this.api.get(`Wallet/${clientId}/transactions`);
  }

  createTransaction(body: {
    userId: number;
    transactionType: number;
    amount: number;
    accountName?: string;
    iban?: string;
    bankName?: string;
  }) {
    return this.api.post('Wallet/transactions', {
      userId: body.userId,
      transactionType: body.transactionType,
      amount: body.amount,
      accountName: body.accountName ?? '',
      iban: body.iban ?? '',
      bankName: body.bankName ?? '',
    });
  }

  refundOrder(orderId: number, refundAmount?: number, notes?: string) {
    return this.api.post('Orders/refund', { orderId, refundAmount: refundAmount ?? 0, notes });
  }
}
