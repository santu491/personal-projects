import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { api, secureApi } from "src/app/core/apiUtils";
import { GetProfileResponse } from "src/app/core/models";
import { baseURL } from "src/environments/environment";

@Injectable({
  providedIn: 'root',
})
export class ViewAllUsersService {
  constructor(private httpClient: HttpClient) {}

  private editUserDetails: GetProfileResponse | undefined;

  // Delete User by ID
  deleteUserById(id: string, active: boolean) {
    return this.httpClient.put(
      baseURL + secureApi + api.updateActiveFlag + `?id=${id}&active=${active}`,
      {}
    );
  }

  setUserDetails(data: GetProfileResponse | any) {
    this.editUserDetails = data;
  }

  getUserDetails() {
    return this.editUserDetails;
  }
}
