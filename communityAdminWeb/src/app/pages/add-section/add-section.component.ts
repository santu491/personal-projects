import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ComponentCanDeactivate } from 'src/app/component-can-deactivate';
import {
  CharacterLimits,
  articleProviders,
  contentType,
  generic,
  helpfulInfo,
  messages
} from 'src/app/core/constants';
import {
  ArticleResponse,
  Content,
  ExternalReferenceResponse,
  SectionData,
  SectionDetails
} from 'src/app/core/models/helpfulInfo';
import { PartnerSection } from 'src/app/core/models/partners';
import { SectionService } from './section.service';

@Component({
  selector: 'app-add-section',
  templateUrl: './add-section.component.html',
  styleUrls: ['./add-section.component.scss']
})
export class AddSectionComponent implements OnInit, ComponentCanDeactivate {
  // Main Data
  sectionData!: SectionData;
  subSections: SectionData[] = [];
  limits = CharacterLimits;

  sectionBasicData!: SectionDetails;
  subSectionData!: SectionDetails;
  isVideoLibrary = false;
  bucketType = '^(HWBTNVideoList|HWTopic|HWPartner)$';
  articleType = '^(HWVideo|HWVideoReference|HWReference)$';
  videoType = '^(HWVideo|HWVideoReference)$';
  isVideoSubSection = false;

  //Article Modal
  articleModal = false;
  subSectionModal = false;
  displayCommonLibrary = false;
  commonSection: boolean = false;

  //Partner Modal
  partnerModal = false;
  selectedPartner!: PartnerSection;

  step = 0;
  selectedSubSection = '';
  selectedSubSectionIndex = -1;
  selectedArticleIndex = -1;

  showAddSubSection = false;
  showAddArticle = false;
  articleData!: ArticleResponse;
  sectionCreated = false;
  // URL Parameters
  communityId: string | null = null;
  title: string | null = null;
  commonContect: Content | undefined;

  // extrenal Rerference
  isExternalReferenceOpened = false;
  isEditSelected = false;
  externalRefernceData!: null | ExternalReferenceResponse;
  externalReferenceSectionIndex = -1;
  externalReferenceSubSectionIndex = -1;

  constructor(
    private _activeRoute: ActivatedRoute,
    private _router: Router,
    private _toastr: ToastrService,
    private _sectionSvc: SectionService
  ) {}

  toggleExternalLink() {
    this.isExternalReferenceOpened = !this.isExternalReferenceOpened;
  }

  canDeactivate(): boolean {
    if (this.communityId && this.communityId !== '') {
      if (
        this.sectionData.en.sections[0].content.length > 0 &&
        !this.sectionCreated
      ) {
        return confirm(messages.contentLossWarning);
      }
    }
    return true;
  }

  ngOnInit(): void {
    this.communityId = this._activeRoute.snapshot.paramMap.get('communityId');
    this.title = this._activeRoute.snapshot.paramMap.get('title');

    if (this.communityId === null || this.communityId === '') {
      this.backToCommunity(generic.selectCommunity);
    } else {
      this.title = this.title == null ? '' : this.title;
      this.sectionData = this._sectionSvc.initCommunityLibrary(
        this.communityId,
        this.title
      );
      this.subSectionData = this._sectionSvc.initSectionDetails();
    }
  }

  toStep1(data: SectionDetails) {
    this.sectionBasicData = data;
    this.sectionBasicData.isEdit = true;
    this.sectionData.en.sections[0].title = data.en.title;
    this.sectionData.en.sections[0].description = data.en.description;
    this.sectionData.es.sections[0].title = data.es.title;
    this.sectionData.es.sections[0].description = data.es.description;
    this.step = 1;
  }

  toStepZero() {
    this.step = 0;
  }

  /**
   *  Article Related Functions
   *
   */

