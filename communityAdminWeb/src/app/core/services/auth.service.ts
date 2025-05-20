import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { api, publicApi } from "src/app/core/apiUtils";
import { baseURL } from "src/environments/environment";
import { AdminCredentials, UserDetails } from "../models/user";
@Injectable()
export class AuthService {
  private loggedIn = false;
  private logger = new Subject<boolean>();
  public redirectUrl: any;

  constructor(private httpClient: HttpClient, private router: Router) {}
  isLoggedIn(): Observable<boolean> {
    return this.logger.asObservable();
  }

  adminLogin(payload: AdminCredentials): Observable<any> {
    return this.httpClient.post(baseURL + publicApi + api.login, payload);
  }

  isAdminLoggedIn() {
    if (window.location.pathname != "/ui/login" && this.getToken()) {
      return true;
    } else {
      return false;
    }
  }

  apiVersion() {
    return this.httpClient.get(baseURL + publicApi + api.version);
  }

  setAdminData(value: UserDetails) {
    // Storing data in LocalStorage
    localStorage.setItem("token", value?.token);
    localStorage.setItem("username", value?.username);
    localStorage.setItem("role", value?.role);
    localStorage.setItem("firstName", value?.firstName);
    localStorage.setItem("lastName", value?.lastName);
    localStorage.setItem("id", value?.id);
    localStorage.setItem("communities", JSON.stringify(value?.communities));
    localStorage.setItem("rolePermissions", JSON.stringify(value?.rolePermissions));
    this.loggedIn = Boolean(localStorage.getItem("token"));
    this.logger.next(this.loggedIn);
  }

  logOut() {
    // Clearing data from LocalStorage
    localStorage.clear();
    this.loggedIn = false;
    this.logger.next(this.loggedIn);
    this.router.navigate(["/ui/login"]);
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }
}
