import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { contentType, generic } from 'src/app/core/constants';
import {
  ArticleResponse,
  Content,
  EditContentRequest,
  ExternalReferenceResponse,
  UpdateArticleRequest
} from 'src/app/core/models/helpfulInfo';
import { HelpfulInfoService } from '../helpful-info.service';
import { SectionContentService } from './section-content.service';

@Component({
  selector: 'app-section-content',
  templateUrl: './section-content.component.html',
  styleUrls: ['./section-content.component.scss']
})
export class SectionContentComponent implements OnInit {
  @Input() subSections!: any;
  @Input() communityId!: string | null;
  @Output() onEditSubSection = new EventEmitter();

  bucketType = '^(HWTopic|HWBTNVideoList)$';
  articleModal = false;
  externalLinkModal = false;
  articleData!: ArticleResponse;
  selectedSectionId = '';
  showCommunityPanel = false;
  selectedCommunitySections!: any;
  externalRefernceData!: ExternalReferenceResponse | null;

  constructor(
    private _helpfulInfo: HelpfulInfoService,
    private _section: SectionContentService,
    private _toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    this.selectedSectionId =
      changes?.subSections?.currentValue?.en?.sectionId ?? '';
    if (this.subSections?.en?.isGridView) {
      // If grid View - Data for Meredith and Other Article need to be collected
      const referenceContentIndex = this.subSections.en.content.findIndex(
        (c: any) => c?.link.includes('referenceContent')
      );
      if (referenceContentIndex >= 0) {
        const subSectionId =
          this.subSections.en.content[referenceContentIndex].helpfulInfoId;
        this.getSubSection(subSectionId);
      }
      this._section.selectedSubSectionIndex = -1;
    }
  }

  addArticleToSection() {
    const newContent = new Content();
    this.articleData = {
      id: '',
      en: newContent,
      es: newContent
    };
    this.articleModal = true;
  }

  onCloseModal() {
    this.articleModal = false;
    this.externalLinkModal = false;
    this._section.selectedExternalLink = {
      sectionId: '',
      helpfulInfoId: '',
      contentIndex: -1
    };
  }

  getSubSection(id: string, callbackFn?: () => void) {
    this._helpfulInfo.getLibraryById(id).subscribe(
      (result: any) => {
        if (result.data.isSuccess) {
          const bucketValue = result.data.value;
          if (
            bucketValue.en.sections.length == 1 &&
            bucketValue.en.sections[0]?.type == 'List'
          ) {
            this._section.enBucket = bucketValue.en;
            this._section.esBucket = bucketValue.es;
          }

          if (callbackFn) {
            callbackFn();
          }
        }
      },
      () => {
        this._toastr.error(generic.somethingWentWrong);
      }
    );
  }

  editSubSection(data: any) {
    this.onEditSubSection.emit(data);
  }

  manageArticle(article: ArticleResponse) {
    if (article?.isEdit) {
      this.updateArticle(article);
    } else {
      this.createArticle(article);
    }
    this.onCloseModal();
  }

  createArticle(article: ArticleResponse) {
    if (this._section.selectedSubSectionIndex > -1) {
      const articleIndex = this._section.getArticleIndex(
        this._section.enBucket.sections[0].content,
        article.en
      );
      if (articleIndex >= 0) {
        this.articleExistMessage();
      } else {
        this._section.enBucket.sections[0].content.push(article.en);
        this._section.esBucket.sections[0].content.push(article.es);
        if (this.subSections?.en?.communitiesList) {
          //If Cancer Article
          this._section.enBucket.isModified = true;
        } else {
          this.subSections.en.content[
            this._section.selectedSubSectionIndex
          ].isModified = true;
        }
      }
    } else {
      //If Grid View
      const articleIndex = this._section.getArticleIndex(
        this.subSections.en.content,
        article.en
      );
      if (articleIndex >= 0) {
        this.articleExistMessage();
      } else {
        this.subSections.en.content.push(article.en);
        this.subSections.es.content.push(article.es);
        this.subSections.en.isModified = true;
      }
    }
  }

