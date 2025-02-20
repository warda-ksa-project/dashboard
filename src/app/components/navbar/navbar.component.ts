import { Component, Inject, inject} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { AutoComplete } from 'primeng/autocomplete';
import { Select } from 'primeng/select';
import { LanguageService } from '../../services/language.service';
import { ToasterService } from '../../services/toaster.service';
import { DOCUMENT, NgFor } from '@angular/common';
import { PrimeNG } from 'primeng/config';
import { InputGroup, InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { NotificationsComponent } from "../notifications/notifications.component";



interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [TranslateModule,TranslatePipe, RouterModule,InputGroupModule,InputGroup, AutoComplete, FormsModule, Select, NotificationsComponent , InputGroup, InputTextModule, NgFor, NotificationsComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  items: any;
  value: any;
  langOptions = [
    { name: 'English', code: 'en', icon: 'assets/images/icons/en-lang.png' },
    { name: 'العربية', code: 'ar', icon: 'assets/images/icons/ar-lang.png' },
  ];
  selectedLang: string = localStorage.getItem('lang') || 'en';
  languageService = inject(LanguageService);
  toaster = inject(ToasterService);

  constructor(@Inject(DOCUMENT) private document: Document,private primeng: PrimeNG) {}

  search(event: AutoCompleteCompleteEvent) {
      this.items = [...Array(10).keys()].map(item => event.query + '-' + item);
  }

  ngOnInit(): void {
    this.primeng.ripple.set(true);
    this.initAppTranslation();
  }

  public initAppTranslation() {
    this.languageService.changeAppDirection(this.selectedLang);
    this.languageService.changeHtmlLang(this.selectedLang);
    this.languageService.use(this.selectedLang);
  }

  onLangChange() {
    this.languageService.change(this.selectedLang)
    this.document.body.dir = this.selectedLang === 'ar' ? 'rtl' : 'ltr';
    this.selectedLang === 'en'
      ? document.getElementsByTagName('html')[0].setAttribute('dir', 'ltr')
      : document.getElementsByTagName('html')[0].setAttribute('dir', 'rtl');
    this.selectedLang === 'en'
      ? document.getElementsByTagName('html')[0].setAttribute('lang', 'en')
      : document.getElementsByTagName('html')[0].setAttribute('lang', 'ar');

      document.documentElement.setAttribute('lang', this.selectedLang);
      if (this.selectedLang === 'ar') {
        document.documentElement.classList.add('arabic');
      } else {
        document.documentElement.classList.remove('arabic');
      }

  }

  logout() {
    localStorage.removeItem('token');

  }
}
