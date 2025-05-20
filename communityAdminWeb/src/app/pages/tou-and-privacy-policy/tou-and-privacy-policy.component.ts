import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Language, generic, messages } from 'src/app/core/constants';
import { TouMassEmailInfo } from 'src/app/core/models/touAndPrivacyPolicy';
import { ContentService } from '../content/content.service';
import { TouAndPrivacyPolicyService } from './tou-and-privacy-policy.service';

@Component({
  selector: 'app-tou-and-privacy-policy',
  templateUrl: './tou-and-privacy-policy.component.html',
  styleUrls: ['./tou-and-privacy-policy.component.scss']
})
export class TouAndPrivacyPolicyComponent implements OnInit {
  public emailInfo: TouMassEmailInfo | any = {};
  public isEmailTriggered: boolean = false;
  public emailTemplate!: SafeHtml;
  constructor(
    private _touService: TouAndPrivacyPolicyService,
    private _toasterService: ToastrService,
    private spinner: NgxSpinnerService,
    private contentService: ContentService,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.getMassEmailInfo();
    this.getEmailContent();
  }

  getEmailContent(): void {
    this.contentService
      .getTouContent(Language.ENGLISH)
      .subscribe((result: any) => {
        if (result.data.isSuccess) {
          this.emailTemplate = this.domSanitizer.bypassSecurityTrustHtml(
            result.data.value.data.privacyPolicy.emailTemplate
          );
        }
      });
  }

  getMassEmailInfo() {
    this._touService.getMassEmailInfo().subscribe(
      (response) => {
        if (response?.data?.isSuccess && response?.data?.value)
          this.emailInfo = response?.data?.value;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  sendMassEmail() {
    this.isEmailTriggered = true;
    this._touService.triggerEmail().subscribe(
      (response) => {
        this.isEmailTriggered = false;
        if (response?.data?.isSuccess) {
          this._toasterService.success(messages.emailTriggered);
          this.getMassEmailInfo();
        }
      },
      (error) => {
        this.isEmailTriggered = false;
        this._toasterService.error(generic.errorMessage);
        console.log(error);
      }
    );
    this.spinner.hide();
  }
}
