import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import {
  contentType,
  generic,
  helpfulInfo,
  libraryType
} from 'src/app/core/constants';
import {
  Content,
  ContentData,
  LibrarySectionRequest,
  LoadSectionData,
  NewLibrary,
  Section,
  SectionContentArray,
  SectionDetails,
  UpdateSectionRequest
} from 'src/app/core/models/helpfulInfo';
import { generateHexId } from 'src/app/core/utils';
import { SectionService } from 'src/app/pages/add-section/section.service';
import { HelpfulInfoService } from '../../helpful-info.service';
import { SectionContentService } from '../section-content.service';

@Component({
  selector: 'app-community-section',
  templateUrl: './community-section.component.html',
  styleUrls: ['./community-section.component.scss']
})
export class CommunitySectionComponent implements OnInit {
  @Input() subSections!: any;
  @Output() onAddArticle = new EventEmitter();
  @Output() onEditArticle = new EventEmitter();
  showCommunityPanel: boolean = false;
  selectedCommunitySections!: { en: any; es: any };
  sectionMode = '';
  sectionEditData!: LoadSectionData;
  sectionOrderChanged = false;

  //Modal Controls
  sectionModalDisplay = false;
  subSectionModal = false;

  //Cancer type Form
  titleError = false;
  showCancerTypeForm = false;

  constructor(
    private _helpfulInfo: HelpfulInfoService,
    private _section: SectionContentService,
    private _toastr: ToastrService,
    private _addSection: SectionService
  ) {}

  ngOnInit(): void {
    console.log(this.subSections);
  }

  ngOnChanges(): void {
    this.showCommunityPanel = false;
    this._section.selectedSubSectionIndex = -1;
  }

  onCommunitySelect(selectedData: MatSelectChange) {
    if (selectedData?.value) {
      this.showCommunityPanel = true;
      const pathParts = selectedData.value.split('/');
      this._helpfulInfo
        .getLibraryById(pathParts[pathParts.length - 1])
        .subscribe(
          (result: any) => {
            if (result.data.isSuccess) {
              this.selectedCommunitySections = {
                en: result.data.value.en,
                es: result.data.value.es
              };
            }
          },
          () => {
            this._toastr.error(generic.somethingWentWrong);
          }
        );
    } else {
      this.showCommunityPanel = false;
    }
  }

