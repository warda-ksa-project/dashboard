import { inject, Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { TraderProfile, UpdateProfileReqBody } from './trader.model';

@Injectable()
export class TraderService {
  //DEPS//
  private api = inject(ApiService);

  //PROPS
  private readonly endpoint = 'Traders';

  //METHODS
  getProfile(id: number) {
    return this.api.get<{ data: TraderProfile }>(`${this.endpoint}/${id}`);
  }

  updateProfile(body: UpdateProfileReqBody) {
    return this.api.patch(`${this.endpoint}/UpdateProfile`, body);
  }
}
