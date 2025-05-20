import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ForceAppUpdateComponent } from "./force-app-update.component";

const routes: Routes = [{ path: "", component: ForceAppUpdateComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForceAppUpdateRoutingModule {}
