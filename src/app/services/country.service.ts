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

  constructor(private apiService: ApiService) {
    this.loadCountries();
  }

  loadCountries(): void {
    this.apiService.get<any>('Country/GetAll').subscribe((res: any) => {
      if (res && res.data) {
        this.countriesSubject.next(res.data);
      }
    });
  }

  getCountries(): Country[] {
    return this.countriesSubject.value;
  }

  getCountryByPhoneCode(phoneCode: string): Country | undefined {
    return this.countriesSubject.value.find(
      country => country.phoneCode === phoneCode
    );
  }
}