  fetchSubContent(link: string, index: number) {
    this._section.selectedSubSectionIndex = index;
    const params = link.split('/');
    this.getSubSection(params[params.length - 1], () => {
      this._section.enBucket.isModified = false;
      delete this.selectedCommunitySections.en.sections[0].content[
        this._section.selectedSubSectionIndex
      ]?.isOrderChanged;
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

  editCancerTopics(index: number) {
    this.sectionModalDisplay = true;
    const enSectionData: Section = {
      title:
        this.selectedCommunitySections?.en?.sections[0].content[index].title,
      description:
        this.selectedCommunitySections?.en?.sections[0].content[index]
          .description,
      content: []
    };
    const esSectionData = {
      title:
        this.selectedCommunitySections?.es?.sections[0].content[index].title,
      description:
        this.selectedCommunitySections?.en?.sections[0].content[index]
          .description,
      content: []
    };
    this.sectionMode = libraryType.subSection;
    this.sectionEditData = {
      sectionIndex: index,
      communityId: '',
      en: enSectionData,
      es: esSectionData
    };
  }

  addArticleToSection() {
    this.onAddArticle.emit();
  }

  deleteArticle(data: any) {
    if (data.id) {
      this._section.enBucket.sections[0].content = this._section.deleteArticle(
        this._section.enBucket.sections[0].content,
        data.article
      );
      this._section.esBucket.sections[0].content = this._section.deleteArticle(
        this._section.esBucket.sections[0].content,
        data.article
      );
      this._section.enBucket.isModified = true;
    }
  }

  getBucketContent() {
    return this._section?.enBucket?.sections[0]?.content;
  }

  isModified() {
    return this._section?.enBucket?.isModified;
  }

  updateSectionData(data: any) {
    this.selectedCommunitySections.en.sections[0].content[
      data.sectionIndex
    ].title = data.en.title;
    this.selectedCommunitySections.en.sections[0].content[
      data.sectionIndex
    ].description = data.en.description;
    this.selectedCommunitySections.es.sections[0].content[
      data.sectionIndex
    ].title = data.es.title;
    this.selectedCommunitySections.es.sections[0].content[
      data.sectionIndex
    ].description = data.es.description;

    this._helpfulInfo
      .updateSectionContent({
        helpfulInfoId: this.selectedCommunitySections.en.helpfulInfoId,
        en: this.selectedCommunitySections.en.sections,
        es: this.selectedCommunitySections.es.sections
      })
      .subscribe((result: any) => {
        this._helpfulInfo
          .updateSectionDetails({
            helpfulInfoId: this._section.enBucket.helpfulInfoId,
            en: {
              title: data.en.title,
              description: data.en.description
            },
            es: {
              title: data.es.title,
              description: data.es.description
            }
          })
          .subscribe((response: any) => {
            this._toastr.success(generic.updateSuccess);
            this.sectionModalDisplay = false;
          });
      });
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

            const newArticleData: UpdateSectionRequest = {
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
    const data: UpdateSectionRequest = {
      helpfulInfoId: this._section.enBucket.helpfulInfoId,
      en: this._section.enBucket.sections,
      es: this._section.esBucket.sections
    };
    this._helpfulInfo.updateSectionContent(data).subscribe((result: any) => {
      this._toastr.success(generic.updateSuccess);
      this._section.enBucket.isModified = false;
    });
  }

  onCloseModal() {
    this.sectionModalDisplay = false;
    this.subSectionModal = false;
  }

  editSectionArticle(data: any) {
    const index = this._section.getArticleIndex(
      this._section.enBucket.sections[0].content,
      data
    );

    this.onEditArticle.emit({
      en: this._section.enBucket.sections[0].content[index],
      es: this._section.esBucket.sections[0].content[index],
      isEdit: true,
      id: this._section.getContentId(data)
    });
  }

  reorderArticle(data: CdkDragDrop<any[]>, selectedIndex: number) {
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
      this.selectedCommunitySections.en.sections[0].content[
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
        delete this.selectedCommunitySections.en.sections[0].content[
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
        this.selectedCommunitySections.en.sections[0].content,
        data.previousIndex,
        data.currentIndex
      );
      moveItemInArray(
        this.selectedCommunitySections.es.sections[0].content,
        data.previousIndex,
        data.currentIndex
      );
      this.sectionOrderChanged = true;
    }
  }

  publishSectionOrderChange() {
    const data: UpdateSectionRequest = {
      helpfulInfoId: this.selectedCommunitySections.en.helpfulInfoId,
      en: this.selectedCommunitySections.en.sections,
      es: this.selectedCommunitySections.es.sections
    };

    this._helpfulInfo.updateSectionContent(data).subscribe((result: any) => {
      this.sectionOrderChanged = false;
      this._toastr.success(generic.updateSuccess);
    });
  }

  showAddSubSection() {
    console.log('Sub section to be added');
    this.subSectionModal = true;
  }

  /**
   * Creates a new library and adds its refernce content to community library
   * @param library New Library Content to be created
   * @param sectionContent Section to be added to main content
   */
  addSubSection(library: NewLibrary, sectionContent: ContentData) {
    this.selectedCommunitySections.en.sections[0].content.push({
      ...sectionContent.en,
      helpfulInfoId: library.helpfulInfoId
    });
    this.selectedCommunitySections.es.sections[0].content.push({
      ...sectionContent.es,
      helpfulInfoId: library.helpfulInfoId
    });

    this._helpfulInfo.createLibrary(library.data).subscribe(
      (result: any) => {
        if (result.data?.isSuccess) {
          this._helpfulInfo
            .updateSectionContent({
              en: this.selectedCommunitySections.en.sections,
              es: this.selectedCommunitySections.es.sections,
              helpfulInfoId: this.selectedCommunitySections.en.helpfulInfoId
            })
            .subscribe(() => {
              this._toastr.success('Sub Section created successfully');
            });
          this._toastr.info('Processing! please wait!');
        } else {
          this._toastr.error(generic.somethingWentWrong);
        }
      },
      () => {
        this._toastr.error(generic.somethingWentWrong);
      }
    );
  }

  /**
   * Creates a library for new section and adds refernce to community section
   * @param data Section details like title and description in en and es
   */
  handleAddSubSection(data: SectionDetails) {
    const newLibrary = this._addSection.initOtherLibrary(data);
    const sectionContent = this._addSection.getTopicContent(
      data,
      contentType.bucket,
      newLibrary.helpfulInfoId
    );

    this.addSubSection(newLibrary, sectionContent);

    this.onCloseModal();
  }

  addSubCommunity(enTitle: HTMLInputElement, esTitle: HTMLInputElement) {
    if (enTitle.value.trim() === '' || esTitle.value.trim() === '') {
      this.titleError = true;
      return;
    }

    this.titleError = false;
    const newLibrary = this._addSection.initOtherLibrary({
      en: {
        title: 'Library',
        description: ''
      },
      es: {
        title: 'Biblioteca',
        description: ''
      }
    });
    this.subSections.en.content.push({
      title: enTitle.value,
      types: [
        {
          title: enTitle.value,
          alias: 'General',
          helpfulInfoId: newLibrary.helpfulInfoId,
          link: `${helpfulInfo.topicPath}${newLibrary.helpfulInfoId}`
        }
      ]
    });
    this.subSections.en.content = this.subSections.en.content.sort(
      (firstItem: Content, secondItem: Content) => {
        const titleA = firstItem.title.toUpperCase();
        const titleB = secondItem.title.toUpperCase();
        if (titleA < titleB) {
          return -1;
        }
        if (titleA > titleB) {
          return 1;
        }
        return 0;
      }
    );
    const newIndex = this.subSections.en.content.findIndex(
      (c: Content) => c.title === enTitle.value
    );
    this.subSections.es.content.splice(newIndex, 0, {
      title: esTitle.value,
      types: [
        {
          title: esTitle.value,
          alias: 'General',
          helpfulInfoId: newLibrary.helpfulInfoId,
          link: `${helpfulInfo.topicPath}${newLibrary.helpfulInfoId}`
        }
      ]
    });

    this._helpfulInfo.createLibrary(newLibrary.data).subscribe(
      (result: any) => {
        if (result.data?.isSuccess) {
          this._toastr.success('New Community created');
          const input: LibrarySectionRequest = {
            en: this.subSections.en,
            es: this.subSections.es,
            sectionId: this.subSections.en.sectionId,
            communityId: this._helpfulInfo.communityId
          };
          this._helpfulInfo
            .updateCommunitySection(input)
            .subscribe((result: any) => {
              if (result.data.isSuccess) {
                this._toastr.success('Select Cancer Type to add Sub sections');
                this.showCancerTypeForm = false;
                enTitle.value = esTitle.value = '';
              } else {
                this._toastr.error(generic.somethingWentWrong);
              }
            });
        }
      },
      () => {
        this._toastr.error(generic.somethingWentWrong);
      }
    );
  }
}
