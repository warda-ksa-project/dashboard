import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Country {
  id: number;
  enName: string;
  arName: string;
  image: string;
  currency: string;
  phoneLength: string;
  phoneCode: string;
  status: boolean;
  paymentWalletUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private countriesSubject = new BehaviorSubject<Country[]>([]);
  public countries$ = this.countriesSubject.asObservable();
  private selectedCountrySubject = new BehaviorSubject<Country | null>(null);
  public selectedCountry$ = this.selectedCountrySubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadCountries();
  }

  loadCountries(): void {
    this.apiService.get<any>('Country/GetAll').subscribe((res: any) => {
      if (res && res.data) {
        this.countriesSubject.next(res.data);
        
        // Set selected country based on localStorage
        const savedCountryId = localStorage.getItem('countryId');
        if (savedCountryId) {
          const selectedCountry = res.data.find(
            (country: Country) => country.id === Number(savedCountryId)
          );
          if (selectedCountry) {
            this.selectedCountrySubject.next(selectedCountry);
          }
        } else if (res.data.length > 0) {
          // If no country selected, use first one
          this.selectedCountrySubject.next(res.data[0]);
        }
      }
    });
  }

  getCountries(): Country[] {
    return this.countriesSubject.value;
  }

  getSelectedCountry(): Country | null {
    return this.selectedCountrySubject.value;
  }

  getCountryById(id: number): Country | undefined {
    return this.countriesSubject.value.find(
      country => country.id === id
    );
  }

  getCountryByPhoneCode(phoneCode: string): Country | undefined {
    return this.countriesSubject.value.find(
      country => country.phoneCode === phoneCode
    );
  }

  setSelectedCountry(countryId: number): void {
    const country = this.getCountryById(countryId);
    if (country) {
      this.selectedCountrySubject.next(country);
      localStorage.setItem('countryId', countryId.toString());
    }
  }
}
