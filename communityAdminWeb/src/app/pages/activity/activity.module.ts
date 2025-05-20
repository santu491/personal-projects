import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CustomMaterialModule } from "src/app/custom-material.module";
import { ActivityRoutingModule } from "./activity-routing.module";
import { ActivityComponent } from "./activity.component";
import { AdminContentComponent } from "./admin-user/admin-user.component";

@NgModule({
  declarations: [ActivityComponent, AdminContentComponent],
  imports: [CommonModule, ActivityRoutingModule, CustomMaterialModule],
})
export class ActivityModule {}
