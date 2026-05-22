import { NgClass, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Tooltip } from 'primeng/tooltip';
import { LanguageService } from '../../services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterLinkActive, RouterModule } from '@angular/router';
import { MenuItem, menuItems, Roles } from '../../conts';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../services/api.service';
import { InputTextComponent } from '../input-text/input-text.component';
import { SelectComponent } from '../select/select.component';
import { FormControl } from '@angular/forms';
import { CountryService } from '../../services/country.service';
import { wardaLogoPath } from '../../core/brand-assets';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgClass, NgFor , Tooltip ,UpperCasePipe, TranslateModule, NgIf, RouterModule,InputTextComponent , RouterLinkActive, SelectComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent  {
  @Input() activeRoute = '';
  @Input() collapsed = false;
  @Output() toggleSidebar = new EventEmitter<void>();
  isTrader: boolean = false;
  isAdmin: boolean = false;
  selectedLang: any;
  languageService = inject(LanguageService);
  apiService=inject(ApiService);
  countryService = inject(CountryService);

  userDate=JSON.parse(localStorage.getItem('userData')as any);
  defaultImage=this.userDate?.gender==1?'assets/images/arabian-man.png':'assets/images/arabian-woman.png'
  routingList : MenuItem[] = menuItems
  role!:Roles;

  get brandLogoSrc(): string {
    return wardaLogoPath(this.languageService.getCurrentLang());
  }

  get toggleIconClass(): string {
    const isRtl = this.selectedLang === 'ar';
    if (this.collapsed) {
      return isRtl ? 'pi-angle-left' : 'pi-angle-right';
    }
    return isRtl ? 'pi-angle-right' : 'pi-angle-left';
  }
  
  // Country dropdown
  countries: any[] = [];
  countryControl = new FormControl();

  ngOnInit(): void {
    this.getRoles()
    this.selectedLang = this.languageService.translationService.currentLang;
    this.languageService.translationService.onLangChange.subscribe(() => {
     this.getRoles()
      this.selectedLang = this.languageService.translationService.currentLang;
      this.loadCountries();
    })
    this.loadCountries();
    this.initCountrySelection();
  }
  
  loadCountries() {
    this.apiService.get('Countries').subscribe((res: any) => {
      if (res.data) {
        this.countries = res.data.map((country: any) => ({
          name: this.selectedLang === 'en' ? country.enName : country.arName,
          code: country.id,
        }));
      }
    });
  }
  
  initCountrySelection() {
    this.role = (localStorage.getItem('role') || '') as Roles;
    this.isAdmin = this.role === Roles.admin;
    this.isTrader = this.role === Roles.trader;
    
    const savedCountryId = localStorage.getItem('countryId');
    if (savedCountryId) {
      this.countryControl.setValue(Number(savedCountryId));
    }
  }
  
  onCountryChange(countryId: number) {
    if (countryId) {
      // Update selected country in service
      this.countryService.setSelectedCountry(countryId);
      // Reload to apply new country header
      window.location.reload();
    }
  }
  getRoles(){
    this.role = (localStorage.getItem('role') || '') as Roles;
    this.isAdmin = this.role === Roles.admin;
    this.isTrader = this.role === Roles.trader;
  }
  onFilterMenu(text:string){
    this.routingList= this.routingList.filter(item => item.id.toLowerCase().includes(text.toLowerCase()));
          if(text=='')
            this.routingList=   menuItems
    }

  private router: Router = inject(Router);

  logOut(){
    this.router.navigate(['/auth/login']).then(() => localStorage.clear());
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }
}
