import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidenavModule } from 'src/app/components/sidenav/sidenav.module';
import { CustomMaterialModule } from 'src/app/custom-material.module';
import { AddUserComponent } from '../add-user/add-user.component';
import { ContentInfoComponent } from '../content-info/content-info.component';
import { FilterPipe } from '../content-info/filter.pipe';
import { ViewAllUsersComponent } from '../view-all-users/view-all-users.component';
import { ModerateRoutingModule } from './moderate-routing.module';
import { ModerateComponent } from './moderate.component';

@NgModule({
  declarations: [
    ModerateComponent,
    AddUserComponent,
    ViewAllUsersComponent,
    ContentInfoComponent,
    FilterPipe
  ],
  imports: [
    CommonModule,
    ModerateRoutingModule,
    SidenavModule,
    FormsModule,
    ReactiveFormsModule,
    CustomMaterialModule
  ]
})
export class ModerateModule {}
