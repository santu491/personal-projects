import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { api, secureApi } from "src/app/core/apiUtils";
import {
  AddUserPayload,
  GetProfileResponse,
  UpdateProfilePayload,
} from "src/app/core/models";
import { baseURL } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  constructor(private httpClient: HttpClient) {}

  // Get Admin(Self) Profile from Server
  getMyProfile(): Observable<GetProfileResponse[]> {
    return this.httpClient.get<GetProfileResponse[]>(
      baseURL + secureApi + api.profile
    );
  }

  // Update Admin(Self/Other) Profile
  updateAdminProfile(
    updateProfilePayload: UpdateProfilePayload
  ): Observable<any> {
    return this.httpClient.put(
      baseURL + secureApi + api.profile,
      updateProfilePayload
    );
  }

  // Get All Admin Profiles from Server
  getAllProfile(): Observable<GetProfileResponse[]> {
    return this.httpClient.get<GetProfileResponse[]>(
      baseURL +
        secureApi +
        api.profile +
        `/all?pageNumber=1&pageSize=50&sort=-1`
    );
  }

  // Get any active admin user based on the id.
  getAnyProfile(userId: string): Observable<GetProfileResponse> {
    const URL = baseURL + secureApi + api.profile + '/any';
    return this.httpClient.get<GetProfileResponse>(URL, {
      params: {
        id: userId
      }
    });
  }

  // Add User
  addUser(addUserPayload: AddUserPayload): Observable<any> {
    return this.httpClient.post(
      baseURL + secureApi + api.profile,
      addUserPayload
    );
  }

  // Get App User
  getAppUser(username: string): Observable<any> {
    return this.httpClient.get(
      baseURL + secureApi + api.userProfile + `?username=${username}`,
    );
  }
}
