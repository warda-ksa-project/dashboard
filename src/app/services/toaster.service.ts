import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  private messageService = inject(MessageService);
  private translate = inject(TranslateService);

  successToaster(message: string): void {
    this.show('success', this.getTranslation('success'), message);
  }

  errorToaster(message: string): void {
    this.show('error', this.getTranslation('error'), message);
  }

  warningToaster(message: string): void {
    this.show('warn', this.getTranslation('warning'), message);
  }

  infoToaster(message: string): void {
    this.show('info', this.getTranslation('info'), message);
  }

  private getTranslation(key: string): string {
    const translation = this.translate.instant(key);
    return translation !== key ? translation : key;
  }

  private show(
    severity: 'success' | 'error' | 'warn' | 'info',
    summary: string,
    message: string
  ): void {
    const translatedMessage = message ? this.getTranslation(message) : '';
    this.messageService.add({
      severity,
      summary,
      detail: translatedMessage,
      life: 4000
    });
  }
}
