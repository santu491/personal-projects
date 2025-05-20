import { NgxMatDatetimePicker } from '@angular-material-components/datetime-picker';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatSelectChange } from '@angular/material/select';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { generic, roles } from 'src/app/core/constants';
import { schedulePNModule } from 'src/app/core/defines';
import {
  Community,
  DeepLinkData,
  EditPNResult,
  PnAudienceType,
  SchedulePNPayload,
  TargetAudience
} from 'src/app/core/models';
import { getISOTime } from 'src/app/core/utils';
import { DraftContentService } from '../draft-content/draft-content.service';
import { SchedulePnService } from './schedule-pn.service';
@Component({
  selector: 'app-schedule-pn',
  templateUrl: './schedule-pn.component.html',
  styleUrls: ['./schedule-pn.component.scss']
})
export class SchedulePnComponent implements OnInit {
  @Input() editData!: any;
  @Output() editResult = new EventEmitter<EditPNResult>();
  @ViewChild('picker') picker!: NgxMatDatetimePicker<Date>;
  private myCommunities = localStorage.getItem('communities');
  public roleList: any = roles;
  public isAdvocate =
    localStorage.getItem('role') === this.roleList[1].role ?? false;

  public nonCommunityUsersDisable: boolean = false;
  public targetCommunitiesDisable: boolean = false;
  public showDatePickerErr: boolean = false;
  public bannedUsersDisabled: boolean = false;
  public usersWithNoStoryDisabled: boolean = false;
  public usersWithDraftStoryDisabled: boolean = false;
  public usersWithNoRecentLoginDisabled: boolean = false;
  public numberOfDays = [30, 60, 90, 120, 365];
  public selectedNumberOfDays = 30;
  public numberOfDaysDisabled = true;
  public isScheduled = false;
  public isEdit = false;

  public schedulePNModule = schedulePNModule;
  public communityList: Array<Community> = [];
  public allCommunitiesId: Array<string> = [];
  private selectedCommunitiesId: Array<any> = [];
  public enTitleCount: any = 0 + ` / ` + schedulePNModule.charCount30;
  public enBodyCount: any = 0 + ` / ` + schedulePNModule.charCount140;
  public schedulePNForm!: UntypedFormGroup;
  public allCommunitiesSelected = false;

  audienceCount = { totalCount: 0, pnActiveUsers: 0 };

  public date: any;
  public disabled: boolean = false;
  public showSpinners: boolean = true;
  public showSeconds: boolean = true;
  public touchUi: boolean = true;
  public hideTime: boolean = false;
  public disableMinute: boolean = false;
  public enableMeridian: boolean = false;
  public minDate: any;
  public maxDate: any;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public color: ThemePalette = 'primary';
  public dateControl = new UntypedFormControl(moment());
  public selectedDateAndTime!: string;
  public selectedCommunityName: string = '';
  public toggleType = PnAudienceType;
  public editDeeplink!: DeepLinkData;

