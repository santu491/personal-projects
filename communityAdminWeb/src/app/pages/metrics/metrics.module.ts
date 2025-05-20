import { CommonModule } from '@angular/common';
import { HttpClientJsonpModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { DateRangePickerComponent } from 'src/app/components/date-range-picker/date-range-picker.component';
import { CustomMaterialModule } from 'src/app/custom-material.module';
import { MemberFilterComponent } from './member-filter/member-filter.component';
import { MetricsDataComponent } from './metrics-data/metrics-data.component';
import { MetricsRoutingModule } from './metrics-routing.module';
import { MetricsComponent } from './metrics.component';

@NgModule({
  declarations: [MetricsComponent, MemberFilterComponent, MetricsDataComponent],
  imports: [
    CommonModule,
    CustomMaterialModule,
    HttpClientJsonpModule,
    MetricsRoutingModule,
    DateRangePickerComponent
  ]
})
export class MetricsModule {}
