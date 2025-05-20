import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { contentType } from 'src/app/core/constants';
import { SectionDetails } from 'src/app/core/models/helpfulInfo';
import { SectionService } from '../section.service';

@Component({
  selector: 'app-common-lib-view',
  templateUrl: './common-lib-view.component.html',
  styleUrls: ['./common-lib-view.component.scss']
})
export class CommonLibViewComponent implements OnInit {
  @Input() displayModal = false;
  @Output() onClose = new EventEmitter();
  @Output() onSubmit = new EventEmitter();

  commonLibrary = <any>[];
  esCommonLibrary = <any>[];
  selectedLibraryIndex = -1;
  videoType = '^(HWVideo|HWVideoReference)$';
  bucketType = '^(HWBTNVideoList|HWTopic)$';

  constructor(private _sectionSvc: SectionService) {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    if (this.displayModal) {
      this.showCommonArticles();
    }
    this.selectedLibraryIndex = -1;
  }

  closeModal() {
    this.onClose.emit();
  }

  showCommonArticles() {
    this._sectionSvc.getCommonSection().subscribe((result: any) => {
      if (result.data.isSuccess) {
        const commonData = result.data.value;
        for (const lib of commonData) {
          this.commonLibrary.push({
            helpfulInfoId: lib.helpfulInfoId,
            title: lib.en.title,
            description: lib.en.description,
            content: lib.en.sections[0].content
          });
          this.esCommonLibrary.push({
            helpfulInfoId: lib.helpfulInfoId,
            title: lib.es.title,
            description: lib.es.description,
            content: lib.es.sections[0].content
          });
        }
      }
    });
  }

  librarySelected() {
    const data: SectionDetails = {
      en: {
        title: this.commonLibrary[this.selectedLibraryIndex].title,
        description: this.commonLibrary[this.selectedLibraryIndex].description
      },
      es: {
        title: this.esCommonLibrary[this.selectedLibraryIndex].title,
        description: this.esCommonLibrary[this.selectedLibraryIndex].description
      }
    };
    const selectedLibrary = this._sectionSvc.getTopicContent(
      data,
      contentType.bucket,
      this.commonLibrary[this.selectedLibraryIndex].helpfulInfoId
    );
    selectedLibrary.en.commonSection = selectedLibrary.es.commonSection = true;

    this.onSubmit.emit(selectedLibrary);
  }
}
