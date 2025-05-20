import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DeleteUserPayload } from 'src/app/core/models';
import { baseURL } from 'src/environments/environment';
import { api, secureApi } from 'src/app/core/apiUtils';

@Injectable({
  providedIn: 'root',
})
export class SearchUserService {
  constructor(private httpClient: HttpClient) {}

  deleteUser(payload: DeleteUserPayload) {
    return this.httpClient.put(
      baseURL + secureApi + api.deleteProfile,
      payload
    );
  }

  updateMinor(userId: string, isOptIn: boolean) {
    return this.httpClient.put(
      baseURL +
        secureApi +
        api.updateOptInMinor +
        `/${userId}?isOptIn=${isOptIn}`,
      {}
    );
  }

  fetchExportData(userId:string) {
    return this.httpClient.get(
      baseURL + secureApi + api.exportData,
      {
        params: {
          userId: userId
        }
      }
    );
  }
}
