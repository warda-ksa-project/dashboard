import {
  Component,
  EventEmitter,
  Inject,
  inject,
  Input,
  Output,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { ToasterService } from '../../services/toaster.service';
import { DOCUMENT, TitleCasePipe } from '@angular/common';
import { PrimeNG } from 'primeng/config';
import { NotificationsComponent } from '../notifications/notifications.component';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    TranslateModule,
    TranslatePipe,
    TitleCasePipe,
    RouterModule,
    NotificationsComponent,
    Tooltip,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  @Input() sidebarCollapsed = false;
  @Output() menuToggle = new EventEmitter<void>();
  @Output() sidebarToggle = new EventEmitter<void>();

  items: any;
  value: any;
  selectedLang: string = localStorage.getItem('lang') || 'en';
  languageService = inject(LanguageService);
  toaster = inject(ToasterService);
  userImage = localStorage.getItem('image');
  userName = localStorage.getItem('name');
  email = localStorage.getItem('email');
  userType = localStorage.getItem('role');
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private primeng: PrimeNG,
  ) {}

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
    this.languageService.change(this.selectedLang);
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
  toggleLanguage() {
    this.selectedLang = this.selectedLang === 'en' ? 'ar' : 'en';
    this.languageService.translationService.currentLang = this.selectedLang;
    this.languageService.change(this.selectedLang);

    this.document.body.dir = this.selectedLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('lang', this.selectedLang);
    document.documentElement.setAttribute(
      'dir',
      this.selectedLang === 'ar' ? 'rtl' : 'ltr',
    );
    window.location.reload();
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  private router = inject(Router);

  logout() {
    this.router.navigate(['/auth/login']).then(() => localStorage.clear());
  }
}
