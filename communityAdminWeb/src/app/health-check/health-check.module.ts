import { CommonModule } from "@angular/common";
import { HttpClientJsonpModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CustomMaterialModule } from "../custom-material.module";
import { HealthCheckComponent } from "./health-check.component";
import { HealthCheckRoutingModule } from "./health-check.routing.module";

@NgModule({
  declarations: [HealthCheckComponent],
  imports: [
    CommonModule,
    HealthCheckRoutingModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    FormsModule,
    HttpClientJsonpModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HealthCheckModule {}
