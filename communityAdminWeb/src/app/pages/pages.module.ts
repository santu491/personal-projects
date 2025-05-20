import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';

@NgModule({
  declarations: [PagesComponent],
  imports: [CommonModule, PagesRoutingModule, NgxSpinnerModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PagesModule {}
