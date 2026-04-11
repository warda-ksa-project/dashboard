import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Toast } from 'primeng/toast';
import { LanguageService } from './services/language.service';
import { wardaLogoPath } from './core/brand-assets';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxSpinnerModule, FormsModule, TranslateModule, Toast],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  private languageService = inject(LanguageService);

  loaderLogoSrc = wardaLogoPath(localStorage.getItem('lang'));

  ngOnInit(): void {
    this.loaderLogoSrc = wardaLogoPath(this.languageService.getCurrentLang());
    this.languageService.onLangChange.subscribe(() => {
      this.loaderLogoSrc = wardaLogoPath(this.languageService.getCurrentLang());
    });
  }
}