  resetDeeplink = false;

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _draftContentService: DraftContentService,
    private _schedulePnService: SchedulePnService,
    private _toastrService: ToastrService
  ) {}

  setAudienceCount() {
    const payload: TargetAudience = {
      communities: this.selectedCommunitiesId,
      nonCommunityUsers: this.schedulePNForm.value.nonCommunityUsers,
      bannedUsers: this.schedulePNForm.value.bannedUsers,
      usersWithNoStory: this.schedulePNForm.value.usersWithNoStory,
      usersWithDraftStory: this.schedulePNForm.value.usersWithDraftStory,
      usersWithNoRecentLogin: this.schedulePNForm.value.usersWithNoRecentLogin,
      numberOfLoginDays: this.selectedNumberOfDays,
      allUsers: this.getAllUserValue()
    };

    this._schedulePnService.getAudienceCount(payload).subscribe(
      (response: any) => {
        if (response?.data?.isSuccess) {
          this.audienceCount = response.data?.value ?? {
            totalCount: 0,
            pnActiveUsers: 0
          };
        }
      },
      (_error: any) => {
        this.audienceCount = {
          totalCount: 0,
          pnActiveUsers: 0
        };
      }
    );
  }

  onBlurMethod(event: any, type: 'title' | 'body') {
    this.schedulePNForm.controls[type].setValue(event?.value);
    this.onFormChange();
  }

  onDateSelect(_type: string, event: any) {
    this.selectedDateAndTime = getISOTime(event?.value);
    this.schedulePNForm.controls['sendOn'].setValue(this.selectedDateAndTime);
  }

  onDeepLinkItemSelect(event: any) {
    if(event?.url) {
      this.schedulePNForm.controls.deepLink.setValue({
        label: event.label,
        url: event.url
      });
    }
    else {
      this.schedulePNForm.controls.deepLink.patchValue({
        label: event.label
      });
    }
    this.onFormChange();
  }

  isAudienceSelected() {
    return (
      this.schedulePNForm.controls['bannedUsers']?.value ||
      this.schedulePNForm.controls['nonCommunityUsers']?.value ||
      this.schedulePNForm.controls['usersWithNoStory']?.value ||
      this.schedulePNForm.controls['usersWithDraftStory']?.value ||
      this.schedulePNForm.controls['usersWithNoRecentLogin']?.value ||
      this.schedulePNForm.controls['targetCommunities']?.value?.length > 0 ||
      this.allCommunitiesSelected
    );
  }

  isTimeSet() {
    return (
      !this.isScheduled ||
      this.schedulePNForm.controls['sendOn']?.value?.length > 0
    );
  }

  onFormChange() {
    if (
      this.schedulePNForm.controls['title']?.value?.length > 0 &&
      this.schedulePNForm.controls['body']?.value?.length > 0 &&
      this.schedulePNForm.controls['deepLink']?.value?.url?.length > 0 &&
      this.schedulePNForm.controls['deepLink']?.value?.label?.length > 0 &&
      this.isTimeSet() &&
      (this.isAdvocate
        ? this.schedulePNForm.controls['targetCommunities']?.value?.length >
            0 || this.schedulePNForm.controls['bannedUsers']?.value
        : this.isAudienceSelected())
    ) {
      return false;
    } else return true;
  }

  clearForm() {
    this.schedulePNForm.reset();
    this.schedulePNForm.controls[PnAudienceType.nonCommunityUsers].setValue(
      false
    );
    this.schedulePNForm.controls[PnAudienceType.bannedUsers].setValue(false);
    this.schedulePNForm.controls[PnAudienceType.usersWithNoStory].setValue(
      false
    );
    this.schedulePNForm.controls[PnAudienceType.usersWithDraftStory].setValue(
      false
    );
    this.schedulePNForm.controls[
      PnAudienceType.usersWithNoRecentLogin
    ].setValue(false);

    this.selectedCommunitiesId = [];
    this.allCommunitiesSelected = false;

    this.schedulePNForm.setErrors(null);
    this.enTitleCount = 0 + ` / ` + schedulePNModule.charCount30;
    this.enBodyCount = 0 + ` / ` + schedulePNModule.charCount140;

    this.nonCommunityUsersDisable = false;
    this.targetCommunitiesDisable = false;
    this.usersWithDraftStoryDisabled = false;
    this.usersWithNoStoryDisabled = false;
    this.usersWithNoRecentLoginDisabled = false;
    this.bannedUsersDisabled = false;
    this.selectedNumberOfDays = 30;
    this.audienceCount = {
      totalCount: 0,
      pnActiveUsers: 0
    };
    this.isScheduled = false;
    this.resetDeeplink = true;
    setTimeout(() => (this.resetDeeplink = false), 2000);
  }

  getAllUserValue() {
    return this.schedulePNForm.value.usersWithNoStory ||
      this.schedulePNForm.value.usersWithDraftStory ||
      this.schedulePNForm.value.usersWithNoRecentLogin ||
      this.schedulePNForm.value.nonCommunityUsers
      ? false
      : this.allCommunitiesSelected;
  }

  submitForm() {
    const payload: SchedulePNPayload = this.createPayload();

    this._schedulePnService.schedulePushNotification(payload).subscribe(
      (data: any) => {
        data?.data?.isSuccess
          ? this._toastrService.success(schedulePNModule.successMsg)
          : this._toastrService.error(generic.errorMessage);
        this.clearForm();
      },
      (error: any) => {
        this._toastrService.error(
          error?.error?.data?.errors[0]?.detail || generic.errorMessage
        );
        this.clearForm();
      }
    );
  }

  onToggle(type: PnAudienceType, event: any) {
    this.schedulePNForm.controls[type].setValue(event.checked);
    if (event.checked) {
      switch (type) {
        case PnAudienceType.nonCommunityUsers:
          this.usersWithNoStoryDisabled = true;
          this.usersWithNoRecentLoginDisabled = true;
          this.usersWithDraftStoryDisabled = true;
          break;
        case PnAudienceType.usersWithNoRecentLogin:
          this.usersWithNoStoryDisabled = true;
          this.usersWithDraftStoryDisabled = true;
          this.numberOfDaysDisabled = false;
          this.selectedNumberOfDays = 30;
          this.nonCommunityUsersDisable = true;
          break;
        case PnAudienceType.usersWithDraftStory:
          this.usersWithNoRecentLoginDisabled = true;
          this.nonCommunityUsersDisable = true;
          this.usersWithNoStoryDisabled = true;
          break;
        case PnAudienceType.usersWithNoStory:
          this.usersWithDraftStoryDisabled = true;
          this.usersWithNoRecentLoginDisabled = true;
          this.nonCommunityUsersDisable = true;
          break;
        default:
          break;
      }
    } else {
      switch (type) {
        case PnAudienceType.nonCommunityUsers:
          this.usersWithNoRecentLoginDisabled = false;
          break;
        case PnAudienceType.usersWithNoRecentLogin:
          this.numberOfDaysDisabled = true;
          this.selectedNumberOfDays = 30;
          this.nonCommunityUsersDisable = false;
          break;
        case PnAudienceType.usersWithDraftStory:
          this.usersWithNoStoryDisabled = false;
          break;
        case PnAudienceType.usersWithNoStory:
          this.usersWithDraftStoryDisabled = false;
          break;
        default:
          break;
      }
      this.toggleCommunityAudience();
    }
    this.setAudienceCount();
  }

  get title(): UntypedFormControl {
    return this.schedulePNForm.get('title') as UntypedFormControl;
  }
  get body(): UntypedFormControl {
    return this.schedulePNForm.get('body') as UntypedFormControl;
  }
  get sendOn(): UntypedFormControl {
    return this.schedulePNForm.get('sendOn') as UntypedFormControl;
  }
  get targetCommunities(): UntypedFormControl {
    return this.schedulePNForm.get('targetCommunities') as UntypedFormControl;
  }
  get deepLink(): UntypedFormControl {
    return this.schedulePNForm.get('deepLink') as UntypedFormControl;
  }

  onTextChange = (event: any, inputType: string) => {
    let inputLength = event?.target?.value?.trim().length;
    this.schedulePNForm.controls[inputType].setValue(event?.target?.value);
    if (inputLength >= 0) {
      switch (inputType) {
        case 'title':
          this.enTitleCount =
            inputLength + ` / ` + schedulePNModule.charCount30;
          break;
        case 'body':
          this.enBodyCount =
            inputLength + ` / ` + schedulePNModule.charCount140;
          break;
      }
    }
  };

  onBlurDatePicker(event: any) {
    this.showDatePickerErr = event?.target?.value ? false : true;
  }

  getAllCommunities() {
    this._draftContentService.getAllCommunities().subscribe((data: any) => {
      this.communityList = data?.data?.value ?? [];
      if (this.communityList?.length) {
        if (this.isAdvocate) {
          this.communityList = this.communityList.filter((item) =>
            this.myCommunities?.includes(item.id)
          );
        }
        this.communityList.forEach((item: any) => {
          this.allCommunitiesId.push(item.id);
        });
      }
    });
  }

  toggleCommunityAudience() {
    if (
      this.selectedCommunitiesId.length === 0 &&
      this.allCommunitiesSelected
    ) {
      //All User option
      this.schedulePNForm.controls['usersWithNoStory'].setValue(false);
      this.schedulePNForm.controls['usersWithDraftStory'].setValue(false);
      this.usersWithDraftStoryDisabled = true;
      this.usersWithNoStoryDisabled = true;
      this.nonCommunityUsersDisable = false;
      this.usersWithNoRecentLoginDisabled = false;
    } else if (this.selectedCommunitiesId.length > 0) {
      //Community Selected
      this.schedulePNForm.controls['nonCommunityUsers'].setValue(false);
      this.schedulePNForm.controls['usersWithNoRecentLogin'].setValue(false);
      this.nonCommunityUsersDisable = true;
      this.usersWithNoRecentLoginDisabled = false;
      this.usersWithDraftStoryDisabled = false;
      this.usersWithNoStoryDisabled = false;
    } else {
      this.usersWithNoRecentLoginDisabled = false;
      this.nonCommunityUsersDisable = false;
      this.usersWithDraftStoryDisabled = false;
      this.usersWithNoStoryDisabled = false;
    }
  }

  onCommunitySelect(selection: MatSelectChange) {
    if (selection.value === 0) {
      this.selectedCommunitiesId = [];
      this.allCommunitiesSelected = true;
    } else {
      this.selectedCommunitiesId = [selection.value];
      this.allCommunitiesSelected = false;
    }
    this.toggleCommunityAudience();
    this.setAudienceCount();
  }

  getSendOnValue() {
    let sendOnPayloadValue;
    if (this.isScheduled) {
      sendOnPayloadValue = this.schedulePNForm.value.sendOn;
    } else {
      var date = new Date();
      date.setMinutes(date.getMinutes() + 2);
      sendOnPayloadValue = date.toISOString();
    }
    return sendOnPayloadValue;
  }

  //Create payload
  createPayload(isEdit?: boolean) {
    const payload: SchedulePNPayload = {
      title: this.schedulePNForm.value.title,
      body: this.schedulePNForm.value.body,
      sendOn: this.getSendOnValue(),
      communities: this.selectedCommunitiesId,
      nonCommunityUsers: this.schedulePNForm.value.nonCommunityUsers ?? false,
      allUsers: this.getAllUserValue(),
      bannedUsers: this.schedulePNForm.value.bannedUsers ?? false,
      deepLink: this.schedulePNForm.value.deepLink,
      usersWithNoStory: this.schedulePNForm.value.usersWithNoStory ?? false,
      usersWithDraftStory:
        this.schedulePNForm.value.usersWithDraftStory ?? false,
      usersWithNoRecentLogin:
        this.schedulePNForm.value.usersWithNoRecentLogin ?? false,
      numberOfLoginDays: this.selectedNumberOfDays,
      isScheduled: this.isScheduled
    };

    if (isEdit) {
      payload.id = this.editData.id;
    }
    console.log('Payload', payload);
    return payload;
    
  }

  submitEditForm() {
    const payload: SchedulePNPayload = this.createPayload(true);

    this._schedulePnService.editPushNotification(payload).subscribe(
      (result: any) => {
        result?.data?.isSuccess
          ? this._toastrService.success(schedulePNModule.successMsg)
          : this._toastrService.error(generic.errorMessage);
        this.editResult.emit({ isSuccess: result?.data?.isSuccess });
      },
      (error: any) => {
        this._toastrService.error(
          error?.error?.data?.errors[0]?.detail || generic.errorMessage
        );
        this.editResult.emit({ isSuccess: false });
      }
    );
  }

  checkCheckBoxvalue(event: any) {
    this.isScheduled = event.checked;
    if (!this.isScheduled) {
      this.sendOn.reset();
    }
  }

  ngOnChanges(): void {
    if (this.editData) {
      this.clearForm();
      this.isScheduled = this.editData.isScheduled;
      this.schedulePNForm.patchValue({
        title: this.editData.title,
        body: this.editData.body,
        bannedUsers: this.editData.bannedUsers,
        label: this.editData.deepLink.label,
        sendOn: this.editData.sendOn
      });
      let pnAudience: PnAudienceType = PnAudienceType.allUsers;
      if (this.editData.allUsers) {
        pnAudience = PnAudienceType.allUsers;
      }
      if (this.editData.usersWithNoStory) {
        pnAudience = PnAudienceType.usersWithNoStory;
      }
      if (this.editData.usersWithDraftStory) {
        pnAudience = PnAudienceType.usersWithDraftStory;
      }
      if (this.editData.usersWithNoRecentLogin) {
        pnAudience = PnAudienceType.usersWithNoRecentLogin;
      }
      if (this.editData.nonCommunityUsers) {
        pnAudience = PnAudienceType.nonCommunityUsers;
      }
      this.selectedNumberOfDays = this.editData.numberOfLoginDays;
      if (this.editData.communities && this.editData.communities.length === 0) {
        this.schedulePNForm.controls.targetCommunities.setValue(0);
        this.allCommunitiesSelected = true;
      } else {
        this.schedulePNForm.controls.targetCommunities.patchValue(
          this.editData.communities[0]
        );
        this.selectedCommunitiesId = this.editData.communities;
      }
      this.toggleCommunityAudience();
      this.onToggle(pnAudience, { checked: true });
      this.schedulePNForm.controls.deepLink.setValue({
        label: this.editData.deepLink.label,
        url: this.editData.deepLink.url
      });
      this.editDeeplink = {
        en: this.editData.deepLink.label,
        spanishRequired: false
      };
      this.isEdit = true;
    }
  }

  ngOnInit(): void {
    this.getAllCommunities();
    this.date = moment();
    this.minDate = moment().toISOString();

    this.schedulePNForm = this._formBuilder.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
      sendOn: ['', Validators.required],
      targetCommunities: [''],
      nonCommunityUsers: false,
      allUsers: false,
      bannedUsers: false,
      deepLink: this._formBuilder.group({
        label: [''],
        url: ['']
      }),
      isScheduled: false,
      usersWithNoStory: false,
      usersWithDraftStory: false,
      usersWithNoRecentLogin: false,
      numberOfLoginDays: 30
    });
  }
}
