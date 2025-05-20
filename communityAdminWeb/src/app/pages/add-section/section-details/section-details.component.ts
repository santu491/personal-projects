import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CharacterLimits } from 'src/app/core/constants';
import { SectionDetails } from 'src/app/core/models/helpfulInfo';

@Component({
  selector: 'app-section-details',
  templateUrl: './section-details.component.html',
  styleUrls: ['./section-details.component.scss']
})
export class SectionDetailsComponent implements OnInit {
  form!: UntypedFormGroup;
  limits = CharacterLimits;

  @Input() sectionData!: SectionDetails | undefined;
  @Input() mode!: string;
  @Output() onBack = new EventEmitter();
  @Output() onSubmit = new EventEmitter<SectionDetails>();

  constructor(private fb: UntypedFormBuilder) {
    this.createForm(fb);
  }

  ngOnInit(): void {}

  ngOnChanges(): void {
    if (this.sectionData && this.sectionData?.isEdit) {
      this.form.setValue({
        en: this.sectionData.en,
        es: this.sectionData.es
      });
    } else {
      this.createForm(this.fb);
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
        ]
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
        ]
      })
    });
  }

  get title() {
    return this.form.get('en.title');
  }

  get esTitle() {
    return this.form.get('es.title');
  }

  get description() {
    return this.form.get('en.description');
  }

  get esDescription() {
    return this.form.get('es.description');
  }

  onBackClick() {
    this.onBack.emit();
  }

  onNextClick() {
    this.onSubmit.emit(this.form.value);
  }
}
