import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { contentType, generic, helpfulInfo } from 'src/app/core/constants';
import {
  ArticleResponse,
  ExternalReferenceResponse,
  SectionContentArray
} from 'src/app/core/models/helpfulInfo';
import { generateHexId } from 'src/app/core/utils';
import { HelpfulInfoService } from '../../helpful-info.service';
import { SectionContentService } from '../section-content.service';

@Component({
  selector: 'app-grid-section',
  templateUrl: './grid-section.component.html',
  styleUrls: ['./grid-section.component.scss']
})
export class GridSectionComponent implements OnInit {
  @Input() subSections!: any;
  @Output() onAddArticle = new EventEmitter();
  @Output() onEditArticle = new EventEmitter<ArticleResponse>();
  @Output() manageLink = new EventEmitter<null | ExternalReferenceResponse>();

  constructor(
    private _helpfulInfo: HelpfulInfoService,
    private _section: SectionContentService,
    private _toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  deleteSectionArticle(data: any) {
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

  editSectionArticle(data: any) {
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
        en: this.subSections.en.content[index],
        es: this.subSections.es.content[index],
        isEdit: true,
        id: this._section.getContentId(data)
      });
    }
  }

  publishSectionChanges() {
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
    delete this.subSections.en?.isOrderChanged;
    const data = {
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

  addArticleToSection() {
    this.onAddArticle.emit();
  }

  addExternalLink() {
    this.manageLink.emit();
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
        link: `${helpfulInfo.referenceContentPath}${libraryId}/${this.subSections.en.content[i].contentId}${helpfulInfo.htmlParameter}`,
        description: '',
        copyright: '',
        isGridView: true
      };
      this.subSections.es.content[i] = {
        ...this.subSections.es.content[i],
        link: `${helpfulInfo.referenceContentPath}${libraryId}/${this.subSections.es.content[i].contentId}${helpfulInfo.htmlParameter}`,
        description: '',
        copyright: '',
        isGridView: true
      };
    });
  }

  reorder(data: CdkDragDrop<any[]>) {
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

      this.subSections.en.isOrderChanged = true;
    }
  }
}
