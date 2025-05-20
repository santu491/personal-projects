import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { PickerModule } from "@ctrl/ngx-emoji-mart";
import {
  MultilevelMenuService,
  NgMaterialMultilevelMenuModule,
} from "ng-material-multilevel-menu";
import { NgxSpinnerModule } from "ngx-spinner";
import { ToastrModule } from "ngx-toastr";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FooterComponent } from "./components/footer/footer.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import {
  AuthGuardService,
  AuthService,
  HttpLoadingInterceptor,
  TokenInterceptorService,
} from "./core/services";
import { CustomMaterialModule } from "./custom-material.module";
import { DraftContentService } from "./pages/draft-content/draft-content.service";

@NgModule({
  declarations: [AppComponent, NavbarComponent, FooterComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    NgxSpinnerModule,
    CustomMaterialModule,
    NgMaterialMultilevelMenuModule,
    PickerModule,
  ],
  providers: [
    AuthGuardService,
    AuthService,
    DraftContentService,
    MultilevelMenuService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpLoadingInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
