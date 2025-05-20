import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'src/app/core/services';
import { AddUserComponent } from '../add-user/add-user.component';
import { ContentInfoComponent } from '../content-info/content-info.component';
import { ViewAllUsersComponent } from '../view-all-users/view-all-users.component';
import { ModerateComponent } from './moderate.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuardService],
    component: ModerateComponent,
    children: [
      {
        path: 'add-user',
        canActivate: [AuthGuardService],
        component: AddUserComponent
      },
      {
        path: 'view-user',
        canActivate: [AuthGuardService],
        component: ViewAllUsersComponent
      },
      {
        path: 'word-bank',
        canActivate: [AuthGuardService],
        component: ContentInfoComponent
      },
      { path: '', redirectTo: 'add-user', pathMatch: 'full' },
      { path: '**', redirectTo: 'add-user' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModerateRoutingModule {}
