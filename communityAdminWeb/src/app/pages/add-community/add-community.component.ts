import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommunityService } from 'src/app/components/community-filter/community.service';
import { infoText } from 'src/app/core/constants';

@Component({
  selector: 'app-add-community',
  templateUrl: './add-community.component.html',
  styleUrls: ['./add-community.component.scss'],
})
export class AddCommunityComponent implements OnInit {
  addCommunity!: UntypedFormGroup;
  isEdit = false;
  selectedId = '';
  imagePath: string = '';
  infoText: string = infoText;
  imageTouched: boolean = false;
  image: string = '';
  communityImage: string | undefined = '';
  communityName: string = 'Add Community';

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private communityService: CommunityService,
    private router: Router,
    private _toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    if (this.communityService?.selectedCommunity) {
      const selectedCommunity = this.communityService?.selectedCommunity;
      this.communityName = selectedCommunity.displayName.en;
      this.addCommunity = this._formBuilder.group({
        englishTitle: [selectedCommunity.displayName.en],
        spanishTitle: [selectedCommunity.displayName.es],
        communityType: [selectedCommunity.type],
        isNew: [selectedCommunity.isNew ?? false],
        isActive: [selectedCommunity.active ?? true],
      });
      this.communityImage = selectedCommunity.image;
      this.selectedId = selectedCommunity.id;
      this.communityService.selectedCommunity = undefined;
      this.isEdit = true;
    } else {
      this.isEdit = false;
      this.selectedId = '';
      this.addCommunity = this._formBuilder.group({
        englishTitle: [''],
        spanishTitle: [''],
        communityType: [''],
        isNew: [false],
        isActive: [false],
      });
    }
  }

  onSubmit() {
    const payload = {
      displayName: {
        en: this.addCommunity.controls['englishTitle'].value,
        es: this.addCommunity.controls['spanishTitle'].value,
      },
      title: this.addCommunity.controls['englishTitle'].value,
      category: this.addCommunity.controls['englishTitle'].value,
      isNew: this.addCommunity.controls['isNew'].value,
      type: this.addCommunity.controls['communityType'].value,
      active: this.addCommunity.controls['isActive'].value,
      image: this.image ?? null
    };
    this.createEditCommunity(payload);
  }

  onEdit() {
    const payload = {
      displayName: {
        en: this.addCommunity.controls['englishTitle'].value,
        es: this.addCommunity.controls['spanishTitle'].value,
      },
      title: this.addCommunity.controls['englishTitle'].value,
      category: this.addCommunity.controls['englishTitle'].value,
      isNew: this.addCommunity.controls['isNew'].value,
      type: this.addCommunity.controls['communityType'].value,
      active: this.addCommunity.controls['isActive'].value,
      image: this.image ?? null,
      id: this.selectedId,
    };
    this.createEditCommunity(payload);
  }

  onBlur(event: any, type: 'englishTitle' | 'spanishTitle') {
    this.addCommunity.controls[type].setValue(event.target.value.trim());
  }

  backToCommunity() {
    this.router.navigate(["/ui/pages/admin/community"]);
  }

  createEditCommunity(payload: any) {
    this.communityService.upsertCommunity(payload).subscribe(
      (result: any) => {
        if(result?.data?.isSuccess) {
          this.image = payload.image;
          this._toastrService.success('Community Created');
          this.backToCommunity();
        }
      }
    )
  }

  setImage(imageData: any) {
    this.image = imageData;
  }
}
