import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [Menubar, RouterOutlet],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

  items: MenuItem[] = [];
  languageService = inject(LanguageService);
  selectedLang: any;

  ngOnInit() {
    this.setMenuItems(); // Initialize the menu items

    // Update the selected language when it changes
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.setMenuItems(); // Reinitialize menu items when language changes
    });
  }

  setMenuItems() {
    this.items = [
      {
        label: this.languageService.translate('settings.publicPages'),
        icon: 'pi pi-globe',
        items: [
          {
            label: this.languageService.translate('settings.faqs'),
            icon: 'pi pi-question',
            routerLink: '/settings/faqs'
          },
          {
            label: this.languageService.translate('settings.termsConditions'),
            icon: 'pi pi-eject',
            routerLink: '/settings/terms_conditions'
          },
          {
            label: this.languageService.translate('settings.privacyPolicy'),
            icon: 'pi pi-eject',
            routerLink: '/settings/privacy_policy'
          }
        ]
      },
      {
        label: this.languageService.translate('settings.socialMedia'),
        icon: 'pi pi-share-alt',
        routerLink: '/settings/social_media'
      },
      {
        label: this.languageService.translate('settings.slider'),
        icon: 'pi pi-images',
        routerLink: '/settings/slider'
      },
      {
        label: this.languageService.translate('settings.roles'),
        icon: 'pi pi-bolt',
        routerLink: '/settings/roles'
      },
      {
        label: this.languageService.translate('settings.district'),
        icon: 'pi pi-building',
        routerLink: '/settings/district'
      },
      {
        label: this.languageService.translate('settings.admin'),
        icon: 'pi pi-users',
        routerLink: '/settings/admin'
      },
      {
        label: this.languageService.translate('settings.addNotification'),
        icon: 'pi pi-bell',
        routerLink: '/settings/add_notification'
      }
    ];
  }
}
