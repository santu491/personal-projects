import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { CustomMaterialModule } from "src/app/custom-material.module";

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CustomMaterialModule,
  ],
  declarations: [],
})
export class AddUserModule {}
