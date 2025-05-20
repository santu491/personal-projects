import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CustomMaterialModule } from "src/app/custom-material.module";
import { ProfileRoutingModule } from "./profile-routing.module";
import { ProfileComponent } from "./profile.component";

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    CustomMaterialModule,
  ],
})
export class ProfileModule {}
