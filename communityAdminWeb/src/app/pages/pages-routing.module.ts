import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "../core/services/index";
import { PagesComponent } from "./pages.component";

const routes: Routes = [
  {
    path: "",
    component: PagesComponent,
    children: [
      {
        path: "home",
        loadChildren: () =>
          import("./home/home.module").then((m) => m.HomeModule),
        canActivate: [AuthGuardService]
      },
      {
        path: "engage",
        loadChildren: () =>
          import("./engage/engage.module").then((m) => m.EngageModule),
        canActivate: [AuthGuardService],
      },
      {
        path: "metrics",
        loadChildren: () =>
          import("./metrics/metrics.module").then((m) => m.MetricsModule),
        canActivate: [AuthGuardService]
      },
      {
        path: "moderate",
        loadChildren: () =>
          import("./moderate/moderate.module").then((m) => m.ModerateModule),
        canActivate: [AuthGuardService],
      },
      {
        path: "admin",
        loadChildren: () =>
          import("./admin/admin.module").then((m) => m.AdminModule),
        canActivate: [AuthGuardService],
      },
      {
        path: "system",
        loadChildren: () =>
          import("./system/system.module").then((m) => m.SystemModule),
        canActivate: [AuthGuardService],
      },
      {
        path: "profile",
        loadChildren: () =>
          import("./profile/profile.module").then((m) => m.ProfileModule),
        canActivate: [AuthGuardService],
      },
      {
        path: "settings",
        loadChildren: () =>
          import("./settings/settings.module").then((m) => m.SettingsModule),
        canActivate: [AuthGuardService],
      },
      {
        path: "activity",
        loadChildren: () =>
          import("./activity/activity.module").then((m) => m.ActivityModule),
        canActivate: [AuthGuardService],
      },
      { path: "", redirectTo: "home", pathMatch: "full" },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
