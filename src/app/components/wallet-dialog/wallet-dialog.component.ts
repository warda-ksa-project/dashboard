import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../services/api.service';
import { ToasterService } from '../../services/toaster.service';

@Component({
  selector: 'app-wallet-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputNumberModule,
    DialogModule,
    ButtonModule,
    TranslateModule,
  ],
  templateUrl: './wallet-dialog.component.html',
  styleUrls: ['./wallet-dialog.component.scss'],
})
export class WalletDialogComponent {
  @Input() clientId!: number; // Input property for clientId
  @Output() amountAdded = new EventEmitter<boolean>(); // Output property to emit success status
  displayDialog: boolean = false; // Controls dialog visibility
  walletForm: FormGroup;
  private ApiService = inject(ApiService);
  private toaster = inject(ToasterService);


  constructor(
    private fb: FormBuilder

  ) {
    this.walletForm = this.fb.group({
      walletTransactionId: 0,
      transactionType: 1,
      userId: [null], // Add clientId to the form
      amount: [null, [Validators.required, Validators.min(1)]], // Validation for required and minimum value
    });
  }

  // Open the dialog
  showDialog() {
    this.walletForm.patchValue({ userId: +this.clientId }); // Set clientId in the form
    this.displayDialog = true;
  }

  // Close the dialog
  hideDialog() {
    this.displayDialog = false;
    this.walletForm.reset(); // Reset the form on close
  }

  // Handle form submission
  onSubmit() {
    if (this.walletForm.valid) {
      console.log('Form Submitted:', this.walletForm.value);
      this.addAmount();
      this.amountAdded.emit(true);
      this.toaster.successToaster('Amount Added');
      this.hideDialog(); // Close the dialog after submission
    } else {
      console.log('Form is invalid');
    }
  }

  addAmount() {
    this.ApiService.post('Wallet/WalletTransaction' ,this.walletForm.value).subscribe((data: any) => {
      console.log(data);
    })
  }
}
