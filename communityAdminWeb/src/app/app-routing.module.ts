import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "./core/services/index";

const routes: Routes = [
  {
    path: "ui/login",
    loadChildren: () =>
      import("./login/login.module").then((m) => m.LoginModule),
  },
  {
    path: "status",
    loadChildren: () =>
      import("./health-check/health-check.module").then((m) => m.HealthCheckModule),
  },
  {
    path: "ui/pages",
    loadChildren: () =>
      import("./pages/pages.module").then((m) => m.PagesModule),
    canActivate: [AuthGuardService],
  },
  { path: "", redirectTo: "ui/login", pathMatch: "full" },
  { path: "**", redirectTo: "ui/login" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
