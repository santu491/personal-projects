import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {
  ExpandCollapseStatusEnum,
  MultilevelMenuService
} from 'ng-material-multilevel-menu';
import {
  DEEPLINK_ICONS,
  DEEPLINK_LABEL,
  ICON_TYPE,
  Language,
  contentType,
  helpfulInfo,
  roles
} from 'src/app/core/constants';
import { icons } from 'src/app/core/defines';
import { Community, DeepLinkData } from 'src/app/core/models';
import { LibraryContentService } from 'src/app/core/services/library-content.service';
import { generateHelpfulDeepLinks } from 'src/app/core/utils';

@Component({
  selector: 'app-multilevel-menu',
  templateUrl: './multilevel-menu.component.html',
  styleUrls: ['./multilevel-menu.component.scss']
})
export class MultilevelMenuComponent implements OnInit {
  @Input() deeplinkLabel!: DeepLinkData;
  enLabel!: string;
  esLabel!: string;
  public heading: string = '';
  private myCommunities = localStorage.getItem('communities');
  public isAdvocate = localStorage.getItem('role') === roles[1].role ?? false;
  public communityList: Array<Community> = [];
  public deepLinkData: Array<any> = [];
  public libraryDeeplinkData: Array<any> = [];
  public libraryData: any;

  topicTypesRegEx = '^(HWReference|HWVideo|HWVideoReference)$';
  selectedCommunityId!: string;
  selectedCommunityLabel!: string;
  selectedCategory!: string;
  selectedDeeplink: any;
  loadingHelpfulInfo = false;
  helpfulInfoRequested = false;
  titleError = false;
  isEdit = false;

  // DeepLink Container Config
  public config = {
    classname: 'deeplink-container',
    backgroundColor: 'transparent',
    selectedListFontColor: '#6839B6',
    paddingAtStart: true,
    interfaceWithRoute: false,
    highlightOnSelect: true,
    collapseOnSelect: true,
    rtlLayout: false,
    useDividers: false
  };

  @Input() headerData: any;
  @Input() communityListData: any;
  @Output() onItemSelectEvent = new EventEmitter<any>();

  constructor(
    private _multilevelMenuService: MultilevelMenuService,
    private _libraryService: LibraryContentService
  ) {}

  selectedLabel(event: any) {
    if (
      event.label === DEEPLINK_LABEL.me ||
      event.label === DEEPLINK_LABEL.local
    ) {
      this.selectedCategory = event.label;
    }
    if (event?.communityId) {
      this.selectedCommunityId = event.communityId;
      this.selectedCategory = event.label;
    }
  }

  selectedItem(event: any) {
    if (event.label === DEEPLINK_LABEL.library) {
      this.helpfulInfoRequested = true;
      this.generateHelpfulInfo();
    } else {
      this.loadingHelpfulInfo = true;
      this.helpfulInfoRequested = false;
    }
    this._multilevelMenuService.setMenuExapandCollpaseStatus(
      ExpandCollapseStatusEnum.collapse
    );
    this.setSelectedlabel(event);
  }

  generateData() {
    if (this.communityList?.length) {
      if (this.isAdvocate) {
        this.communityList = this.communityList.filter((item) =>
          this.myCommunities?.includes(item.id)
        );
      }
    }
    //Get Data in English
    this._libraryService
      .getDeeplinkData(Language.ENGLISH)
      .subscribe((enResponse: any) => {
        const enData = enResponse.data.value.filter((module: any) => {
          return module?.contentType === 'deepLink';
        });
        const enDeepLink = enData[0].data.deepLinkModule;
        //Get data in Spanish
        this._libraryService
          .getDeeplinkData(Language.SPANISH)
          .subscribe((esResponse: any) => {
            const esData = esResponse.data.value.filter((module: any) => {
              return module?.contentType === 'deepLink';
            });
            const esDeepLink = esData[0].data.deepLinkModule;
            const genericDeeplinkData = this.getDeepLinkData(
              enDeepLink,
              esDeepLink
            );
            this.deepLinkData = genericDeeplinkData;
          });
      });
  }

