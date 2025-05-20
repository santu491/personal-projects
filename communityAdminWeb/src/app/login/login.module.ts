import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CustomMaterialModule } from "../custom-material.module";
import { LoginRoutingModule } from "./login-routing.module";
import { LoginComponent } from "./login.component";

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    CustomMaterialModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginModule {}
