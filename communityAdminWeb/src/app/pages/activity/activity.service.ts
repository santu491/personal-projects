import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { api, secureApi } from "src/app/core/apiUtils";
import { PersonaDetailsResponse } from "src/app/core/models";
import { ActivityList } from "src/app/core/models/activity";
import { baseURL } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ActivityService {
  constructor(private httpClient: HttpClient) {}

  // Get All Activities from Server
  getAllActivity(adminId = ''): Observable<ActivityList[]> {
    return this.httpClient.get<ActivityList[]>(
      baseURL + secureApi + api.activity,
      {
        params: {
          adminId: adminId
        }
      }
    );
  }

  // Mark activity as read
  updateActivity(activityId: string): Observable<any> {
    return this.httpClient.put(
      baseURL + secureApi + api.updateActivity + "/" + activityId,
      {}
    );
  }

  /**
   * Get activity count based on read state
   * @param readState activity read state
   *        true for read activity count, false for unread and undefined for total
   * @returns count of activity
   */
  getActivityCount(readState?: boolean): Observable<any> {
    if(readState !== undefined) {
      return this.httpClient.get(
        baseURL + secureApi + api.activity + api.count,
        {
          params: {
            read: readState
          }
        }
      );
    }
    else {
      return this.httpClient.get(
        baseURL + secureApi + api.activity + api.count
      );
    }
  }

  getCommunityPersona(communityId: string): Observable<PersonaDetailsResponse> {
    return this.httpClient.get<PersonaDetailsResponse>(
      baseURL + secureApi + api.communities + api.admins,
      {
        params: {
          communityId: communityId
        }
      }
    );
  }
}
