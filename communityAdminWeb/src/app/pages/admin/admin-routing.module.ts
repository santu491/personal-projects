import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'src/app/core/services';
import { DirtyCheckGuard } from 'src/app/dirtycheck.guard';
import { AddCommunityComponent } from '../add-community/add-community.component';
import { AddSectionComponent } from '../add-section/add-section.component';
import { CommunityComponent } from '../community/community.component';
import { HelpfulInfoComponent } from '../helpful-info/helpful-info.component';
import { NotificationComponent } from '../notificationTemplate/notification.component';
import { PartnersComponent } from '../partners/partners.component';
import { PlanExpiredUsersComponent } from '../plan-expired-users/plan-expired-users.component';
import { PromptsComponent } from '../prompts/prompts.component';
import { SearchUserComponent } from '../search-user/search-user.component';
import { TouAndPrivacyPolicyComponent } from '../tou-and-privacy-policy/tou-and-privacy-policy.component';
import { AdminComponent } from './admin.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuardService],
    component: AdminComponent,
    children: [
      {
        path: 'search-user',
        canActivate: [AuthGuardService],
        component: SearchUserComponent
      },
      {
        path: 'plan-expired-users',
        canActivate: [AuthGuardService],
        component: PlanExpiredUsersComponent
      },
      {
        path: 'community',
        canActivate: [AuthGuardService],
        component: CommunityComponent
      },
      {
        path: 'add-community',
        canActivate: [AuthGuardService],
        component: AddCommunityComponent
      },
      {
        path: 'add-prompts',
        canActivate: [AuthGuardService],
        component: PromptsComponent
      },
      {
        path: 'add-helpful-info',
        canActivate: [AuthGuardService],
        component: HelpfulInfoComponent
      },
      {
        path: 'add-section',
        canActivate: [AuthGuardService],
        component: AddSectionComponent,
        canDeactivate: [DirtyCheckGuard]
      },
      {
        path: 'partners',
        canActivate: [AuthGuardService],
        component: PartnersComponent
      },
      {
        path: 'notification',
        canActivate: [AuthGuardService],
        component: NotificationComponent
      },
      {
        path: 'tou-privacy-policy',
        canActivate: [AuthGuardService],
        component: TouAndPrivacyPolicyComponent
      },
      { path: '', redirectTo: 'search-user', pathMatch: 'full' },
      { path: '**', redirectTo: 'search-user' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
