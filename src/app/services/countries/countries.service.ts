import { inject, Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Country } from './countries.model';

@Injectable()
export class CountriesService {
  //DEPS//
  private api = inject(ApiService);

  //PROPS//
  private readonly endpoint = `Countries`;

  getCountry() {
    const countryId = +(localStorage.getItem('countryId') as string) || 1;
    return this.api.get<{ data: Country }>(`${this.endpoint}/${countryId}`);
  }
}
