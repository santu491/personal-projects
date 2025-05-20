import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { CustomMaterialModule } from "src/app/custom-material.module";
import { SidenavComponent } from "./sidenav.component";

@NgModule({
  declarations: [SidenavComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CustomMaterialModule,
  ],
  exports: [SidenavComponent],
})
export class SidenavModule {}