  updateArticle(article: ArticleResponse) {
    let data: UpdateArticleRequest = {
      helpfulInfoId: '',
      sectionId: '',
      content: {
        en: {...article.en},
        es: {...article.es}
      }
    };
    let referenceData!: UpdateArticleRequest;

    if (this._section.selectedSubSectionIndex > -1) {
      //Sub Section Data
      data.helpfulInfoId = this._section.enBucket.helpfulInfoId;
      data.sectionId = this._section.enBucket.sections[0].sectionId;
    } else {
      //Section Data
      data.helpfulInfoId = this._helpfulInfo.communityHelpfulInfoId;
      data.sectionId = this.subSections.en.sectionId;
    }

    if(this._helpfulInfo.isReferenceArticle(article.en.link)) {
      referenceData = {
        helpfulInfoId: '',
        sectionId: '',
        content: {
          en: {...article.en},
          es: {...article.es}
        }
      };
      referenceData.helpfulInfoId = this._section.enBucket.helpfulInfoId;
      referenceData.sectionId = this._section.enBucket.sections[0].sectionId;
      data.content.en.description = data.content.es.description = '';
    }
    
    this._helpfulInfo.editArticle(data).subscribe(
      (result: any) => {
        if (result.data.isSuccess) {
          if(referenceData) {
            this._toastr.info(generic.processing);
            this._helpfulInfo.editArticle(referenceData).subscribe(
              (response: any) => {
                this._toastr.success(generic.updateSuccess);
              },
              () => {
                this._toastr.error(generic.somethingWentWrong);
              }
            );
          }
          else {
            this._toastr.success(generic.updateSuccess);
          }
        }
      },
      () => {
        this._toastr.error(generic.somethingWentWrong);
      }
    );
  }

  articleExistMessage() {
    this._toastr.error('Article already exists!');
  }

  onEditArticle(data: ArticleResponse) {
    const params = data.en.link.split('?');
    if (params[0].includes('referenceContent')) {
      const path = params[0].split('/');
      const libraryId = path[path.length - 2];
      this._helpfulInfo.getLibraryById(libraryId).subscribe((result: any) => {
        const library = result.data.value;
        const contentIndex = this._section.getMeredithArticleIndex(
          library.en.sections[0].content,
          data.en
        );

        data.en.description =
          library.en.sections[0].content[contentIndex].description;
        data.es.description =
          library.es.sections[0].content[contentIndex].description;
        data.en.copyright =
          library.en.sections[0].content[contentIndex]?.copyright ?? '';
        data.es.copyright =
          library.es.sections[0].content[contentIndex]?.copyright ?? '';

        this.showArticleModal(data);
      });
    } else {
      this.showArticleModal(data);
    }
  }

  showArticleModal(data: ArticleResponse) {
    this.articleData = data;
    this.articleModal = true;
  }

  isVideoLibrary() {
    const index = this.subSections.en.content.findIndex(
      (c: any) => c?.type === contentType.videoLibrary
    );
    return index >= 0;
  }

  createExternalReference(data: ExternalReferenceResponse) {
    if (data?.isEdit) {
      //Handle edit section
      const editData: EditContentRequest = {
        content: {
          en: data.en,
          es: data.es
        },
        sectionId: this._section.selectedExternalLink.sectionId,
        helpfulInfoId: this._section.selectedExternalLink.helpfulInfoId
      };
      const selectedIndex = this._section.selectedExternalLink.contentIndex;
      this._helpfulInfo
        .editExternalLink(editData, selectedIndex)
        .subscribe((result: any) => {
          this._toastr.success(generic.updateSuccess);
          if (this._section.selectedSubSectionIndex > -1) {
            this._section.enBucket.sections[0].content[selectedIndex] = data.en;
            this._section.esBucket.sections[0].content[selectedIndex] = data.es;
          } else {
            this.subSections.en.content[selectedIndex] = data.en;
            this.subSections.es.content[selectedIndex] = data.es;
          }
        });
    } else {
      if (this._section.selectedSubSectionIndex > -1) {
        this._section.enBucket.sections[0].content.push(data.en);
        this._section.esBucket.sections[0].content.push(data.es);
        if (this.subSections?.en?.communitiesList) {
          //If Cancer Article
          this._section.enBucket.isModified = true;
        } else {
          this.subSections.en.content[
            this._section.selectedSubSectionIndex
          ].isModified = true;
        }
      } else {
        //If Grid View
        this.subSections.en.content.push(data.en);
        this.subSections.es.content.push(data.es);
        this.subSections.en.isModified = true;
      }
    }
    this.onCloseModal();
  }

  showExternalLinkModal(data: ExternalReferenceResponse | null) {
    if (data) {
      //Create Edit Section content
      this.externalRefernceData = data;
    } else {
      this.externalRefernceData = null;
    }
    this.externalLinkModal = true;
  }
}
