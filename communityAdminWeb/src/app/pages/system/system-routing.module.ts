import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "src/app/core/services";
import { ContentComponent } from "../content/content.component";
import { ForceAppUpdateComponent } from "../force-app-update/force-app-update.component";
import { HealthCheckComponent } from "../../health-check/health-check.component";
import { SystemComponent } from "./system.component";

const routes: Routes = [
  {
    path: "",
    canActivate: [AuthGuardService],
    component: SystemComponent,
    children: [
      {
        path: "health-check",
        canActivate: [AuthGuardService],
        component: HealthCheckComponent,
      },
      {
        path: "fau",
        canActivate: [AuthGuardService],
        component: ForceAppUpdateComponent,
      },
      {
        path: "content",
        canActivate: [AuthGuardService],
        component: ContentComponent,
      },
      { path: "", redirectTo: "fau", pathMatch: "full" },
      { path: "**", redirectTo: "fau" },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemRoutingModule {}
