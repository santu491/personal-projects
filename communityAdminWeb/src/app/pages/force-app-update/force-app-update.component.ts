import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { generic } from "src/app/core/constants";
import { forceAppUpdateModule } from "src/app/core/defines";
import {
  AppVersionPayload,
  AppVersionResponse,
} from "src/app/core/models/appVersion";
import { ForceAppUpdateService } from "./force-app-update.service";
@Component({
  selector: "app-force-app-update",
  templateUrl: "./force-app-update.component.html",
  styleUrls: ["./force-app-update.component.scss"],
})
export class ForceAppUpdateComponent implements OnInit {
  public fau = forceAppUpdateModule;
  constructor(
    private _toastrService: ToastrService,
    private _fauService: ForceAppUpdateService,
    private formBuilder: UntypedFormBuilder
  ) {}
  public appVersionRes!: AppVersionResponse;
  public fauForm!: UntypedFormGroup;

  getAppVersion() {
    this._fauService.getAppVersion().subscribe(
      (data: any) => {
        this.appVersionRes = data?.data?.value ?? {};

        if (this.appVersionRes) {
          if (
            this.appVersionRes?.imageFilter === undefined ||
            this.appVersionRes?.imageFilter === null
          ) {
            this.appVersionRes.imageFilter = true;
          }

          this.fauForm.controls["android"].setValue(
            this.appVersionRes?.android ?? ""
          );
          this.fauForm.controls["ios"].setValue(this.appVersionRes?.ios ?? "");
          this.fauForm.controls["tou"].setValue(this.appVersionRes?.tou ?? "");
          this.fauForm.controls["public"].setValue(
            this.appVersionRes?.content?.public ?? ""
          );
          this.fauForm.controls["generic"].setValue(
            this.appVersionRes?.content?.generic ?? ""
          );
          this.fauForm.controls["helpfulInfo"].setValue(
            this.appVersionRes?.content?.helpfulInfo ?? ""
          );
          this.fauForm.controls["deepLink"].setValue(
            this.appVersionRes?.content?.deepLink ?? ""
          );
          this.fauForm.controls["wordList"].setValue(
            this.appVersionRes?.content?.wordList ?? ""
          );
          this.fauForm.controls["prompts"].setValue(
            this.appVersionRes?.content?.prompts ?? ""
          );
          this.fauForm.controls["pushNotification"].setValue(
            this.appVersionRes?.content?.pushNotification ?? ""
          );
          this.fauForm.controls["demoUserAccess"].setValue(
            this.appVersionRes?.demoUserAccess ?? false
          );
          this.fauForm.controls["imageFilter"].setValue(
            this.appVersionRes?.imageFilter
          );
          this.fauForm.controls['apiVersion'].setValue(
            this.appVersionRes?.apiVersion ?? ""
          )
        }

        this.onFormChange();
      },
      (_error: any) => {
        this._toastrService.error(generic.errorMessage);
      }
    );
  }

  onBlurForm(
    event: any,
    type:
      | "android"
      | "ios"
      | "public"
      | "generic"
      | "helpfulInfo"
      | "deepLink"
      | "wordList"
      | "pushNotification"
      | "prompts"
      | "tou"
      | "apiVersion"
  ) {
    this.fauForm.controls[type].setValue(event.target.value.trim());
    this.onFormChange();
  }

  onTextChange = (
    _event: any,
    _inputType:
      | "android"
      | "ios"
      | "public"
      | "generic"
      | "helpfulInfo"
      | "deepLink"
      | "wordList"
      | "pushNotification"
      | "prompts"
      | "tou"
      | "apiVersion"
  ) => {
    this.onFormChange();
  };

  onFormChange() {
    if (
      this.fauForm.controls["android"].value.length > 0 &&
      this.fauForm.controls["ios"].value.length > 0 &&
      this.fauForm.controls["public"].value.length > 0 &&
      this.fauForm.controls["generic"].value.length > 0 &&
      this.fauForm.controls["helpfulInfo"].value.length > 0 &&
      this.fauForm.controls["deepLink"].value.length > 0 &&
      this.fauForm.controls["wordList"].value.length > 0 &&
      this.fauForm.controls["prompts"].value.length > 0 &&
      this.fauForm.controls["pushNotification"].value.length > 0 &&
      this.fauForm.controls["tou"].value.length > 0 &&
      this.fauForm.controls["demoUserAccess"] &&
      this.fauForm.controls["imageFilter"] &&
      this.fauForm.controls["apiVersion"].value.length > 0
    ) {
      return false;
    } else return true;
  }

  get form() {
    return this.fauForm.controls;
  }

  onUpdateAppVersion() {
    const appVersionPayload: AppVersionPayload = {
      android: this.form.android.value,
      ios: this.form.ios.value,
      content: {
        public: this.form.public.value,
        generic: this.form.generic.value,
        helpfulInfo: this.form.helpfulInfo.value,
        prompts: this.form.prompts.value,
        deepLink: this.form.deepLink.value,
        wordList: this.form.wordList.value,
        pushNotification: this.form.pushNotification.value
      },
      tou: this.form.tou.value,
      demoUserAccess: this.form.demoUserAccess.value,
      imageFilter: this.form.imageFilter.value,
      apiVersion: this.form.apiVersion.value

    };

    this._fauService.updateAppVersion(appVersionPayload).subscribe(
      (res: any) => {
        res?.data?.isSuccess
          ? this._toastrService.success(forceAppUpdateModule.successMsg)
          : this._toastrService.error(generic.errorMessage);
      },
      (_error: any) => {
        this._toastrService.error(generic.errorMessage);
      }
    );
  }

  onToggle(event: any) {
    this.appVersionRes.demoUserAccess = event.checked;
    this.fauForm.controls["demoUserAccess"].setValue(event.checked);
    this.onFormChange();
  }

  onToggleImageFilter(event: any) {
    this.appVersionRes.imageFilter = event.checked;
    this.fauForm.controls["imageFilter"].setValue(event.checked);
    this.onFormChange();
  }

  ngOnInit(): void {
    this.fauForm = this.formBuilder.group({
      android: [""],
      ios: [""],
      public: [""],
      generic: [""],
      helpfulInfo: [""],
      deepLink: [""],
      wordList: [""],
      prompts: [""],
      tou: [""],
      demoUserAccess: [false],
      imageFilter: [true],
      pushNotification: [""],
      apiVersion: [""]
    });
    this.getAppVersion();
  }
}