  showAddArticleForm() {
    const newContent: Content = {
      communityId: '',
      type: '',
      contentId: '',
      title: '',
      description: '',
      link: '',
      video: '',
      thumbnail: '',
      copyright: '',
      imgUrl: '',
      brandLogo: '',
      brand: ''
    };
    this.articleData = {
      id: '',
      en: newContent,
      es: newContent,
      isGrid: this.selectedSubSection === ''
    };
    this.articleModal = true;
  }

  /**
   *  Section Related Functions
   *
   */
  showCommonArticles() {
    this.displayCommonLibrary = true;
  }

  addSelectedCommonArticles(data: any) {
    if (this.selectedSubSectionIndex > -1) {
      this.sectionData.en.sections[this.selectedSubSectionIndex].content.push(
        data.en
      );
      this.sectionData.es.sections[this.selectedSubSectionIndex].content.push(
        data.es
      );
    } else {
      this.sectionData.en.sections[0].content.push(data.en);
      this.sectionData.es.sections[0].content.push(data.es);
    }
    this.onCloseModal();
  }

  editArticleInSubSection(data: any, link: string, index: number) {
    this.selectedSubSection = this._sectionSvc.getLinkId(link);
    if (data.type === contentType.externalLink) {
      this.onPressEditExternalReferenceInSubSection(link, index);
    } else {
      const sectionIndex = this.findSubSectionIndex(this.selectedSubSection);
      this.selectedArticleIndex = index;
      this.articleData = {
        en: this.subSections[sectionIndex].en.sections[0].content[index],
        es: this.subSections[sectionIndex].es.sections[0].content[index],
        id: this.subSections[sectionIndex].es.sections[0].content[index]
          .contentId,
        isGrid: false
      };
      this.articleModal = true;
    }
  }

  editGridViewArticle(article: any, articleIndex: number) {
    if (article?.type === contentType.externalLink) {
      this.onPressEditExternalReferenceButton(articleIndex);
    } else {
      this.articleData = {
        en: this.sectionData.en.sections[0].content[articleIndex],
        es: this.sectionData.es.sections[0].content[articleIndex],
        id: article.contentId ?? '',
        isGrid: true
      };
      this.articleModal = true;
    }
  }

  deleteGridViewArticle(articleIndex: number) {
    this.sectionData.en.sections[0].content.splice(articleIndex, 1);
    this.sectionData.es.sections[0].content.splice(articleIndex, 1);

    if (this.sectionData.en.sections[0].content.length === 0) {
      this.sectionData.en.sections[0].isGridView = false;
      this.sectionData.es.sections[0].isGridView = false;
    }
  }

  deleteArticleInSubSection(link: string, articleIndex: number) {
    const subSectionId = this._sectionSvc.getLinkId(link);
    const index = this.findSubSectionIndex(subSectionId);
    if (index > -1) {
      this.subSections[index].en.sections[0].content.splice(articleIndex, 1);
      this.subSections[index].es.sections[0].content.splice(articleIndex, 1);
      this.selectedSubSectionIndex = -1;
    }
  }

  createArticle(article: ArticleResponse) {
    if (article?.isEdit) {
      if (this.sectionData.en.sections[0]?.isGridView) {
        const index = this.sectionData.en.sections[0].content.findIndex(
          (c) => c.contentId == article.en.contentId
        );
        this.sectionData.en.sections[0].content[index] = article.en;
        this.sectionData.es.sections[0].content[index] = article.es;
      } else {
        this.subSections[this.selectedSubSectionIndex].en.sections[0].content[
          this.selectedArticleIndex
        ] = article.en;
        this.subSections[this.selectedSubSectionIndex].es.sections[0].content[
          this.selectedArticleIndex
        ] = article.es;
      }
    } else {
      if (this.selectedSubSection != '') {
        const subIndex = this.findSubSectionIndex(this.selectedSubSection);

        this.subSections[subIndex].en.sections[0].content.push(article.en);
        this.subSections[subIndex].es.sections[0].content.push(article.es);
      } else {
        this.sectionData.en.sections[0].isGridView = true;
        this.sectionData.es.sections[0].isGridView = true;
        this.sectionData.en.sections[0].content.push(article.en);
        this.sectionData.es.sections[0].content.push(article.es);
      }
    }
    this.onCloseModal();
  }

