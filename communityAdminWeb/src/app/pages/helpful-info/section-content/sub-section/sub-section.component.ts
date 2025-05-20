import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { contentType, generic, helpfulInfo } from 'src/app/core/constants';
import {
  Content,
  ContentData,
  ExternalReferenceResponse,
  LibrarySectionRequest,
  NewLibrary,
  SectionContentArray,
  SectionDetails,
  UpdateSectionRequest
} from 'src/app/core/models/helpfulInfo';
import { PartnerSection, Partners } from 'src/app/core/models/partners';
import { generateHexId } from 'src/app/core/utils';
import { SectionService } from 'src/app/pages/add-section/section.service';
import { PartnersService } from 'src/app/pages/partners/partners.service';
import { HelpfulInfoService } from '../../helpful-info.service';
import { SectionContentService } from '../section-content.service';

@Component({
  selector: 'app-sub-section',
  templateUrl: './sub-section.component.html',
  styleUrls: ['./sub-section.component.scss']
})
export class SubSectionComponent implements OnInit {
  @Input() subSections!: any;
  @Output() onEditSubSection = new EventEmitter();
  @Output() onAddArticle = new EventEmitter();
  @Output() onEditArticle = new EventEmitter();
  @Output() manageLink = new EventEmitter<null | ExternalReferenceResponse>();
  bucketType = '^(HWTopic|HWBTNVideoList|HWPartner)$';
  articleData!: any;
  sectionOrderChanged = false;
  partners!: Partners[];

  //Sub Section option
  subSectionModal = false;
  subSectionData!: SectionDetails;

  //partner
  partnerModal = false;

  constructor(
    private _helpfulInfo: HelpfulInfoService,
    private _section: SectionContentService,
    private _addSection: SectionService,
    private _partnerService: PartnersService,
    private _toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this._partnerService.getAllPartners(false).subscribe((result: any) => {
      this.partners = result.data.value;
    });
    this.subSectionData = this._addSection.initSectionDetails();
  }

  ngOnChanges(): void {
    this._section.selectedSubSectionIndex = -1;
    this.sectionOrderChanged = false;
  }

