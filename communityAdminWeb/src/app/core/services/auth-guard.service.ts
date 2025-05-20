import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable({ providedIn: "root" })
export class AuthGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Storing the URL to Auth Service
    let url: string = state.url;
    this.auth.redirectUrl = url;
    if (localStorage.getItem("token")) {
      return true;
    } else {
      this.router.navigate(["/ui/login"]);
      return false;
    }
  }
}
