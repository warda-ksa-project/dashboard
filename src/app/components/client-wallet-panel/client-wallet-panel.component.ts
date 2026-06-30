import { Component, Input, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { WalletAdminService } from '../../services/wallet.service';
import { LanguageService } from '../../services/language.service';
import { ToasterService } from '../../services/toaster.service';

type WalletOperation = 'deposit' | 'withdraw';

@Component({
  selector: 'app-client-wallet-panel',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    ButtonModule,
    TableModule,
  ],
  templateUrl: './client-wallet-panel.component.html',
  styleUrl: './client-wallet-panel.component.scss',
})
export class ClientWalletPanelComponent implements OnChanges {
  @Input({ required: true }) clientId = 0;

  private wallet = inject(WalletAdminService);
  private toast = inject(ToasterService);
  languageService = inject(LanguageService);

  balance: any;
  transactions: any[] = [];
  operation: WalletOperation = 'deposit';
  submitting = false;

  operationForm = new FormGroup({
    amount: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(0.01)],
    }),
  });

  ngOnChanges() {
    if (this.clientId > 0) {
      this.load();
    }
  }

  setOperation(operation: WalletOperation) {
    this.operation = operation;
    this.operationForm.reset();
  }

  load() {
    this.wallet.getBalance(this.clientId).subscribe((res: any) => {
      this.balance = res?.data ?? res;
    });
    this.wallet.getTransactions(this.clientId).subscribe((res: any) => {
      const list = res?.data ?? res ?? [];
      this.transactions = Array.isArray(list) ? list : [];
    });
  }

  submitOperation() {
    if (this.operationForm.invalid) {
      this.operationForm.markAllAsTouched();
      return;
    }

    const amount = Number(this.operationForm.value.amount);
    const transactionType = this.operation === 'deposit' ? 1 : 2;
    const successKey =
      this.operation === 'deposit'
        ? 'client_wallet.deposit_success'
        : 'client_wallet.withdraw_success';
    const failedKey =
      this.operation === 'deposit'
        ? 'client_wallet.deposit_failed'
        : 'client_wallet.withdraw_failed';

    this.submitting = true;
    this.wallet
      .createTransaction({
        userId: this.clientId,
        transactionType,
        amount,
      })
      .subscribe({
        next: (res: any) => {
          this.submitting = false;
          if (res?.isFailure || res?.isSuccess === false) {
            const code = res?.error?.code ?? '';
            const message =
              code === 'InsufficientBalance'
                ? this.languageService.translate('client_wallet.insufficient_balance')
                : res?.error?.message || this.languageService.translate(failedKey);
            this.toast.errorToaster(message);
            return;
          }
          this.toast.successToaster(this.languageService.translate(successKey));
          this.operationForm.reset();
          this.load();
        },
        error: (err) => {
          this.submitting = false;
          const code = err?.error?.error?.code ?? err?.error?.code ?? '';
          const message =
            code === 'InsufficientBalance'
              ? this.languageService.translate('client_wallet.insufficient_balance')
              : err?.error?.error?.message ||
                err?.error?.message ||
                this.languageService.translate(failedKey);
          this.toast.errorToaster(message);
        },
      });
  }

  formatAmount(value: number | null | undefined, currency = 'SAR'): string {
    const n = Number(value ?? 0);
    return `${n.toLocaleString('ar-SA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
  }

  typeLabel(type: number): string {
    const keys: Record<number, string> = {
      1: 'client_wallet.type_deposit',
      2: 'client_wallet.type_withdraw',
      3: 'client_wallet.type_payment',
      4: 'client_wallet.type_refund',
    };
    return this.languageService.translate(keys[type] ?? 'client_wallet.type_other');
  }

  statusLabel(approved: boolean | number | null | undefined): string {
    if (approved === true || approved === 1) {
      return this.languageService.translate('client_wallet.approved');
    }
    if (approved === 2) {
      return this.languageService.translate('client_wallet.rejected');
    }
    return this.languageService.translate('client_wallet.pending');
  }
}
