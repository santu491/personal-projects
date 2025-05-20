import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { api, secureApi } from 'src/app/core/apiUtils';
import { baseURL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private httpClient: HttpClient) {}

  getActiveUsers() {
    return this.httpClient.get(
      baseURL + secureApi + api.activeUserCount);
  }

  /**
   * calls API to retrieve new users count for last 6 month data
   * @returns new users count for last 6 months
   */
  getNewUsersCount() {
    return this.httpClient.get(
      baseURL + secureApi + api.newUserCount);
  }

  getLatestPost() {
    return this.httpClient.get(
      baseURL + secureApi + api.latestPost);
  }

  /**
   * calls API to return the count of activities for each community that the user is part of
   * @returns count of activities on community
   */
  getPostActivities() {
    return this.httpClient.get(
      baseURL + secureApi + api.postActivity);
  }

  getUserCount() {
    return this.httpClient.get(
      baseURL + secureApi + api.userCount);
  }
}
