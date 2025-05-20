import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  CharacterLimits,
  generic,
  helpfulInfo,
  libraryType,
  messages
} from 'src/app/core/constants';
import {
  Content,
  LoadSectionData,
  Section
} from 'src/app/core/models/helpfulInfo';
import { HelpfulInfoService } from './helpful-info.service';

@Component({
  selector: 'app-helpful-info',
  templateUrl: './helpful-info.component.html',
  styleUrls: ['./helpful-info.component.scss']
})
export class HelpfulInfoComponent implements OnInit {
  communityId: string | null = null;
  title: string | null = null;
  enSections: any[] = [];
  esSections: any[] = [];
  selectedSectionIndex = -1;
  limits = CharacterLimits;
  subSectionData!: any;
  commonSectionAdded: boolean = false;
  isSectionOrderModified = false;

  //Modal Controls
  sectionModalDisplay = 'none';
  sectionMode = '';
  sectionEditData!: LoadSectionData;
  articleData!: any;

  constructor(
    private _activeRoute: ActivatedRoute,
    private _router: Router,
    private _toastr: ToastrService,
    private _helpfulInfo: HelpfulInfoService
  ) {}

  ngOnInit(): void {
    this._activeRoute.paramMap.subscribe((params: ParamMap) => {
      this.communityId = params.get('communityId');
      this.title = params.get('title');
      if (!this.communityId) {
        this.backToCommunity(generic.selectCommunity);
      } else {
        this._helpfulInfo.communityId = <string>this.communityId;
        this.title = !this.title ? 'Unknown' : this.title;
        this.loadHelpfulInfo();
      }
    });
  }

  loadHelpfulInfo() {
    this._helpfulInfo.getLibraryByCommunity(<string>this.communityId).subscribe(
      (result: any) => {
        if (!result.data.isSuccess) {
          this._toastr.error(messages.noLibrary);
          return;
        }
        this.enSections = result.data.value.en.sections;
        this.esSections = result.data.value.es.sections;
        this._helpfulInfo.communityHelpfulInfoId =
          result.data.value.en.helpfulInfoId;

        for (const section of this.enSections) {
          for (const content of section.content) {
            if (content.commonSection) {
              this.commonSectionAdded = true;
            }
          }
        }
      },
      () => {
        this._toastr.error(messages.noLibrary);
      }
    );
  }

  backToCommunity(message: string) {
    this._router.navigate(['/ui/pages/admin/community']);
    this._toastr.error(message);
  }

  addSection() {
    this._router.navigate([
      '/ui/pages/admin/add-section',
      {
        communityId: this.communityId,
        title: this.title,
        common: this.commonSectionAdded
      }
    ]);
  }

  showSectionData(index: number) {
    this.selectedSectionIndex = index;
    this.subSectionData = {
      en: this.enSections[index],
      es: this.esSections[index]
    };
  }

  /**
   * Launch the Section Modal and set sectionEditData to be passed to section detail componenet
   * @param index Index of the Section Content to be edited
   */
  editSection(index: number) {
    const enSectionData: Section = {
      title: this.enSections[index].title,
      description: this.enSections[index].description,
      content: []
    };
    const esSectionData = {
      title: this.esSections[index].title,
      description: this.esSections[index].description,
      content: []
    };
    this.sectionModalDisplay = 'block';
    this.sectionMode = libraryType.section;
    this.sectionEditData = {
      sectionIndex: index,
      communityId: <string>this.communityId,
      en: enSectionData,
      es: esSectionData
    };
  }

  deleteSection(index: number) {
    if (!confirm(helpfulInfo.messages.confirmDelete)) {
      return;
    }
    this.enSections.splice(index, 1);
    this.esSections.splice(index, 1);
    this.publishChanges();
  }

  /**
   * On successful Edit of Section title and description - Set the data in local repository and close Modal
   * @param data
   */
  onEditSection(data: LoadSectionData) {
    this._helpfulInfo.editSection(data).subscribe(
      (result: any) => {
        if (result?.data?.value) {
          this._toastr.success(generic.updateSuccess);
        } else {
          this._toastr.error(generic.pleaseTryAgain);
        }
      },
      () => {
        this._toastr.error(generic.pleaseTryAgain);
      }
    );
    if (this.sectionMode === libraryType.subSection) {
      const index = data.subSectionIndex ?? -1;
      this.enSections[data.sectionIndex].content[index].title = data.en.title;
      this.enSections[data.sectionIndex].content[index].description =
        data.en.description;
      this.esSections[data.sectionIndex].content[index].title = data.es.title;
      this.esSections[data.sectionIndex].content[index].description =
        data.es.description;
    } else {
      this.enSections[data.sectionIndex].title = data.en.title;
      this.enSections[data.sectionIndex].description = data.en.description;
      this.esSections[data.sectionIndex].title = data.es.title;
      this.esSections[data.sectionIndex].description = data.es.description;
    }
    this.onCloseModal();
  }

  onCloseModal() {
    this.sectionModalDisplay = 'none';
    this.sectionEditData = {
      sectionIndex: -1,
      communityId: <string>this.communityId,
      en: {
        title: '',
        description: '',
        content: []
      },
      es: {
        title: '',
        description: '',
        content: []
      }
    };
  }

  /**
   * Launch the Section Modal and set sectionEditData to be passed to Sub Section detail componenet
   * @param editData Data of subSection to be edited
   */
  editSubSection(editData: any) {
    const linkParts = editData.en.link.split('/');
    const subSectionId = linkParts[linkParts.length - 1];
    this.sectionEditData = {
      sectionIndex: this.selectedSectionIndex,
      subSectionIndex: editData.index,
      subSectionId: subSectionId,
      communityId: <string>this.communityId,
      en: {
        title: editData.en.title,
        description: editData.en.description,
        content: []
      },
      es: {
        title: editData.es.title,
        description: editData.es.description,
        content: []
      }
    };
    this.sectionMode = libraryType.subSection;
    this.sectionModalDisplay = 'block';
  }

  isCommonSectionPresent(contents: Content[]) {
    const commonSection = contents.filter((content) => content?.commonSection);
    return commonSection.length > 0;
  }

  drop(data: CdkDragDrop<any[]>) {
    if (data.previousIndex !== data.currentIndex) {
      moveItemInArray(this.enSections, data.previousIndex, data.currentIndex);
      moveItemInArray(this.esSections, data.previousIndex, data.currentIndex);
      this.isSectionOrderModified = true;
    }
  }

  publishChanges() {
    this._helpfulInfo
      .updateSectionContent({
        helpfulInfoId: this._helpfulInfo.communityHelpfulInfoId,
        en: this.enSections,
        es: this.esSections
      })
      .subscribe((result: any) => {
        if (result.data.isSuccess) {
          this._toastr.success(helpfulInfo.messages.sectionSort);
          this.isSectionOrderModified = false;
        }
      });
  }
}
