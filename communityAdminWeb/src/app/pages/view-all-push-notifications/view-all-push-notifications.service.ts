import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { api, secureApi } from "src/app/core/apiUtils";
import { baseURL } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ViewAllPushNotificationsService {
  constructor(private httpClient: HttpClient) {}

  getAllPn(
    pageNumber: number,
    pageSize: number,
    sort: number,
    payload: any
  ): Observable<any> {
    return this.httpClient.post(
      baseURL +
        secureApi +
        api.pushNotification +
        api.all +
        `?pageNumber=${pageNumber}&pageSize=${pageSize}&sort=${sort}`,
      payload
    );
  }

  deletePn(
    id: string
  ): Observable<any> {
    return this.httpClient.delete(
      baseURL + secureApi + api.pushNotification + api.remove,
      {
        params: {
          id: id
        }
      }
    )
  }
}
