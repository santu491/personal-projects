import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { generic, partnerTypes } from 'src/app/core/constants';
import { PartnerRequest, Partners } from 'src/app/core/models/partners';
import { PartnersService } from '../partners.service';

@Component({
  selector: 'add-partner-modal',
  templateUrl: './add-partner-modal.component.html',
  styleUrls: ['./add-partner-modal.component.scss']
})
export class AddPartnerModalComponent implements OnInit {
  @Input() displayModal = false;
  @Input() partnerData!: Partners | null;
  @Output() onClose = new EventEmitter();
  @Output() onAdd = new EventEmitter();
  addPartner!: UntypedFormGroup;
  brandLogo: string | null = null;
  articleLogo!: string | null;
  partnerTypes = partnerTypes;

  editId!: string | null;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private partnerService: PartnersService,
    private toastrService: ToastrService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    if (this.partnerData) {
      this.addPartner.setValue({
        title: this.partnerData.title,
        active: this.partnerData.active,
        type: this.partnerData?.type ?? ''
      });
      this.brandLogo = this.partnerData.logoImage;
      this.articleLogo =
        this.partnerData?.articleImage === undefined
          ? null
          : this.partnerData?.articleImage;
      this.editId = this.partnerData.id;
    } else {
      this.createForm();
      this.editId = null;
    }
  }

  createForm() {
    this.addPartner = this.formBuilder.group({
      title: ['', Validators.required],
      active: [false],
      type: ['', Validators.required]
    });
  }

  closeModal() {
    this.onClose.emit();
  }

  onSubmit() {
    if (this.isFormValid()) {
      let addData!: PartnerRequest;
      addData = {
        ...this.addPartner.value,
        logoImage: this.brandLogo,
        articleImage: this.articleLogo ?? null
      };

      this.partnerService.addPartner(addData).subscribe((result: any) => {
        this.onAdd.emit();
        this.toastrService.success('Partner Added!');
      });
    }
  }

  updatePartner() {
    if (this.isFormValid()) {
      let addData!: PartnerRequest;

      addData = {
        ...this.addPartner.value,
        logoImage: this.brandLogo,
        articleImage: this.articleLogo ?? null
      };

      if (this.editId) {
        this.partnerService
          .editPartner(this.editId, addData)
          .subscribe((result: any) => {
            this.onAdd.emit();
            this.toastrService.success('Partner Updated!');
          });
      } else {
        this.toastrService.error(generic.errorMessage);
        this.onAdd.emit();
      }
    }
  }

  handleImage(image: string | null, isArticle: boolean) {
    if(isArticle) {
      this.articleLogo = image;
    }
    else {
      this.brandLogo = image;
    }
  }

  isFormValid() {
    return this.addPartner.valid && !!this.brandLogo;
  }
}
