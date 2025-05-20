import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HealthCheckComponent } from './health-check.component';

const routes: Routes = [
  {
    path: "",
    component: HealthCheckComponent,
    children: [
      {
        path: "status",
        loadChildren: () =>
          import("./health-check.module").then((m) => m.HealthCheckModule)
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HealthCheckRoutingModule { }