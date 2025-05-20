import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'src/app/core/services';
import { DirtyCheckGuard } from 'src/app/dirtycheck.guard';
import { DraftContentComponent } from '../draft-content/draft-content.component';
import { HelpComponent } from '../help/help.component';
import { MetricsPnComponent } from '../metrics-pn/metrics-pn.component';
import { SchedulePnComponent } from '../schedule-pn/schedule-pn.component';
import { SearchComponent } from '../search/search.component';
import { ViewAllPostsComponent } from '../view-all-posts/view-all-posts.component';
import { ViewAllPushNotificationsComponent } from '../view-all-push-notifications/view-all-push-notifications.component';
import { ViewDraftsComponent } from '../view-drafts/view-drafts.component';
import { ViewStoriesComponent } from '../view-stories/view-stories.component';
import { EngageComponent } from './engage.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuardService],
    component: EngageComponent,
    children: [
      {
        path: 'view-all-posts',
        component: ViewAllPostsComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'draft-content',
        canActivate: [AuthGuardService],
        component: DraftContentComponent,
        canDeactivate: [DirtyCheckGuard]
      },
      {
        path: 'view-drafts',
        canActivate: [AuthGuardService],
        component: ViewDraftsComponent
      },
      {
        path: 'search/:postId',
        canActivate: [AuthGuardService],
        component: SearchComponent
      },
      {
        path: 'search',
        canActivate: [AuthGuardService],
        component: SearchComponent
      },
      {
        path: 'view-stories',
        canActivate: [AuthGuardService],
        component: ViewStoriesComponent
      },
      {
        path: 'schedule',
        canActivate: [AuthGuardService],
        component: SchedulePnComponent
      },
      {
        path: 'view-all-push-notifications',
        canActivate: [AuthGuardService],
        component: ViewAllPushNotificationsComponent
      },
      {
        path: 'pn/metrics',
        canActivate: [AuthGuardService],
        component: MetricsPnComponent
      },
      {
        path: 'help',
        canActivate: [AuthGuardService],
        component: HelpComponent
      },
      { path: '', redirectTo: 'draft-content', pathMatch: 'full' },
      { path: '**', redirectTo: 'draft-content' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EngageRoutingModule {}
