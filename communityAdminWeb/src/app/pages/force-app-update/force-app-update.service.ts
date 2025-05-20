import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { api, secureApi } from "src/app/core/apiUtils";
import {
  AppVersionPayload,
  AppVersionResponse,
} from "src/app/core/models/appVersion";
import { baseURL } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ForceAppUpdateService {
  constructor(private httpClient: HttpClient) {}

  // Get AppVersion
  getAppVersion(): Observable<AppVersionResponse> {
    return this.httpClient.get<AppVersionResponse>(
      baseURL + secureApi + api.appVersion
    );
  }

  // Update AppVersion
  updateAppVersion(updateAppVersion: AppVersionPayload): Observable<any> {
    return this.httpClient.put(
      baseURL + secureApi + api.appVersion,
      updateAppVersion
    );
  }
}
