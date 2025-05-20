import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SidenavModule } from "src/app/components/sidenav/sidenav.module";
import { CustomMaterialModule } from "src/app/custom-material.module";
import { ContentComponent } from "../content/content.component";
import { ForceAppUpdateComponent } from "../force-app-update/force-app-update.component";
import { SystemRoutingModule } from "./system-routing.module";
import { SystemComponent } from "./system.component";

@NgModule({
  declarations: [
    SystemComponent,
    ForceAppUpdateComponent,
    ContentComponent
  ],
  imports: [
    CommonModule,
    SystemRoutingModule,
    SidenavModule,
    FormsModule,
    ReactiveFormsModule,
    CustomMaterialModule,
  ],
})
export class SystemModule {}