  getDeepLinkData(enDeeplinks: any[], esDeeplinks: any[]) {
    const deeplinkItems: any[] = [];
    enDeeplinks.forEach((item) => {
      const spanishContent = esDeeplinks.find(
        (es) => es.contentKey === item.contentKey
      );
      const communitySection: any[] = [];
      let sectionCommunityId: string[] = [];
      let esSection = spanishContent.sections[0];

      item.sections.forEach((sectionData: any) => {
        if (sectionData?.communityId) {
          esSection = spanishContent.sections.find(
            (e: any) => e.communityId === sectionData.communityId
          );
        }
        if (sectionData?.title) {
          //Match Spanish Content
          const submenu = sectionData.content.map((c: any) => {
            const spanishContent = esSection.content.find(
              (esContent: any) => esContent.url === c.url
            );
            return {
              label: c.label,
              label_es: spanishContent.label,
              url: c.url,
              iconType: c.iconType
            };
          });
          deeplinkItems.push({
            label: sectionData.title,
            items: submenu
          });
        }

        if (sectionData?.communityName) {
          const submenu = sectionData?.options?.map((c: any) => {
            const spanishContent = esSection?.options?.find(
              (esContent: any) => esContent.url === c.url
            );
            return {
              label: c.label,
              label_es: spanishContent.label,
              url: c.url,
              iconType: c.iconType
            };
          });
          sectionCommunityId.push(sectionData.communityId);
          communitySection.push({
            label: sectionData.communityName,
            communityId: sectionData.communityId,
            items: submenu
          });
        }
      });
      if (item?.contentKey === 'communities') {
        const community = this.communityList.filter((comm) =>
          sectionCommunityId.includes(comm.id)
        );
        const communityIds = community.map((c) => c.id);
        const sectionData = communitySection.filter((sectionData) => {
          return communityIds.includes(sectionData.communityId);
        });
        if (community) {
          deeplinkItems.push({
            label: DEEPLINK_LABEL.community,
            items: sectionData
          });
        }
      }
    });

    return deeplinkItems;
  }

  addNestedHelpfulDeepLinks = (
    communityId: string,
    communityDeepLinkItems: any,
    libraryData: any
  ) => {
    if (
      communityDeepLinkItems?.label?.includes(DEEPLINK_LABEL.library) &&
      communityDeepLinkItems?.items?.length == 1
    ) {
      communityDeepLinkItems.items = [
        ...communityDeepLinkItems.items,
        ...generateHelpfulDeepLinks(communityId, libraryData)
      ];
    }
  };

  generateHelpfulInfo() {
    this.loadingHelpfulInfo = true;
    this._libraryService
      .getLibraryDeeplinkData(this.selectedCommunityId, Language.ENGLISH)
      .subscribe((enResponse: any) => {
        const enData = enResponse.data?.value;
        const enLibrary = enData.filter((c: any) => c?.communityId);
        this._libraryService
          .getLibraryDeeplinkData(this.selectedCommunityId, Language.SPANISH)
          .subscribe((esResponse: any) => {
            const esData = esResponse.data?.value;
            const esLibrary = esData.filter((c: any) => c?.communityId);
            const sections = this.getLibraryItems(
              enLibrary[0].sections,
              esLibrary[0].sections
            );
            this.libraryDeeplinkData = sections;
            this.loadingHelpfulInfo = false;
          });
      });
  }

  getLibraryItems(enSections: any[], esSections: any[]) {
    const sectionItems: any[] = [];
    enSections.forEach((section: any, index: number) => {
      const item = this.initLibraryItem(section);
      item['label_es'] = esSections[index].title;
      if (section?.content?.length > 0) {
        item['items'] = this.getLibraryItems(
          section.content,
          esSections[index].content
        );
      }
      if (section?.types) {
        if (section.types.length === 1) {
          item.url = section.types[0].link;
        } else {
          section.types.forEach(
            (type: { title: any; link: any }, typeIndex: number) => {
              item.items.push({
                label: type.title,
                label_es: esSections[index].types[typeIndex].title,
                url: type.link,
                items: <any>[]
              });
            }
          );
        }
      }
      sectionItems.push(item);
    });
    return sectionItems;
  }

