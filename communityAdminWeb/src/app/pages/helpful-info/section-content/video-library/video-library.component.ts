import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { generic, helpfulInfo } from 'src/app/core/constants';
import {
  Content,
  LibrarySectionRequest,
  SectionContentArray,
  UpdateSectionRequest
} from 'src/app/core/models/helpfulInfo';
import { generateHexId } from 'src/app/core/utils';
import { HelpfulInfoService } from '../../helpful-info.service';
import { SectionContentService } from '../section-content.service';

@Component({
  selector: 'app-video-library',
  templateUrl: './video-library.component.html',
  styleUrls: ['./video-library.component.scss']
})
export class VideoLibraryComponent implements OnInit {
  @Input() subSections!: any;
  @Output() onEditSubSection = new EventEmitter();
  @Output() onAddArticle = new EventEmitter();
  @Output() onEditArticle = new EventEmitter();
  @Output() onAddSubSectionArticle = new EventEmitter();
  @Output() onEditSubSectionArticle = new EventEmitter();

  videoBucketType = '^(HWBTNVideoList)$';
  videoType = '^(HWVideo|HWVideoReference)$';
  selectedSubSectionIndex!: number; //Local Copy
  isArticleDeleted = false;
  sectionOrderChanged = false;

  constructor(
    private _section: SectionContentService,
    private _helpfulInfo: HelpfulInfoService,
    private _toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  fetchSubContent(link: string, index: number) {
    this._section.selectedSubSectionIndex = index;
    this.selectedSubSectionIndex = index;
    const params = link.split('/');
    this.getSubSection(params[params.length - 1], () => {
      if (index === -1) {
        this._section.enBucket.isModified = false;
      } else {
        this.subSections.en.content[
          this._section.selectedSubSectionIndex
        ].isModified = false;
        delete this.subSections.en.content[
          this._section.selectedSubSectionIndex
        ]?.isOrderChanged;
      }
    });
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

  deleteSectionArticle(data: any, isBucket?: boolean) {
    if (data.id) {
      this._section.enBucket.sections[0].content = this._section.deleteArticle(
        this._section.enBucket.sections[0].content,
        data.article
      );
      this._section.esBucket.sections[0].content = this._section.deleteArticle(
        this._section.esBucket.sections[0].content,
        data.article
      );
      if (isBucket) {
        this._section.enBucket.isModified = true;
      } else {
        this.subSections.en.content[
          this._section.selectedSubSectionIndex
        ].isModified = true;
      }
    }
  }

  publishChanges() {
    const indexes = this._section.getOtherIndexes(
      this._section.enBucket.sections[0].content
    );
    if (indexes.length > 0) {
      const referenceContentIndex =
        this._section.enBucket.sections[0].content.findIndex((c: any) =>
          c?.link?.includes('referenceContent')
        );
      const contentData: SectionContentArray = {
        en: [],
        es: []
      };
      if (referenceContentIndex < 0) {
        const newLibraryId = generateHexId();

        this._section.setBucketContentReferencePath(
          indexes,
          contentData,
          newLibraryId
        );
        //Create a new Library with article data
        this._helpfulInfo
          .createLibrary(
            this._section.getReferenceLibrary(newLibraryId, contentData)
          )
          .subscribe(
            (result: any) => {
              this._toastr.success(generic.updateSuccess);
              this.callUpdateSection();
            },
            () => {
              this._toastr.error(generic.somethingWentWrong);
            }
          );
      } else {
        const linkPaths =
          this._section.enBucket.sections[0].content[
            referenceContentIndex
          ].link.split('/');
        const libraryId = linkPaths[linkPaths.length - 2];

        this._section.setBucketContentReferencePath(
          indexes,
          contentData,
          libraryId
        );
        // Edit Library content to Add new Article
        this._helpfulInfo.getLibraryById(libraryId).subscribe((result: any) => {
          if (result.data.isSuccess) {
            const enLibraryData = result.data.value.en;
            const esLibraryData = result.data.value.es;
            enLibraryData.sections[0].content.push(...contentData.en);
            esLibraryData.sections[0].content.push(...contentData.es);

            const newArticleData = {
              helpfulInfoId: libraryId,
              en: enLibraryData.sections,
              es: esLibraryData.sections
            };
            this._helpfulInfo
              .updateSectionContent(newArticleData)
              .subscribe((result: any) => {
                this._toastr.info('Processing! Please wait for some time.');
                this.callUpdateSection();
              });
          }
        });
      }
    } else {
      this.callUpdateSection();
    }
  }

  callUpdateSection() {
    this._section.enBucket.sections[0].content.forEach(
      this._section.formatRequestArticle
    );
    this._section.esBucket.sections[0].content.forEach(
      this._section.formatRequestArticle
    );
    delete this._section.enBucket.sections[0].isModified;
    delete this._section.esBucket.sections[0].isModified;
    const data = {
      helpfulInfoId:
        this.subSections.en.content[this._section.selectedSubSectionIndex]
          .helpfulInfoId,
      en: this._section.enBucket.sections,
      es: this._section.esBucket.sections
    };
    this._helpfulInfo.updateSectionContent(data).subscribe((result: any) => {
      this._toastr.success(generic.updateSuccess);
      this.subSections.en.content[
        this._section.selectedSubSectionIndex
      ].isModified = false;
    });
  }

  editSubSection(index: number) {
    this.onEditSubSection.emit({
      index: index,
      en: this.subSections.en.content[index],
      es: this.subSections.es.content[index]
    });
  }

  addArticleToSection() {
    this.onAddArticle.emit();
  }

  getBucketContent() {
    return this._section?.enBucket?.sections[0]?.content;
  }

  editSubSectionArticle(data: Content) {
    const index = this._section.getArticleIndex(
      this._section.enBucket.sections[0].content,
      data
    );

    this.onEditSubSectionArticle.emit({
      en: this._section.enBucket.sections[0].content[index],
      es: this._section.esBucket.sections[0].content[index],
      isEdit: true,
      id: this._section.getContentId(data)
    });
  }

  editArticle(data: Content) {
    this._section.selectedSubSectionIndex = -1;
    const index = this._section.getArticleIndex(
      this.subSections.en.content,
      data
    );

    this.onEditArticle.emit({
      en: this.subSections.en.content[index],
      es: this.subSections.es.content[index],
      isEdit: true,
      id: this._section.getContentId(data)
    });
  }

  deleteArticle(data: any) {
    this.subSections.en.content = this._section.deleteArticle(
      this.subSections.en.content,
      data.article
    );
    this.subSections.es.content = this._section.deleteArticle(
      this.subSections.es.content,
      data.article
    );
    this.isArticleDeleted = true;
  }

  onPublish() {
    const indexes: number[] = this._section.getOtherIndexes(
      this.subSections.en.content
    );

    //Identify articles that need to be added to new Section
    const subSectionData: SectionContentArray = {
      en: [],
      es: []
    };
    if (indexes.length > 0) {
      const referenceContentIndex = this.subSections.en.content.findIndex(
        (c: any) => c?.link.includes('referenceContent')
      );

      if (referenceContentIndex < 0) {
        const newLibraryId = generateHexId();

        this.setSectionReferencePath(indexes, subSectionData, newLibraryId);

        this._helpfulInfo
          .createLibrary(
            this._section.getReferenceLibrary(newLibraryId, subSectionData)
          )
          .subscribe(
            (result: any) => {
              this._toastr.info('Processing! Article added to Library');
              this.updateCommunitySection();
            },
            () => {
              this._toastr.error(generic.somethingWentWrong);
            }
          );
      } else {
        const subSectionId =
          this.subSections.en.content[referenceContentIndex].helpfulInfoId;
        //Change data under community section to references and add new content to sub content
        this.setSectionReferencePath(indexes, subSectionData, subSectionId);

        const newEnSections = this._section.enBucket.sections;
        newEnSections[0].content = [
          ...newEnSections[0].content,
          ...subSectionData.en
        ];
        const newEsSections = this._section.esBucket.sections;
        newEsSections[0].content = [
          ...newEsSections[0].content,
          ...subSectionData.es
        ];
        const updateSectionData = {
          helpfulInfoId: subSectionId,
          en: newEnSections,
          es: newEsSections
        };

        this._helpfulInfo.updateSectionContent(updateSectionData).subscribe(
          (result: any) => {
            this._toastr.info('Processing! Article added to Library');
            this.updateCommunitySection();
          },
          () => {
            this._toastr.error('Error creating a sub section');
            this._toastr.info(generic.pleaseTryAgain);
          }
        );
      }
    } else {
      this.updateCommunitySection();
    }
  }

  updateCommunitySection() {
    delete this.subSections.en.isModified;
    const data: LibrarySectionRequest = {
      en: this.subSections.en,
      es: this.subSections.es,
      sectionId: this.subSections?.en?.sectionId,
      communityId: this._helpfulInfo.communityId
    };

    this._helpfulInfo.updateCommunitySection(data).subscribe((result: any) => {
      this._toastr.success(generic.updateSuccess + ' Article added to Section');
      this.subSections.en.isModified = false;
    });
  }

  reorderArticle(data: CdkDragDrop<any[]>) {
    if (data.previousIndex !== data.currentIndex) {
      moveItemInArray(
        this._section?.enBucket?.sections[0].content,
        data.previousIndex,
        data.currentIndex
      );
      moveItemInArray(
        this._section?.esBucket?.sections[0].content,
        data.previousIndex,
        data.currentIndex
      );
      this.subSections.en.content[
        this._section.selectedSubSectionIndex
      ].isOrderChanged = true;
    }
  }

  publishArticleOrderChanges() {
    const updateSectionData: UpdateSectionRequest = {
      helpfulInfoId: this._section.enBucket.helpfulInfoId,
      en: this._section.enBucket.sections,
      es: this._section.esBucket.sections
    };

    this._helpfulInfo.updateSectionContent(updateSectionData).subscribe(
      (result: any) => {
        this._toastr.success(generic.updateSuccess);
        delete this.subSections.en.content[
          this._section.selectedSubSectionIndex
        ].isOrderChanged;
      },
      () => {
        this._toastr.error(helpfulInfo.messages.subSectionError);
        this._toastr.info(generic.pleaseTryAgain);
      }
    );
  }

  reorderBuckets(data: CdkDragDrop<any[]>) {
    if (data.previousIndex !== data.currentIndex) {
      moveItemInArray(
        this.subSections.en.content,
        data.previousIndex,
        data.currentIndex
      );
      moveItemInArray(
        this.subSections.es.content,
        data.previousIndex,
        data.currentIndex
      );
      this.sectionOrderChanged = true;
    }
  }

  publishSectionOrderChange() {
    const data: LibrarySectionRequest = {
      sectionId: this.subSections.en.sectionId,
      communityId: this._helpfulInfo.communityId,
      en: this.subSections.en,
      es: this.subSections.es
    };

    this._helpfulInfo.updateCommunitySection(data).subscribe((result: any) => {
      this.sectionOrderChanged = false;
      this._toastr.success(generic.updateSuccess);
    });
  }

  private setSectionReferencePath(
    indexes: number[],
    subSectionData: SectionContentArray,
    libraryId: string
  ) {
    indexes.forEach((i) => {
      subSectionData.en.push(this.subSections.en.content[i]);
      subSectionData.es.push(this.subSections.es.content[i]);

      this.subSections.en.content[i] = {
        ...this.subSections.en.content[i],
        link: `/v2/library/referenceContent/${libraryId}/${this.subSections.en.content[i].contentId}?htmlDescription=true`,
        description: '',
        copyright: '',
        isGridView: true
      };
      this.subSections.es.content[i] = {
        ...this.subSections.es.content[i],
        link: `/v2/library/referenceContent/${libraryId}/${this.subSections.es.content[i].contentId}?htmlDescription=true`,
        description: '',
        copyright: '',
        isGridView: true
      };
    });
  }
}
