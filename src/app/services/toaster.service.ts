import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { LanguageService } from './language.service';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {


  messageService = inject(MessageService);
  languageService = inject(LanguageService);

  constructor() { }

  successToaster(message: string) {
    console.log(message);

   setTimeout(() => {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: this.languageService.translationService.instant(message),
      life: 4000,
    });
   }, 300);
  }

  errorToaster(message: string) {
    console.log('Toaster called with message:', message);
    setTimeout(() => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail:this.languageService.translationService.instant(message),
        life: 4000,
      });
      console.log('MessageService.add invoked');
    }, 300);
  }
}