  initLibraryItem(section: any) {
    let endNode = false;
    let iconType = null;
    let imageIcon = '';
    let brandLogo = null;
    if (section?.type && section?.type.match(this.topicTypesRegEx)) {
      endNode = true;

      if (section?.type === contentType.article) {
        imageIcon = icons.deeplink.article;
        iconType = section?.isGridView
          ? ICON_TYPE.partner
          : section?.brandLogo && section?.brandLogo !== ''
          ? ICON_TYPE.partner
          : ICON_TYPE.read;
        brandLogo = section?.brandLogo;
      } else {
        imageIcon = icons.deeplink.video;
        iconType = section?.isGridView
          ? section?.brandLogo && section?.brandLogo !== ''
            ? ICON_TYPE.partner
            : ICON_TYPE.watch
          : ICON_TYPE.watch;
        brandLogo = section?.brandLogo;
      }
    } else {
      iconType =
        section?.type === contentType.partner
          ? ICON_TYPE.partner
          : ICON_TYPE.read;
      brandLogo = section?.brandLogo;
    }

    if(iconType === ICON_TYPE.partner && !brandLogo.includes(helpfulInfo.isArticleParameter)) {
      brandLogo += helpfulInfo.isArticleParameter;
    }

    return {
      label: section.title,
      label_es: '',
      url: section?.link,
      items: <any>[],
      endNode: endNode,
      imageIcon: imageIcon,
      copyright: section?.copyright ?? null,
      iconType: iconType,
      brandLogo: brandLogo,
      articleType: section?.video !== "" ? DEEPLINK_ICONS.VIDEO: DEEPLINK_ICONS.READ
    };
  }

  selectedLibraryLabel(event: any) {
    if (!event.endNode) {
      if (event.url) {
        this.setSelectedlabel(event);

        if (event.items.length === 0) {
          const params = event.url.split('/');
          this._libraryService
            .getContent(
              this.selectedCommunityId,
              params[params.length - 1],
              'en'
            )
            .subscribe((enResponse: any) => {
              this.loadingHelpfulInfo = true;
              this._libraryService
                .getContent(
                  this.selectedCommunityId,
                  params[params.length - 1],
                  'es'
                )
                .subscribe((esResponse: any) => {
                  event.items = this.getLibraryItems(
                    enResponse.data.value.sections[0].content,
                    esResponse.data.value.sections[0].content
                  );
                  this.libraryDeeplinkData = this.libraryDeeplinkData.slice();
                  this.loadingHelpfulInfo = false;
                });
            });
        }
      }
    } else {
      this.setSelectedlabel(event);
      this._multilevelMenuService.setMenuExapandCollpaseStatus(
        ExpandCollapseStatusEnum.collapse
      );
    }
  }

  setSelectedItem(item: any) {
    this.enLabel = item.label;
    this.esLabel = item.label_es;
    this.selectedDeeplink = item;
    this.onItemSelectEvent.emit(item);
  }

  setSelectedlabel(item: any) {
    this.selectedCommunityLabel = this.selectedCategory;
    this.setSelectedItem(item);
  }

  setDeeplinkTitle(label: any, language: string) {
    if (label.trim() === '') {
      this.titleError = true;
      return;
    }
    this.titleError = false;

    if (language === Language.ENGLISH) {
      this.enLabel = label;
    } else {
      this.esLabel = label;
    }

    if (!this.selectedDeeplink) {
      this.onItemSelectEvent.emit({
        label: this.enLabel,
        label_es: this.esLabel
      });
    } else {
      this.selectedDeeplink.label = this.enLabel;
      this.selectedDeeplink.label_es = this.esLabel;
      this.setSelectedItem(this.selectedDeeplink);
    }
  }

  ngOnInit(): void {
    this.heading = this.headerData;
    this.communityList = this.communityListData;
    this.generateData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes?.deeplinkLabel?.currentValue &&
      changes.deeplinkLabel?.currentValue?.en !== ''
    ) {
      this.isEdit = true;
      this.enLabel = changes?.deeplinkLabel?.currentValue?.en;
      this.esLabel = changes?.deeplinkLabel?.currentValue?.es ?? '';
      this.titleError = false;
    }
  }
}
