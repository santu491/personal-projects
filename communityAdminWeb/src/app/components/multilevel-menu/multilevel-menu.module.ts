import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { CustomMaterialModule } from "src/app/custom-material.module";
import { MultilevelMenuComponent } from "./multilevel-menu.component";
import { NgMaterialMultilevelMenuModule } from "ng-material-multilevel-menu";

@NgModule({
  declarations: [MultilevelMenuComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CustomMaterialModule,
    NgMaterialMultilevelMenuModule,
  ],
  exports: [MultilevelMenuComponent],
})
export class MultilevelMenuModule {}
