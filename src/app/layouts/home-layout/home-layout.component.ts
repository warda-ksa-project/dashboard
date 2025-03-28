import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { LanguageService } from '../../services/language.service';
import { ToasterService } from '../../services/toaster.service';
import { SideNavComponent } from '../../components/side-nav/side-nav.component';
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { filter } from 'rxjs';
@Component({
  selector: 'app-home-layout',
  standalone: true,
  imports: [RouterOutlet, Toast, SideNavComponent, SidebarComponent, NavbarComponent,ClickOutsideDirective],
  templateUrl: './home-layout.component.html',
  styleUrl: './home-layout.component.scss'
})
export class HomeLayoutComponent {
  showMenuIcon:boolean=false
  selectedLang: any;
  languageService = inject(LanguageService);
  toaster = inject(ToasterService);
  public router=inject( Router);
  isDashboardStyle=false
  ngOnInit(): void {
    this.checkRoute(this.router.url);
    this.selectedLang = this.languageService.translationService.currentLang;
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.checkRoute(this.router.url);
    })
    this.router.events
    .pipe(filter((event) => event instanceof NavigationEnd))
    .subscribe((event: any) => {
      this.isDashboardStyle = event.url.includes('dashboard');
    });
  }
  private checkRoute(url: string): void {
    this.isDashboardStyle = url.includes('dashboard');
  }
  onClickMenuIcon(){
    this.showMenuIcon=!this.showMenuIcon
  }

  onClickOutSideCompleted(event:boolean){
   if(event)
     this.showMenuIcon=false
  }


}
