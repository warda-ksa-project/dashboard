import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { ToasterService } from '../../services/toaster.service';
import { SignalRService } from '../../services/signalr.service';
import { SideNavComponent } from '../../components/side-nav/side-nav.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { SidebarStateService } from '../../services/sidebar-state.service';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-home-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    SideNavComponent,
    SidebarComponent,
    NavbarComponent,
    ClickOutsideDirective,
  ],
  templateUrl: './home-layout.component.html',
  styleUrl: './home-layout.component.scss',
})
export class HomeLayoutComponent implements OnInit, OnDestroy {
  showMenuIcon = false;
  selectedLang: any;
  languageService = inject(LanguageService);
  toaster = inject(ToasterService);
  signalR = inject(SignalRService);
  sidebarState = inject(SidebarStateService);
  router = inject(Router);
  isDashboardStyle = false;
  private signalRSub?: Subscription;

  ngOnInit(): void {
    this.checkRoute(this.router.url);
    this.selectedLang = this.languageService.translationService.currentLang;
    this.signalR.connect();
    this.signalRSub = this.signalR.dashboardUpdate$.subscribe((update) => {
      const message =
        this.selectedLang === 'ar'
          ? update.messageAr || update.messageEn
          : update.messageEn || update.messageAr;
      if (message) {
        this.toaster.infoToaster(message);
      }
    });
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.checkRoute(this.router.url);
    });
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isDashboardStyle = event.url.includes('dashboard');
      });
  }

  ngOnDestroy(): void {
    this.signalRSub?.unsubscribe();
    this.signalR.disconnect();
  }

  private checkRoute(url: string): void {
    this.isDashboardStyle = url.includes('dashboard');
  }

  onMobileMenuToggle(): void {
    this.showMenuIcon = !this.showMenuIcon;
  }

  onClickOutSideCompleted(event: boolean): void {
    if (event) {
      this.showMenuIcon = false;
    }
  }
}
