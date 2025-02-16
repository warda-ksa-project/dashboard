import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { LanguageService } from '../../services/language.service';
import { ToasterService } from '../../services/toaster.service';
import { SideNavComponent } from '../../components/side-nav/side-nav.component';
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
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
 
  ngOnInit(): void {
    this.selectedLang = this.languageService.translationService.currentLang;
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
    })
  }

  onClickMenuIcon(){
    this.showMenuIcon=!this.showMenuIcon
  }

  onClickOutSideCompleted(event:boolean){
   if(event)
     this.showMenuIcon=false
  }

}
