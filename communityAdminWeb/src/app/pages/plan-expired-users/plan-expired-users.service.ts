import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { api, secureApi } from 'src/app/core/apiUtils';
import { baseURL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanExpiredUsersService {
  constructor(private httpClient: HttpClient) {}

  getPlanExpiredUsers() {
    return this.httpClient.get(baseURL + secureApi + api.expiredUsers);
  }

  updatedUser(payLoad: { approved: boolean; userId: boolean }) {
    return this.httpClient.put(baseURL + secureApi + api.expiredUsers, payLoad);
  }
}
