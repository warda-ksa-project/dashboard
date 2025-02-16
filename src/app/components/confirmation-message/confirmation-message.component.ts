import { Component, Input, input } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-confirmation-message',
  standalone: true,
  imports: [ConfirmDialog,ButtonModule,ToastModule],
  templateUrl: './confirmation-message.component.html',
  styleUrl: './confirmation-message.component.scss'
})
export class ConfirmationMessageComponent {
@Input()confirmButton:string='Confirm'
@Input()closeButton:string='Close'



  constructor(private confirmationService: ConfirmationService, private messageService: MessageService) {}

  confirm(event: Event) {
      this.confirmationService.confirm({
          target: event.target as EventTarget,
          message: 'Are you sure that you want to proceed?',
          header: 'Confirmation',
          closable: true,
          closeOnEscape: true,
          icon: 'pi pi-exclamation-triangle',
          rejectButtonProps: {
              label: 'Cancel',
              severity: 'secondary',
              outlined: true,
          },
          acceptButtonProps: {
              label: 'Save',
          },
          accept: () => {
              this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
          },
          reject: () => {
              this.messageService.add({
                  severity: 'error',
                  summary: 'Rejected',
                  detail: 'You have rejected',
                  life: 3000,
              });
          },
      });
  }

  close(event: Event) {
      this.confirmationService.confirm({
          target: event.target as EventTarget,
          message: 'Do you want to delete this record?',
          header: 'Danger Zone',
          icon: 'pi pi-info-circle',
          rejectLabel: 'Cancel',
          rejectButtonProps: {
              label: 'Cancel',
              severity: 'secondary',
              outlined: true,
          },
          acceptButtonProps: {
              label: 'Delete',
              severity: 'danger',
          },

          accept: () => {
              this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
          },
          reject: () => {
              this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
          },
      });
  }
}