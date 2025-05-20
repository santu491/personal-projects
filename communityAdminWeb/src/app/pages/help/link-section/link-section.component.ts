import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TrainingLink } from 'src/app/core/models';
import Swal from 'sweetalert2';
import { ContentService } from '../../content/content.service';
import { ToastrService } from 'ngx-toastr';
import { MODAL_STATE, generic, roles } from 'src/app/core/constants';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'link-section',
  templateUrl: './link-section.component.html',
  styleUrls: ['./link-section.component.scss']
})
export class LinkSectionComponent implements OnInit {
  @Input() section!: TrainingLink;
  @Output() onSectionEdit = new EventEmitter();

  linkModal = MODAL_STATE.hide;
  linkForm!: UntypedFormGroup;
  // Link Edit recognition parameters
  linkEdit = false;
  linkIndex = -1;
  public isAdmin: boolean = localStorage.getItem('role') === roles[0].role;

  constructor(private _contentSvc: ContentService, private _toastr: ToastrService, private _formBuilder: UntypedFormBuilder) {
    this.linkForm = this._formBuilder.group({
      title: ['', Validators.required],
      url: ['', Validators.required]
    })
   }

  ngOnInit(): void {
  }

  async editSectionTitle() {
    const { value: title } = await Swal.fire({
      title: 'Enter Section Title',
      input: 'text',
      inputLabel: 'Section Title',
      inputValue: this.section.sectionTitle,
      showCancelButton: true,
      inputValidator: (value) => {
        return !value ? 'Section Title cannot be empty' : null;
      }
    });
    
    if (title && this.section.sectionTitle.trim() !== title.trim()) {
      this.updateSection({
        ...this.section,
        sectionTitle: title.trim()
      });
    }
  }

  updateSection(data: TrainingLink) {
    this._contentSvc.updateTrainingLink(data).subscribe((result: any) => {
      if(result.data.value) {
        this.onSectionEdit.emit();
      }
      else {
        this._toastr.error(generic.somethingWentWrong);
      }
    });
  }

  onCloseModal() {
    this.linkModal = MODAL_STATE.hide;
    this.linkIndex = -1;
  }

  showModal() {
    this.linkModal = MODAL_STATE.show;
  }

  manageLink() {
    if(this.linkForm.valid) {
      if(this.linkEdit) {
        this.section.link[this.linkIndex] = this.linkForm.value;
      }
      else {
        this.section.link.push(this.linkForm.value);
      }
      this.updateSection(this.section);
      this.onCloseModal();
    }
  }

  addNewLink() {
    this.linkForm.reset();
    this.linkEdit = false;
    this.showModal();
  }

  editLink(index: number) {
    this.linkEdit = true;
    this.linkIndex = index;
    this.linkForm.setValue(this.section.link[index]);
    this.showModal();
  }
}
