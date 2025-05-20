import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CharacterLimits, libraryType, messages } from 'src/app/core/constants';
import { LoadSectionData } from 'src/app/core/models/helpfulInfo';

@Component({
  selector: 'app-lib-section-detail',
  templateUrl: './lib-section-detail.component.html',
  styleUrls: ['./lib-section-detail.component.scss']
})
export class LibSectionDetailComponent implements OnInit {
  @Input() sectionMode = '';
  @Input() sectionData!: LoadSectionData;
  @Output() submitData = new EventEmitter<LoadSectionData>();

  newSectionTitle = '';
  newSectionDesc = '';
  esNewSectionTitle = '';
  esNewSectionDesc = '';

  enDisplayStepZeroError = false;
  esDisplayStepZeroError = false;

  limits = CharacterLimits;

  constructor(private toastrSvc: ToastrService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.sectionMode?.currentValue === '') {
      if (!this.sectionMode || this.sectionMode === '') {
        this.sectionMode = libraryType.section;
      }
    }
    if (changes?.sectionData?.currentValue) {
      this.newSectionTitle = changes.sectionData.currentValue.en.title;
      this.newSectionDesc = changes.sectionData.currentValue.en.description;
      this.esNewSectionTitle = changes.sectionData.currentValue.es.title;
      this.esNewSectionDesc = changes.sectionData.currentValue.es.description;
    }
  }

  submitValues() {
    if (this.isValid() && this.isValuesChanged()) {
      let requestData: LoadSectionData;
      const enData = {
        title: this.newSectionTitle,
        description: this.newSectionDesc,
        content: []
      };
      const esData = {
        title: this.esNewSectionTitle,
        description: this.esNewSectionDesc,
        content: []
      };
      if (this.sectionMode === libraryType.section) {
        requestData = {
          sectionIndex: this.sectionData.sectionIndex,
          communityId: this.sectionData.communityId,
          en: enData,
          es: esData
        };
      } else {
        requestData = {
          sectionIndex: this.sectionData.sectionIndex,
          subSectionIndex: this.sectionData.subSectionIndex,
          subSectionId: this.sectionData.subSectionId,
          communityId: this.sectionData.communityId,
          en: enData,
          es: esData
        };
      }
      this.submitData.emit(requestData);
    }
  }

  isValid() {
    this.enDisplayStepZeroError = this.newSectionTitle.trim() === '';
    this.esDisplayStepZeroError = this.esNewSectionTitle.trim() === '';
    return !this.enDisplayStepZeroError && !this.esDisplayStepZeroError;
  }

  isValuesChanged() {
    if (
      this.sectionData.en.title !== this.newSectionTitle.trim() ||
      this.sectionData.en.description !== this.newSectionDesc.trim() ||
      this.sectionData.es.title !== this.esNewSectionTitle.trim() ||
      this.sectionData.es.description !== this.esNewSectionDesc.trim()
    ) {
      return true;
    } else {
      this.toastrSvc.info(messages.editValues);
      return false;
    }
  }
}