  fetchSubContent(link: string, index: number) {
    this._section.selectedSubSectionIndex = index;
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
      this.subSections.en.content[
        this._section.selectedSubSectionIndex
      ].isModified = true;
    } else {
      this.subSections.en.content = this._section.deleteArticle(
        this.subSections.en.content,
        data.article
      );
      this.subSections.es.content = this._section.deleteArticle(
        this.subSections.es.content,
        data.article
      );
      this.subSections.en.isModified = true;
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
    const data: UpdateSectionRequest = {
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

  addExternalLinkToSection() {
    this.manageLink.emit();
  }

  getBucketContent() {
    return this._section?.enBucket?.sections[0]?.content;
  }

  editBucketArticle(data: Content) {
    const index = this._section.getArticleIndex(
      this._section.enBucket.sections[0].content,
      data
    );

    if (data.type === contentType.externalLink) {
      this._section.selectedExternalLink = {
        helpfulInfoId: this._section.enBucket.helpfulInfoId,
        sectionId: this._section.enBucket.sections[0].sectionId,
        contentIndex: index
      };

      this.manageLink.emit({
        en: this._section.enBucket.sections[0].content[index],
        es: this._section.esBucket.sections[0].content[index],
        isEdit: true
      });
    } else {
      this.onEditArticle.emit({
        en: this._section.enBucket.sections[0].content[index],
        es: this._section.esBucket.sections[0].content[index],
        isEdit: true,
        id: this._section.getContentId(data)
      });
    }
  }

  editSectionArticle(data: Content) {
    const index = this._section.getArticleIndex(
      this.subSections.en.content,
      data
    );

    if (data.type === contentType.externalLink) {
      this._section.selectedExternalLink = {
        helpfulInfoId: this._helpfulInfo.communityHelpfulInfoId,
        sectionId: this.subSections.en.sectionId,
        contentIndex: index
      };

      this.manageLink.emit({
        en: this.subSections.en.content[index],
        es: this.subSections.es.content[index],
        isEdit: true
      });
    } else {
      this.onEditArticle.emit({
        en: this._section.enBucket.sections[0].content[index],
        es: this._section.esBucket.sections[0].content[index],
        isEdit: true,
        id: this._section.getContentId(data)
      });
    }
  }

  isCommonSectionPresent() {
    const commonSection = this.subSections?.en?.content?.filter(
      (c: any) => c?.commonSection
    );
    return commonSection && commonSection.length > 0;
  }

  addExternalLink() {
    this.manageLink.emit();
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

  publishSectionChanges() {
    delete this.subSections.en.isModified;
    const data = {
      en: this.subSections.en,
      es: this.subSections.es,
      sectionId: this.subSections?.en?.sectionId,
      communityId: this._helpfulInfo.communityId
    };

    this._helpfulInfo.updateCommunitySection(data).subscribe((result: any) => {
      this._toastr.success(generic.updateSuccess);
    });
  }

  getLogoImage(partnerLink: string) {
    if (this.partners?.length > 0) {
      const partnerId = this._addSection.getPartnerId(partnerLink);
      const partner = this.partners.filter((p) => p.id === partnerId);
      return partner.length > 0
        ? partner[0].logoImage
        : 'assets/img/no-img.png';
    }
    return 'assets/img/no-img.png';
  }

  deleteSection(index: number) {
    if (!confirm(helpfulInfo.messages.confirmDelete)) return;
    this.subSections.en.content.splice(index, 1);
    this.subSections.es.content.splice(index, 1);
    this.publishSectionChanges();
  }

  /**
   * Creates a new library and adds its refernce content to community library
   * @param library New Library Content to be created
   * @param sectionContent Section to be added to main content
   */
  addSubSection(library: NewLibrary, sectionContent: ContentData) {
    this._helpfulInfo.createLibrary(library.data).subscribe(
      (result: any) => {
        if (result.data?.isSuccess) {
          this._helpfulInfo
            .updateCommunitySection({
              en: this.subSections.en,
              es: this.subSections.es,
              sectionId: this.subSections.en.sectionId,
              communityId: this._helpfulInfo.communityId
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
    this.subSections.en.content.push({
      ...sectionContent.en,
      helpfulInfoId: library.helpfulInfoId
    });
    this.subSections.es.content.push({
      ...sectionContent.es,
      helpfulInfoId: library.helpfulInfoId
    });
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

  /**
   * Creates a library for new partner and adds refernce to community section
   * @param partner Partner details
   */
  handleAddPartner(partner: PartnerSection) {
    const sectionDetails: SectionDetails = {
      en: {
        title: partner.title,
        description: partner.description.en
      },
      es: {
        title: partner.title,
        description: partner.description.es
      }
    };
    const imagePath = `${helpfulInfo.partnerPath}/${partner.id}${helpfulInfo.logo}`;
    const newLibrary = this._addSection.initPartnerLibrary(
      sectionDetails,
      imagePath
    );
    const sectionContent = this._addSection.getTopicContent(
      sectionDetails,
      contentType.bucket,
      newLibrary.helpfulInfoId
    );
    sectionContent.en = {
      ...sectionContent.en,
      brandLogo: imagePath,
      type: contentType.partner
    };
    sectionContent.es = {
      ...sectionContent.es,
      brandLogo: imagePath,
      type: contentType.partner
    };
    this.addSubSection(newLibrary, sectionContent);
    this.onCloseModal();
  }

  /**
   *
   * @returns if the subsection contains a partner subsection
   */
  isPartnerContentPresent() {
    const partnerSection = this.subSections.en.content.filter(
      (c: Content) => c.type === contentType.partner
    );
    return partnerSection.length > 0;
  }

  showSubSection() {
    this.subSectionModal = true;
  }

  showPartnerModal() {
    this.partnerModal = true;
  }

  onCloseModal() {
    this.subSectionModal = false;
    this.partnerModal = false;
  }
}
