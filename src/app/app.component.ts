import { Component, HostListener, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Toast } from 'primeng/toast';
import { LanguageService } from './services/language.service';
import { wardaLogoPath } from './core/brand-assets';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgxSpinnerModule,
    FormsModule,
    TranslateModule,
    Toast,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  @HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    if (environment.production) {
      event.preventDefault();
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const isDevToolShortcut =
      event.key === 'F12' ||
      (event.ctrlKey && event.shiftKey && event.key === 'I') ||
      (event.ctrlKey && event.shiftKey && event.key === 'J') ||
      (event.ctrlKey && event.key === 'U') ||
      (event.ctrlKey && event.key === 'S');

    if (isDevToolShortcut && environment.production) {
      event.preventDefault();
    }
  }

  private languageService = inject(LanguageService);

  loaderLogoSrc = wardaLogoPath(localStorage.getItem('lang'));
  toastPosition: 'top-left' | 'top-right' = 'top-right';

  ngOnInit(): void {
    this.syncToastPosition(this.languageService.getCurrentLang());
    this.loaderLogoSrc = wardaLogoPath(this.languageService.getCurrentLang());
    this.languageService.onLangChange.subscribe((event) => {
      this.syncToastPosition(event.lang);
      this.loaderLogoSrc = wardaLogoPath(event.lang);
    });
  }

  private syncToastPosition(lang: string | null | undefined): void {
    this.toastPosition = lang === 'ar' ? 'top-left' : 'top-right';
  }
}
