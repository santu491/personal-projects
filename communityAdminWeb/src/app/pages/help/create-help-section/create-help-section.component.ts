import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContentService } from '../../content/content.service';
import { ToastrService } from 'ngx-toastr';
import { generic } from 'src/app/core/constants';

@Component({
  selector: 'create-help-section',
  templateUrl: './create-help-section.component.html',
  styleUrls: ['./create-help-section.component.scss']
})
export class CreateHelpSectionComponent implements OnInit {
  @Output() onSectionCreate = new EventEmitter();

  firstFormGroup = this._formBuilder.group({
    sectionTitle: ['', Validators.required]
  });
  secondFormGroup = this._formBuilder.group({
    link: this._formBuilder.array([
      this._formBuilder.group({
        title: [''],
        url: ['']
      })
    ])
  });
  successMessage = '';

  get linkControl() {
    return this.secondFormGroup.get('link') as UntypedFormArray;
  }

  constructor(private _formBuilder: UntypedFormBuilder, private _contentSvc: ContentService, private _toastrSvc: ToastrService) { }

  ngOnInit(): void {
  }

  createSection() {
    this._contentSvc.updateTrainingLink({
      ...this.firstFormGroup.value,
      ...this.secondFormGroup.value
    }).subscribe((result: any) => {
      if(result.data.value) {
        this.successMessage = 'The new section is successfully added';
        this.onSectionCreate.emit();
      }
      else {
        this.successMessage = 'The new section addition failed';
        this._toastrSvc.error(generic.somethingWentWrong);
      }
    });
  }

  addLink() {
    this.linkControl.push(this._formBuilder.group({
      title: [''],
      url: ['']
    }));
  }
}
