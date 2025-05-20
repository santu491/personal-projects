import { Injectable } from "@angular/core";
import { CanDeactivate, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { ComponentCanDeactivate } from "./component-can-deactivate";
import { postsModule } from "./core/defines";

@Injectable({
  providedIn: "root",
})
export class DirtyCheckGuard implements CanDeactivate<ComponentCanDeactivate> {
  canDeactivate(
    component: ComponentCanDeactivate
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
      return component.canDeactivate();
  }
}
