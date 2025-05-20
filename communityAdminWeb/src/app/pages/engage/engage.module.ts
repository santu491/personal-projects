import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MultilevelMenuService } from 'ng-material-multilevel-menu';
import { CommunityFilterComponent } from 'src/app/components/community-filter/community-filter.component';
import { MultilevelMenuModule } from 'src/app/components/multilevel-menu/multilevel-menu.module';
import { PnTitleBodyComponent } from 'src/app/components/pn-title-body/pn-title-body.component';
import { ReactionContainerComponent } from 'src/app/components/reaction-container/reaction-container.component';
import { ReactionWithCountComponent } from 'src/app/components/reaction-with-count/reaction-with-count.component';
import { CustomMaterialModule } from 'src/app/custom-material.module';
import { CommentComponent } from '../../components/comment/comment.component';
import { LinkViewComponent } from '../../components/link-view/link-view.component';
import { SidenavModule } from '../../components/sidenav/sidenav.module';
import { CommentsComponent } from '../comments/comments.component';
import { DraftContentComponent } from '../draft-content/draft-content.component';
import { ExternalLinkComponent } from '../draft-content/external-link/external-link.component';
import { PostContentComponent } from '../draft-content/post-body/post-content.component';
import { PostPollComponent } from '../draft-content/post-poll/post-poll.component';
import { MetricsPnComponent } from '../metrics-pn/metrics-pn.component';
import { SchedulePnComponent } from '../schedule-pn/schedule-pn.component';
import { SearchComponent } from '../search/search.component';
import { ViewAllPostsComponent } from '../view-all-posts/view-all-posts.component';
import { ViewAllPushNotificationsComponent } from '../view-all-push-notifications/view-all-push-notifications.component';
import { ViewDraftsComponent } from '../view-drafts/view-drafts.component';
import { AdminActionListComponent } from '../view-stories/admin-action-list/admin-action-list.component';
import { StoryContentComponent } from '../view-stories/story-content/story-content.component';
import { ViewStoriesComponent } from '../view-stories/view-stories.component';
import { EngageRoutingModule } from './engage-routing.module';
import { EngageComponent } from './engage.component';
import { HelpComponent } from '../help/help.component';
import { CreateHelpSectionComponent } from '../help/create-help-section/create-help-section.component';
import { LinkSectionComponent } from '../help/link-section/link-section.component';
import { CreateCommentComponent } from 'src/app/components/create-comment/create-comment.component';

@NgModule({
  declarations: [
    EngageComponent,
    DraftContentComponent,
    ViewDraftsComponent,
    SearchComponent,
    SchedulePnComponent,
    ReactionContainerComponent,
    ReactionWithCountComponent,
    PnTitleBodyComponent,
    ViewStoriesComponent,
    ViewAllPushNotificationsComponent,
    ViewAllPostsComponent,
    StoryContentComponent,
    AdminActionListComponent,
    CommentsComponent,
    CommentComponent,
    MetricsPnComponent,
    CommunityFilterComponent,
    ExternalLinkComponent,
    LinkViewComponent,
    PostContentComponent,
    PostPollComponent,
    CreateHelpSectionComponent,
    HelpComponent,
    LinkSectionComponent,
    CreateCommentComponent
  ],
  imports: [
    AngularEditorModule,
    CommonModule,
    EngageRoutingModule,
    CustomMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SidenavModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule,
    PickerModule,
    MultilevelMenuModule
  ],
  providers: [MultilevelMenuService]
})
export class EngageModule {}
