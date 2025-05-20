import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { api, secureApi } from "src/app/core/apiUtils";
import { SchedulePNPayload, TargetAudience } from "src/app/core/models";
import { baseURL } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class SchedulePnService {
  constructor(private httpClient: HttpClient) {}

  schedulePushNotification(
    schedulePnPayload: SchedulePNPayload
  ): Observable<any> {
    return this.httpClient.post(
      baseURL + secureApi + api.pushNotification,
      schedulePnPayload
    );
  }

  editPushNotification(
    payload: SchedulePNPayload
  ): Observable<any> {
    return this.httpClient.put(
      baseURL + secureApi + api.pushNotification + api.edit,
      payload
    );
  }

  getAudienceCount(
    payload: TargetAudience
  ): Observable<any> {
    return this.httpClient.post(
      baseURL + secureApi + api.pushNotification + api.count,
      payload
    );
  }
}
