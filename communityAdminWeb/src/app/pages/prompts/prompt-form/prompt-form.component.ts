import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CANCER_PROMPT_OPTION, messages } from 'src/app/core/constants';
import { OptionFormData, Prompt } from 'src/app/core/models/prompts';
import { generateHexId } from 'src/app/core/utils';

@Component({
  selector: 'app-prompt-form',
  templateUrl: './prompt-form.component.html',
  styleUrls: ['./prompt-form.component.scss']
})
export class PromptFormComponent implements OnInit {
  prompt!: Prompt;
  showAddCommunity = false;
  optionData: OptionFormData = new OptionFormData();

  @Output() addPrompt = new EventEmitter<Prompt>();
  @Output() cancelPrompt = new EventEmitter();
  @Output() deletePrompt = new EventEmitter<string>();

  @Input() editData: Prompt | undefined;

  constructor() {}

  ngOnInit(): void {
    this.initData();
  }

  ngOnChanges() {
    this.initData();
  }

  initData() {
    this.prompt = this.editData
      ? this.editData
      : {
          promptId: '',
          en: {
            question: '',
            sectionTitle: '',
            helpText: '',
            sensitiveContentText: ''
          },
          es: {
            question: '',
            sectionTitle: '',
            helpText: '',
            sensitiveContentText: ''
          }
        };
  }

  onSave() {
    if (this.prompt.en.question == '' || this.prompt.es.question == '') {
      return;
    } else {
      if (!this.prompt.promptId) {
        this.prompt.promptId = generateHexId();
      }
      this.addPrompt.emit(this.prompt);
      this.initData();
    }
  }

  onCancel() {
    this.cancelPrompt.emit();
  }

  onDelete(promptId: string) {
    if (confirm(messages.deletePrompt)) {
      this.deletePrompt.emit(promptId);
    }
  }

  showAddCommunityForm() {
    this.showAddCommunity = true;
  }

  addCommunityOption() {
    if (this.optionData.en.trim() === '' || this.optionData.es.trim() === '') {
      return;
    }

    if (this.optionData.isEdit) {
      const index =
        this.prompt.en.options?.findIndex(
          (option) => this.optionData.id === option.id
        ) ?? -1;
      if (index > -1 && this.prompt.en.options && this.prompt.es.options) {
        this.prompt.en.options[index].title = this.optionData.en;
        this.prompt.es.options[index].title = this.optionData.es;
      }
    } else {
      const newCancerId = generateHexId();
      this.prompt.en.options?.push({
        id: newCancerId,
        title: this.optionData.en,
        type: CANCER_PROMPT_OPTION.cancer
      });
      this.prompt.es.options?.push({
        id: newCancerId,
        title: this.optionData.es,
        type: CANCER_PROMPT_OPTION.cancer
      });
      this.reorderOtherOption();
    }
    this.clearOptionForm();
    this.showAddCommunity = false;
  }

  drop(event: CdkDragDrop<[]>) {
    if (this.prompt.en.options && this.prompt.es.options) {
      moveItemInArray(
        this.prompt.en.options,
        event.previousIndex,
        event.currentIndex
      );
      moveItemInArray(
        this.prompt.es.options,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  getOptionDetails(optionId: string) {
    const enOption = this.prompt.en.options?.find(
      (option) => option.id === optionId
    );
    const esOption = this.prompt.es.options?.find(
      (option) => option.id === optionId
    );
    this.optionData = {
      en: enOption?.title ?? '',
      es: esOption?.title ?? '',
      isEdit: true,
      id: optionId
    };
    this.showAddCommunityForm();
  }

  clearOptionForm() {
    this.optionData = {
      en: '',
      es: '',
      isEdit: false,
      id: undefined
    };
  }

  private reorderOtherOption() {
    const optionLength = this.prompt.en.options?.length;
    if (!optionLength) {
      return;
    }
    if (
      this.prompt.en.options &&
      this.prompt.es.options &&
      this.prompt.en.options[optionLength - 1].type !==
        CANCER_PROMPT_OPTION.other
    ) {
      [
        this.prompt.en.options[optionLength - 2],
        this.prompt.en.options[optionLength - 1]
      ] = [
        this.prompt.en.options[optionLength - 1],
        this.prompt.en.options[optionLength - 2]
      ];
      [
        this.prompt.es.options[optionLength - 2],
        this.prompt.es.options[optionLength - 1]
      ] = [
        this.prompt.es.options[optionLength - 1],
        this.prompt.es.options[optionLength - 2]
      ];
    }
  }
}
