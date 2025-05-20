import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CharacterLimits } from 'src/app/core/constants';
import { ExternalReferenceResponse } from 'src/app/core/models/helpfulInfo';

@Component({
  selector: 'app-external-reference-view',
  templateUrl: './external-reference-view.component.html',
  styleUrls: ['./external-reference-view.component.scss']
})
export class ExternalReferenceViewComponent implements OnInit {
  form!: UntypedFormGroup;
  limits = CharacterLimits;
  isEdit = false;

  @Input() displayForm = false;
  @Input() externalRefernceData!: ExternalReferenceResponse | null;
  @Output() closeModal = new EventEmitter<string>();
  @Output() onSubmitForm = new EventEmitter<ExternalReferenceResponse>();

  constructor(private fb: UntypedFormBuilder) {
    this.createForm(fb);
  }

  isValidUrl(input: any) {
    try {
      new URL(input?.value);
      return true;
    } catch (err) {
      return { mismatchedUrl: true };
    }
  }

  createForm(fb: UntypedFormBuilder) {
    this.form = fb.group({
      en: fb.group({
        title: [
          '',
          [
            Validators.required,
            Validators.maxLength(CharacterLimits.articleTitle)
          ]
        ],
        description: [
          '',
          Validators.maxLength(CharacterLimits.articleDescription)
        ],
        link: ['', [Validators.required, this.isValidUrl]],
        type: ['HWExternalReference'],
        communityId: [''],
        contentId: [''],
        video: [''],
        thumbnail: ['']
      }),
      es: fb.group({
        title: [
          '',
          [
            Validators.required,
            Validators.maxLength(CharacterLimits.articleTitle)
          ]
        ],
        description: [
          '',
          Validators.maxLength(CharacterLimits.articleDescription)
        ],
        link: ['', [Validators.required, this.isValidUrl]],
        type: ['HWExternalReference'],
        communityId: [''],
        contentId: [''],
        video: [''],
        thumbnail: ['']
      })
    });
  }

  get title() {
    return this.form.get('en.title');
  }

  get description() {
    return this.form.get('en.description');
  }

  get link() {
    return this.form.get('en.link');
  }

  get es_title() {
    return this.form.get('es.title');
  }

  get es_link() {
    return this.form.get('es.link');
  }

  get es_description() {
    return this.form.get('es.description');
  }

  get formControl() {
    return this.form.controls;
  }

  ngOnInit(): void {
    if (this.externalRefernceData) {
      this.form.setValue({
        en: this.externalRefernceData.en,
        es: this.externalRefernceData.es
      });
      this.isEdit = true;
    } else {
      this.createForm(this.fb);
      this.isEdit = false;
    }
  }

  onpress() {
    this.onSubmitForm.emit({
      ...this.form.value,
      isEdit: this.isEdit
    });
    this.onCloseModal();
  }

  onCloseModal() {
    this.form.reset();
    this.closeModal.emit();
  }
}