  addArticleToSection(link: string) {
    this.selectedSubSection = this._sectionSvc.getLinkId(link);
    this.showAddArticleForm();
  }

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
    if (this.selectedSubSection === '' && partner.id) {
      this.addPartner(sectionDetails, imagePath);
    } else {
      this.editPartner(sectionDetails, imagePath);
    }
    this.onCloseModal();
  }

  addPartner(details: SectionDetails, imagePath: string) {
    const libraryId = this.createNewSubSection(details, imagePath);
    const partnerContent: Content = {
      title: details.en.title,
      communityId: '',
      type: contentType.partner,
      contentId: '',
      description: details.en.description,
      link: `${helpfulInfo.topicPath}${libraryId}`,
      video: '',
      thumbnail: '',
      brandLogo: imagePath
    };
    this.sectionData.en.sections[0].content.push(partnerContent);
    this.sectionData.es.sections[0].content.push({
      ...partnerContent,
      description: details.es.description
    });
    this.sectionData.en.sections[0].isPartner =
      this.sectionData.es.sections[0].isPartner = true;
  }

  editPartner(details: SectionDetails, image: string) {
    const sectionIndex = this.sectionData.en.sections[0].content.findIndex(
      (c) => this._sectionSvc.getLinkId(c.link) == this.selectedSubSection
    );

    this.sectionData.en.sections[0].content[sectionIndex].title =
      this.sectionData.es.sections[0].content[sectionIndex].title =
        details.en.title;
    this.sectionData.en.sections[0].content[sectionIndex].description =
      details.en.description;
    this.sectionData.es.sections[0].content[sectionIndex].description =
      details.es.description;
    this.sectionData.en.sections[0].content[sectionIndex].brandLogo =
      this.sectionData.es.sections[0].content[sectionIndex].brandLogo = image;

    const selectedIndex = this.findSubSectionIndex(this.selectedSubSection);
    if (selectedIndex > -1) {
      // Edit Bucket Content if not a common library
      this.subSections[this.selectedSubSectionIndex].en.title =
        this.subSections[this.selectedSubSectionIndex].es.title =
          details.en.title;
      this.subSections[this.selectedSubSectionIndex].en.description =
        details.en.description;
      this.subSections[this.selectedSubSectionIndex].es.description =
        details.es.description;
      this.subSections[this.selectedSubSectionIndex].en.brandLogo =
        this.subSections[this.selectedSubSectionIndex].es.brandLogo = image;
    }
  }

  /**
   * Show Sub Section Form Modal
   * @param isVideoLib Is SubSection considered a video library
   */
  showAddSubSectionForm(isVideoLib: boolean) {
    this.subSectionModal = true;
    this.subSectionData = this._sectionSvc.initSectionDetails();
    this.isVideoLibrary = isVideoLib;
  }

  showAddPartnerModal() {
    this.selectedPartner = {
      isEdit: false,
      title: '',
      description: {
        en: '',
        es: ''
      },
      logoImage: ''
    };
    this.partnerModal = true;
  }

  addToSubSection(data: SectionDetails) {
    const sectionType = this.isVideoLibrary
      ? contentType.videoLibrary
      : contentType.bucket;
    if (this.selectedSubSection == '') {
      const libraryId = this.createNewSubSection(data);
      this.addSubSectionToSection(data, libraryId, sectionType);
    } else {
      this.editSubSection(data);
    }

    this.sectionData.en.sections[0].isGridView =
      this.sectionData.es.sections[0].isGridView = false;
    this.onCloseModal();
  }

  editSubSection(data: SectionDetails) {
    const sectionIndex = this.sectionData.en.sections[0].content.findIndex(
      (c) => this._sectionSvc.getLinkId(c.link) == this.selectedSubSection
    );
    this.sectionData.en.sections[0].content[sectionIndex].title = data.en.title;
    this.sectionData.en.sections[0].content[sectionIndex].description =
      data.en.description;

    this.sectionData.es.sections[0].content[sectionIndex].title = data.es.title;
    this.sectionData.es.sections[0].content[sectionIndex].description =
      data.es.description;

    const selectedIndex = this.findSubSectionIndex(this.selectedSubSection);
    if (selectedIndex > -1) {
      // Edit Bucket Content if not a common library
      this.subSections[this.selectedSubSectionIndex].en.title = data.en.title;
      this.subSections[this.selectedSubSectionIndex].en.description =
        data.en.description;

      this.subSections[this.selectedSubSectionIndex].es.title = data.es.title;
      this.subSections[this.selectedSubSectionIndex].es.description =
        data.es.description;
    }
  }

  createNewSubSection(data: SectionDetails, partnerLogo?: string) {
    const libraryData = partnerLogo
      ? this._sectionSvc.initPartnerLibrary(data, partnerLogo)
      : this._sectionSvc.initOtherLibrary(data);
    this.subSections.push(libraryData.data);

    return libraryData.helpfulInfoId;
  }

  addSubSectionToSection(
    data: SectionDetails,
    libraryId: string,
    sectionType: string
  ) {
    const sectionReference = this._sectionSvc.getTopicContent(
      data,
      sectionType,
      libraryId
    );
    this.sectionData.en.sections[0].content.push(sectionReference.en);
    this.sectionData.es.sections[0].content.push(sectionReference.es);
  }

  manageSubSectionEdit(data: any, index: number) {
    if (data.type === contentType.partner) {
      this.showEditPartner(data, index);
    } else {
      this.showEditSubSection(data, index);
    }
  }

  showEditPartner(data: any, index: number) {
    this.selectedSubSection = this._sectionSvc.getLinkId(data.link);
    const selectedIndex = this.findSubSectionIndex(this.selectedSubSection);
    const partnerId = this._sectionSvc.getPartnerId(data.brandLogo);

    this.selectedPartner = {
      isEdit: true,
      title: data.title,
      description: {
        en: data.description,
        es: this.subSections[selectedIndex].es.description
      },
      logoImage: data.brandLogo,
      id: partnerId
    };
    this.partnerModal = true;
  }

  showEditSubSection(data: any, index: number) {
    this.selectedSubSection = this._sectionSvc.getLinkId(data.link);
    const selectedIndex = this.findSubSectionIndex(this.selectedSubSection);
    if (selectedIndex > -1) {
      this.subSectionData = {
        en: {
          title: this.subSections[selectedIndex].en.title,
          description: this.subSections[selectedIndex].en.description
        },
        es: {
          title: this.subSections[selectedIndex].es.title,
          description: this.subSections[selectedIndex].es.description
        },
        isEdit: true
      };
    } else {
      this.subSectionData = {
        en: {
          title: this.sectionData.en.sections[0].content[index].title,
          description:
            this.sectionData.en.sections[0].content[index].description
        },
        es: {
          title: this.sectionData.es.sections[0].content[index].title,
          description:
            this.sectionData.es.sections[0].content[index].description
        },
        isEdit: true
      };
    }
    this.subSectionModal = true;
  }

  onDeleteSubSection(data: any, index: number) {
    if (confirm(`${messages.sectionDeleteWarning} - ${data.title}?`)) {
      if (data.commonSection) {
        this.commonSection = false;
      }
      const subSectionId = this._sectionSvc.getLinkId(data.link);
      this.subSections = this.subSections.filter(
        (s) => s.en.helpfulInfoId != subSectionId
      );
      this.sectionData.en.sections[0].content.splice(index, 1);
      this.sectionData.es.sections[0].content.splice(index, 1);

      if (
        this.sectionData.en.sections[0].content.length === 0 &&
        this.sectionData.en.sections[0]?.isPartner
      ) {
        this.sectionData.en.sections[0].isPartner =
          this.sectionData.es.sections[0].isPartner = false;
      }
    }
  }

  /**
   * Section Related Functions
   */

  /**
   * Move Articles as a reference to new sub Section in case of Grid view
   */
  setSubSectionData() {
    let articlesIndex: number[] = [];
    this.sectionData.en.sections[0].content.forEach((c, i) => {
      if (
        c?.type === contentType.article &&
        !c?.link?.includes('healthWise') &&
        !c?.link?.includes('referenceContent') &&
        (c?.provider === articleProviders.meredith ||
          c?.provider === articleProviders.other)
      ) {
        articlesIndex.push(i);
      } else {
        c.isGridView = true;
      }
    });

    if (articlesIndex.length > 0) {
      const subSectionData: SectionDetails = {
        en: {
          title: `Grid - ${this.sectionData.en.sections[0].title}`,
          description: `${this.sectionData.en.sections[0].description}`
        },
        es: {
          title: `Grid - ${this.sectionData.es.sections[0].title}`,
          description: `${this.sectionData.es.sections[0].description}`
        }
      };
      this.createNewSubSection(subSectionData);
      const subSectionId = this.subSections[0].en.helpfulInfoId;
      for (let i of articlesIndex) {
        const enSectionContent = {
          ...this.sectionData.en.sections[0].content[i],
          description: '',
          communityId: '',
          isGridView: true,
          link: `${helpfulInfo.referenceContentPath}${subSectionId}/${this.sectionData.en.sections[0].content[i].contentId}?htmlDescription=true`,
          type: contentType.article,
          video: ''
        };
        const esSectionContent = {
          ...this.sectionData.es.sections[0].content[i],
          description: '',
          communityId: '',
          isGridView: true,
          link: `${helpfulInfo.referenceContentPath}${subSectionId}/${this.sectionData.en.sections[0].content[i].contentId}?htmlDescription=true`,
          type: contentType.article,
          video: ''
        };
        this.subSections[0].en.sections[0].content.push(
          this.sectionData.en.sections[0].content[i]
        );
        this.sectionData.en.sections[0].content[i] = enSectionContent;

        //For Spanish
        this.subSections[0].es.sections[0].content.push(
          this.sectionData.es.sections[0].content[i]
        );
        this.sectionData.es.sections[0].content[i] = esSectionContent;
      }
    }
  }

  createSection() {
    const videoIndex = this.isVideoLibrarySection();
    if (videoIndex > -1) {
      //Change Video Reference Types to Video
      this.processVideoReferences(videoIndex);
    }
    if (this.sectionData.en.sections[0].isGridView) {
      this.setSubSectionData();
    } else {
      let otherSectionRequired = false;
      const libraryData = this._sectionSvc.initOtherLibrary(
        this._sectionSvc.initSectionDetails()
      );
      const otherSection = libraryData.data;
      const otherLibraryId = libraryData.helpfulInfoId;
      this.subSections.forEach((subSection: any) => {
        const articlesIndex: number[] = [];
        subSection.en.sections[0].content.forEach((content: any, i: number) => {
          if (
            content?.type === contentType.article &&
            content?.provider !== articleProviders.healthwise
          ) {
            articlesIndex.push(i);
          }
        });
        if (articlesIndex.length > 0) {
          otherSectionRequired = true;
          articlesIndex.forEach((index: number) => {
            otherSection.en.sections[0].content.push(
              subSection.en.sections[0].content[index]
            );
            otherSection.es.sections[0].content.push(
              subSection.es.sections[0].content[index]
            );

            subSection.en.sections[0].content[index] = {
              ...subSection.en.sections[0].content[index],
              description: '',
              copyright: '',
              link: `${helpfulInfo.referenceContentPath}${otherLibraryId}/${subSection.en.sections[0].content[index].contentId}${helpfulInfo.htmlParameter}`
            };
            subSection.es.sections[0].content[index] = {
              ...subSection.es.sections[0].content[index],
              description: '',
              copyright: '',
              link: `${helpfulInfo.referenceContentPath}${otherLibraryId}/${subSection.en.sections[0].content[index].contentId}${helpfulInfo.htmlParameter}`
            };
          });
        }
      });

      if (otherSectionRequired) {
        this.subSections.push(otherSection);
      }
    }

    this._sectionSvc
      .createSection({
        section: this.sectionData,
        subSections: this.subSections
      })
      .subscribe((result: any) => {
        if (result.data.isSuccess) {
          this.sectionCreated = true;
          this._toastr.success(messages.sectionCreated);
          this.toHelpfulInfo();
        }
      });
  }

  //Return the section index from community library which contains video library section
  isVideoLibrarySection() {
    let videoLibraryIndex = -1;
    this.sectionData.en.sections.forEach((section: any, index: number) => {
      section.content.forEach((content: any) => {
        if (content.type === contentType.videoLibrary) {
          videoLibraryIndex = index;
        }
      });
    });
    return videoLibraryIndex;
  }

  //Convert Video References to HWVideo in a given section
  processVideoReferences(index: number) {
    this.sectionData.en.sections[index].content.forEach((content) => {
      if (content.type === contentType.video) {
        content.type = contentType.videoTile;
      }
    });
    this.sectionData.es.sections[index].content.forEach((content) => {
      if (content.type === contentType.video) {
        content.type = contentType.videoTile;
      }
    });
    this.sectionData.en.sections[index].isGridView = false;
    this.sectionData.es.sections[index].isGridView = false;
  }

  getCreateStatus() {
    if (this.sectionData.en.sections[0]?.isGridView) {
      return this.sectionData.en.sections[0].content.length == 0;
    } else {
      if (this.sectionData.en.sections[0].content.length > 0) {
        let articlePresent = false;
        if (this.subSections.length > 0) {
          for (let subSection of this.subSections) {
            if (subSection.en.sections[0].content.length === 0) {
              articlePresent = true;
              break;
            }
          }
        } else if (
          this.sectionData.en.sections[0].content[0].type === contentType.bucket
        ) {
          return false;
        }
        return articlePresent;
      } else {
        return true;
      }
    }
  }

  /**
   *
   * Generic Methods
   */

  findSubSectionIndex(sectionId: string) {
    const index = this.subSections.findIndex(
      (s) => s.en.helpfulInfoId == sectionId
    );
    this.selectedSubSectionIndex = index;
    return index;
  }

  toHelpfulInfo() {
    this._router.navigate([
      '/ui/pages/admin/add-helpful-info',
      { communityId: this.communityId, title: this.title }
    ]);
  }

  backToCommunity(message: string) {
    this._toastr.error(message);
    this._router.navigate(['/ui/pages/admin/community']);
  }

  getChildren(link: string) {
    const sectionId = this._sectionSvc.getLinkId(link);
    const index = this.subSections.findIndex(
      (s) => s.en.helpfulInfoId == sectionId
    );
    if (index == -1) {
      return [];
    }
    return this.subSections[index].en.sections[0].content;
  }

  onCloseModal() {
    this.articleModal = false;
    this.partnerModal = false;
    this.selectedSubSection = '';
    this.selectedSubSectionIndex = -1;
    this.selectedArticleIndex = -1;
    this.subSectionModal = false;
    this.subSectionData.isEdit = false;
    this.isVideoLibrary = false;
    this.displayCommonLibrary = false;
  }

  onPressEditExternalReferenceButton(index: number) {
    this.isEditSelected = true;
    this.externalReferenceSectionIndex = index;
    if (index > -1) {
      this.externalRefernceData = {
        en: this.sectionData.en.sections[0].content[index],
        es: this.sectionData.es.sections[0].content[index]
      };
      this.isExternalReferenceOpened = true;
    }
  }

  onPressEditExternalReferenceInSubSection(link: string, index: number) {
    this.isEditSelected = true;
    this.externalReferenceSubSectionIndex = index;
    this.selectedSubSection = this._sectionSvc.getLinkId(link);
    const selectedIndex = this.findSubSectionIndex(this.selectedSubSection);
    if (selectedIndex > -1) {
      this.externalRefernceData = {
        en: this.subSections[selectedIndex].en.sections[0].content[index],
        es: this.subSections[selectedIndex].es.sections[0].content[index]
      };
      this.isExternalReferenceOpened = true;
    }
  }

  closeExternalReferenceModal() {
    this.toggleExternalLink();
    this.resetExternalReference();
  }

  resetExternalReference() {
    this.externalReferenceSectionIndex = -1;
    this.externalReferenceSubSectionIndex = -1;
    this.isEditSelected = false;
    this.externalRefernceData = null;
    this.selectedSubSection = '';
  }

  createExternalRefernce(data: ExternalReferenceResponse) {
    if (this.isEditSelected) {
      this.isEditSelected = false;

      if (!!this.selectedSubSection) {
        const selectedIndex = this.findSubSectionIndex(this.selectedSubSection);
        if (selectedIndex > -1 && this.externalReferenceSubSectionIndex > -1) {
          this.subSections[selectedIndex].en.sections[0].content[
            this.externalReferenceSubSectionIndex
          ] = data.en;
          this.subSections[selectedIndex].es.sections[0].content[
            this.externalReferenceSubSectionIndex
          ] = data.es;
        }
        this.selectedSubSection = '';
      } else {
        if (this.externalReferenceSectionIndex > -1) {
          this.sectionData.en.sections[0].content[
            this.externalReferenceSectionIndex
          ] = data.en;
          this.sectionData.es.sections[0].content[
            this.externalReferenceSectionIndex
          ] = data.es;
        }
      }
    } else {
      if (!!this.selectedSubSection) {
        const subIndex = this.findSubSectionIndex(this.selectedSubSection);
        if (subIndex > -1) {
          this.subSections[subIndex].en.sections[0].content.push(data.en);
          this.subSections[subIndex].es.sections[0].content.push(data.es);
        }
        this.selectedSubSection = '';
      } else {
        this.sectionData.en.sections[0].content.push(data.en);
        this.sectionData.es.sections[0].content.push(data.es);
      }
    }
  }

  onPressAddExternalRefernceToSection(link: string) {
    this.selectedSubSection = this._sectionSvc.getLinkId(link);
    this.toggleExternalLink();
  }

  reorderSectionContent(data: CdkDragDrop<any[]>) {
    if (data.previousIndex !== data.currentIndex) {
      moveItemInArray(
        this.sectionData.en.sections[0].content,
        data.previousIndex,
        data.currentIndex
      );
      moveItemInArray(
        this.sectionData.es.sections[0].content,
        data.previousIndex,
        data.currentIndex
      );
    }
  }

  reorderSubSectionContent(data: CdkDragDrop<any[]>, sectionLink: string) {
    if (data.previousIndex !== data.currentIndex) {
      const sectionId = this._sectionSvc.getLinkId(sectionLink);
      const index = this.subSections.findIndex(
        (s) => s.en.helpfulInfoId == sectionId
      );
      moveItemInArray(
        this.subSections[index].en.sections[0].content,
        data.previousIndex,
        data.currentIndex
      );
      moveItemInArray(
        this.subSections[index].es.sections[0].content,
        data.previousIndex,
        data.currentIndex
      );
    }
  }
}
