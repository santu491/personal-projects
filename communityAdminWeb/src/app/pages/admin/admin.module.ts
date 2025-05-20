import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ImagePreviewComponent } from 'src/app/components/imagePreview/image-preview.component';
import { MultilevelMenuModule } from 'src/app/components/multilevel-menu/multilevel-menu.module';
import { SidenavModule } from 'src/app/components/sidenav/sidenav.module';
import { CustomMaterialModule } from 'src/app/custom-material.module';
import { ImagePickerComponent } from '../../components/image-picker/image-picker.component';
import { SimpleImagePreviewComponent } from '../../components/simple-image-preview/simple-image-preview.component';
import { AddArticleComponent } from '../add-article/add-article.component';
import { CustomArticleComponent } from '../add-article/custom-article/custom-article.component';
import { HealthwiseArticleComponent } from '../add-article/healthwise-article/healthwise-article.component';
import { MeredithArticleComponent } from '../add-article/meredith-article/meredith-article.component';
import { AddCommunityComponent } from '../add-community/add-community.component';
import { AddPartnerSectionComponent } from '../add-section/add-partner-section/add-partner-section.component';
import { AddSectionComponent } from '../add-section/add-section.component';
import { CommonLibViewComponent } from '../add-section/common-lib-view/common-lib-view.component';
import { SectionArticleComponent } from '../add-section/section-article/section-article.component';
import { SectionDetailsComponent } from '../add-section/section-details/section-details.component';
import { CommunityComponent } from '../community/community.component';
import { ArticleViewComponent } from '../helpful-info/article-view/article-view.component';
import { ExternalReferenceViewComponent } from '../helpful-info/external-reference-view/external-reference-view.component';
import { HelpfulInfoComponent } from '../helpful-info/helpful-info.component';
import { LibSectionDetailComponent } from '../helpful-info/lib-section-detail/lib-section-detail.component';
import { CommunitySectionComponent } from '../helpful-info/section-content/community-section/community-section.component';
import { GridSectionComponent } from '../helpful-info/section-content/grid-section/grid-section.component';
import { SectionContentComponent } from '../helpful-info/section-content/section-content.component';
import { SubSectionComponent } from '../helpful-info/section-content/sub-section/sub-section.component';
import { VideoLibraryComponent } from '../helpful-info/section-content/video-library/video-library.component';
import { SectionModalComponent } from '../helpful-info/section-modal/section-modal.component';
import { NotificationComponent } from '../notificationTemplate/notification.component';
import { TemplateFormComponent } from '../notificationTemplate/template-form/template-form.component';
import { AddPartnerModalComponent } from '../partners/add-partner-modal/add-partner-modal.component';
import { PartnersComponent } from '../partners/partners.component';
import { PlanExpiredUsersComponent } from '../plan-expired-users/plan-expired-users.component';
import { PromptFormComponent } from '../prompts/prompt-form/prompt-form.component';
import { PromptsComponent } from '../prompts/prompts.component';
import { SearchUserComponent } from '../search-user/search-user.component';
import { TouAndPrivacyPolicyComponent } from '../tou-and-privacy-policy/tou-and-privacy-policy.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';

@NgModule({
  declarations: [
    AdminComponent,
    SearchUserComponent,
    AddCommunityComponent,
    CommunityComponent,
    PromptsComponent,
    PromptFormComponent,
    HelpfulInfoComponent,
    SectionContentComponent,
    AddSectionComponent,
    AddArticleComponent,
    ImagePreviewComponent,
    LibSectionDetailComponent,
    ArticleViewComponent,
    ExternalReferenceViewComponent,
    CommunitySectionComponent,
    GridSectionComponent,
    SubSectionComponent,
    SectionModalComponent,
    HealthwiseArticleComponent,
    MeredithArticleComponent,
    CustomArticleComponent,
    SectionDetailsComponent,
    VideoLibraryComponent,
    SectionArticleComponent,
    CommonLibViewComponent,
    PartnersComponent,
    AddPartnerModalComponent,
    AddPartnerSectionComponent,
    SimpleImagePreviewComponent,
    ImagePickerComponent,
    NotificationComponent,
    TemplateFormComponent,
    TouAndPrivacyPolicyComponent,
    PlanExpiredUsersComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    CustomMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SidenavModule,
    ImageCropperModule,
    AngularEditorModule,
    DragDropModule,
    MultilevelMenuModule
  ]
})
export class AdminModule {}
