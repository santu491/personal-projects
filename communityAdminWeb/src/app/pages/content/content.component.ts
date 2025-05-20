import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { generic } from 'src/app/core/constants';
import { contentModule } from 'src/app/core/defines';
import { ContentService } from './content.service';
@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  @ViewChild('fileSelected') fileInput!: ElementRef;
  public display: string = 'none';
  public contentForm!: UntypedFormGroup;
  public contentLabels = contentModule;
  public contentArr = contentModule.contentArray;

  constructor(
    private _toastrService: ToastrService,
    private _contentService: ContentService,
    private formBuilder: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.contentForm = this.formBuilder.group({
      contentType: [''],
      language: [''],
      version: [''],
      targetFile: ['']
    });
    this.getContentOptions();
  }

  getContentOptions() {
    this._contentService
      .getContentOptions('contentType')
      .subscribe((data: any) => {
        console.log('data....', data);
        if (!!data?.data?.value) {
          const findIndex = this.contentArr.findIndex(
            (item) => item.key === 'contentType'
          );
          if (findIndex > -1) {
            this.contentArr[findIndex].list = data?.data?.value ?? [];
          }
        }
      });
  }

  onSelect(type: string) {
    if (
      type !== 'version' &&
      !!this.contentForm.controls.contentType.value &&
      !!this.contentForm.controls.language.value
    ) {
      this.contentForm.controls.version.reset();
      this._contentService
        .getContentVesrions(
          this.contentForm.controls.contentType.value,
          this.contentForm.controls.language.value
        )
        .subscribe((data: any) => {
          if (!!data?.data?.value) {
            const findIndex = this.contentArr.findIndex(
              (item) => item.key === 'version'
            );
            if (findIndex > -1) {
              this.contentArr[findIndex].list = data?.data?.value ?? [];
            }
          }
        });
    }
  }

  uploadContent() {
    const file = this.fileInput.nativeElement.files[0];
    const formData = new FormData();
    formData.append('file', file);
    this._contentService
      .uploadContent(
        this.contentForm.value.language,
        this.contentForm.value.contentType,
        formData
      )
      .subscribe(
        (res: any) => {
          if (res?.data.isSuccess) {
            this._toastrService.success(this.contentLabels.contentUploaded);
            this.clearForm();
          }
        },
        () => {
          this._toastrService.error(generic.pleaseTryAgain);
        }
      );
  }

  openModal() {
    this.display = 'block';
    this.clearForm();
  }

  onCloseModal() {
    this.display = 'none';
    this.clearForm();
  }

  downloadContent() {
    this._contentService
      .getContent(
        this.contentForm.value.language,
        this.contentForm.value.version,
        this.contentForm.value.contentType
      )
      .subscribe(
        (res: any) => {
          if (res?.data?.isSuccess) {
            const response = res?.data?.value;
            const json = JSON.stringify(response?.data);
            const blob = new Blob([json]);
            saveAs(
              blob,
              `content-${response?.contentType}-${response?.language}-${response?.version}.json`
            );
            this.onCloseModal();
          }
        },
        () => {
          this._toastrService.error(this.contentLabels.contentNotFound);
        }
      );
  }

  formIsValid() {
    if (
      this.contentForm.controls.language.value &&
      this.contentForm.controls.version.value &&
      this.contentForm.controls.contentType.value
    )
      return true;
    else return false;
  }

  formValid() {
    if (
      this.contentForm.controls.language.value &&
      this.contentForm.controls.contentType.value
    )
      return true;
    else return false;
  }

  clearForm() {
    this.contentForm.reset();
    this.fileInput.nativeElement.value = '';
    for (let control in this.contentForm.controls) {
      this.contentForm.controls[control].setErrors(null);
    }
  }
}
