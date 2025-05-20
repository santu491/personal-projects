import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { api, secureApi } from 'src/app/core/apiUtils';
import { baseURL } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class TouAndPrivacyPolicyService {
  constructor(private httpClient: HttpClient) {}

  triggerEmail(): Observable<any> {
    return this.httpClient.post(
      baseURL + secureApi + api.emailNotification,
      {}
    );
  }

  getMassEmailInfo(): Observable<any> {
    return this.httpClient.get(baseURL + secureApi + api.touMassEmailInfo);
  }
}
