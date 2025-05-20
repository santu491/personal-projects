import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CustomMaterialModule } from 'src/app/custom-material.module';
import { ActiveUserBoardComponent } from './active-user-board/active-user-board.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { LatestPostsComponent } from './latest-posts/latest-posts.component';
import { PostQuickViewComponent } from './latest-posts/post-quick-view/post-quick-view.component';
import { NewUsersChartComponent } from './new-users-chart/new-users-chart.component';
import { CommunityActivityChartComponent } from './community-activity-chart/community-activity-chart.component';
import { QuickLinksComponent } from './quick-links/quick-links.component';
import { UserTypeChartComponent } from './user-type-chart/user-type-chart.component';

@NgModule({
  declarations: [
    HomeComponent,
    ActiveUserBoardComponent,
    NewUsersChartComponent,
    LatestPostsComponent,
    PostQuickViewComponent,
    CommunityActivityChartComponent,
    QuickLinksComponent,
    UserTypeChartComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    NgxSpinnerModule,
    CustomMaterialModule,
    NgChartsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeModule {}
