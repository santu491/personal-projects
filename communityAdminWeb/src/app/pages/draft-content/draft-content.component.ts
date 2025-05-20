import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ComponentCanDeactivate } from 'src/app/component-can-deactivate';
import { MAX_IMAGE_UPLOAD_SIZE, generic, roles } from 'src/app/core/constants';
import { postsModule } from 'src/app/core/defines';
import {
  DeepLinkData,
  ExistingPosts,
  LinkEvent,
  NewPost,
  PersonaDetails,
  PollData,
  PollOption,
  PostStatus
} from 'src/app/core/models';
import { EditorConfig } from 'src/app/core/rich-text-editor';
import { getISOTime } from 'src/app/core/utils';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { ViewDraftsService } from '../view-drafts/view-drafts.service';
import { DraftContentService } from './draft-content.service';
import { PostPollComponent } from './post-poll/post-poll.component';
@Component({
  selector: 'draft-content',
  templateUrl: './draft-content.component.html',
  styleUrls: ['./draft-content.component.scss']
})
export class DraftContentComponent implements OnInit, ComponentCanDeactivate {
  @ViewChild('imageInput') private myInputVariable!: ElementRef;
  @ViewChild('pollInfo') private pollInfo!: PostPollComponent;
  @Output() onPressCancel = new EventEmitter();
  @Output() onPressDraft = new EventEmitter();
  editorConfig: AngularEditorConfig = new EditorConfig().getConfig();

  private myCommunities = localStorage.getItem('communities');
  private reader: FileReader | undefined;
  private imageTouched: boolean = false;
  private deepLinkChanged: boolean = false;

  public draftId: string = '';
  public postsModule = postsModule;
  public mainHeader: string = postsModule.en.newPost;
  public communityList: any = [];
  public isPublishedAlready: boolean = false;
  public isSpanish: boolean = false;
  public isImageEnabled: boolean = false;
  public isDeepLinkEnabled: boolean = false;
  public isLinkEnabled: boolean = false;
  public isPollEnabled: boolean = false;
  public allCommunitiesId: Array<string> = [];
  public currentAdminRole = localStorage.getItem('role');
  public roleList: any = roles;
  public isAdvocate = this.currentAdminRole === this.roleList[1].role ?? false;
  public personaDetails: any = [];
  public selectedPersona: any = null;
  public titleIsInvalId: boolean = false;
  public bodyIsInvalId: boolean = false;
  public pnTitleIsInvalId: boolean = false;
  public pnBodyIsInvalId: boolean = false;
  public selectedDeeplink!: DeepLinkData;
  public imagePath = '';
  public profileForm!: UntypedFormGroup;
  public deeplinkLabel!: DeepLinkData;
  public isScheduledPostEnabled: boolean = false;

  linkData!: LinkEvent;
  pollData!: PollData | null;

  public date: any;
  public disabled: boolean = false;
  public showSpinners: boolean = true;
  public showSeconds: boolean = false;
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
  public showDatePickerErr: boolean = false;
  public dateControl = new UntypedFormControl(moment());
  public selectedDateAndTime!: string;

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _draftContentService: DraftContentService,
    private _viewDraftService: ViewDraftsService,
    private _router: Router,
    private _toastrService: ToastrService
  ) {}

  // DeepLink Item Select
  onDeepLinkItemSelect(event: any) {
    if (event?.url) {
      this.profileForm.controls.deepLink.setValue({
        label: event.label,
        url: event.url,
        copyright: event?.copyright ?? '',
        iconType: event?.iconType ?? '',
        brandLogo: event?.brandLogo ?? ''
      });
      this.profileForm.controls.deepLink_es.setValue({
        label: event?.label_es || event.label,
        url: event.url,
        copyright: event?.copyright ?? '',
        iconType: event?.iconType ?? '',
        brandLogo: event?.brandLogo ?? ''
      });
    } else {
      this.profileForm.controls.deepLink.patchValue({
        label: event.label
      });
      this.profileForm.controls.deepLink_es.patchValue({
        label: event.label_es
      });
    }
    this.selectedDeeplink = {
      en: event.label,
      es: event.label_es,
      spanishRequired: this.isSpanish
    };

    this.deepLinkChanged = true;
    this.onFormChange();
  }

  canDeactivate(): boolean {
    if (!this.profileForm.dirty) {
      return true;
    } else {
      return confirm(postsModule.unSavedDataAlert);
    }
  }

  initForm() {
    this.profileForm = this._formBuilder.group({
      // English
      en: this._formBuilder.group({
        title: [
          '',
          [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]
        ],
        body: [
          '',
          [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]
        ]
      }),
      link: [null],
      deepLink: this._formBuilder.group({
        label: [''],
        url: [''],
        copyright: [''],
        iconType: [''],
        brandLogo: ['']
      }),
      poll: this._formBuilder.group({
        en: this._formBuilder.group({
          question: [''],
          endsOn: [0],
          options: this._formBuilder.array([])
        }),
        es: this._formBuilder.group({
          question: [''],
          endsOn: [0],
          options: this._formBuilder.array([])
        })
      }),
      // Spanish
      es: this._formBuilder.group({
        title: [''],
        body: ['']
      }),
      link_es: [null],
      deepLink_es: this._formBuilder.group({
        label: [''],
        url: [''],
        copyright: [''],
        iconType: [''],
        brandLogo: ['']
      }),
      persona: ['none'],
      image: [''],
      community: ['', Validators.required],
      isNotify: [true],
      pnDetails: this._formBuilder.group({
        pnTitle: [
          postsModule.pnDetails.title,
          [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]
        ],
        pnBody: [
          postsModule.pnDetails.body,
          [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]
        ]
      }),
      sendOn: ['', Validators.required]
    });
  }

  get enContent() {
    return this.profileForm.get('en') as UntypedFormGroup;
  }
  get esContent() {
    return this.profileForm.get('es') as UntypedFormGroup;
  }
  get community() {
    return this.profileForm.get('community');
  }

  get pnTitle() {
    return this.profileForm.get('pnDetails.pnTitle');
  }

  get pnBody() {
    return this.profileForm.get('pnDetails.pnBody');
  }

  get sendOn(): UntypedFormControl {
    return this.profileForm.get('sendOn') as UntypedFormControl;
  }

  get enOptions() {
    return this.profileForm.get('poll.en.options') as UntypedFormArray;
  }

  get esOptions() {
    return this.profileForm.get('poll.es.options') as UntypedFormArray;
  }

  onSelectImage(e: any, _imageInput: any) {
    if (e.target.files) {
      this.reader = new FileReader();
      if (e.target.files[0]) {
        if (e.target.files[0].size / (1024 * 1024) > MAX_IMAGE_UPLOAD_SIZE) {
          this._toastrService.error(generic.imageSizeErr);
          this.clearImage();
        } else {
          this.reader.readAsDataURL(e.target.files[0]);
          this.reader.onload = (event: any) => {
            this.imagePath = event.target.result;
            this.profileForm.controls.image.setValue(event.target.result);
          };
        }
      }
    }
    this.imageTouched = true;
    this.onFormChange();
  }

  clearImage() {
    if (this.myInputVariable) {
      this.myInputVariable.nativeElement.value = '';
    }
    this.imagePath = '';
    this.profileForm.controls.image.setValue('');
    this.imageTouched = true;
    this.onFormChange();
  }

  onSelectPersona(data: PersonaDetails | null) {
    const tempSelectedPersona = this.selectedPersona;
    this.selectedPersona = data;
    if (data === null) return;
    if (
      tempSelectedPersona?.id !== data?.id ||
      !data.communities.includes(this.profileForm?.value?.community)
    ) {
      this.profileForm.controls.community.setValue(data.communities[0] ?? '');
    }
  }

  isPersonaHasCommunity(item: any) {
    return this.selectedPersona?.communities
      ? !this.selectedPersona?.communities?.includes(item.id)
      : false;
  }

  validOptions(options: PollOption[]) {
    const invalidOptions = options.filter(
      (option) => option.text.trim() === ''
    );
    return invalidOptions.length === 0;
  }

  isValidPollData() {
    const enValidity =
      this.profileForm.value.poll.en.question.trim() !== '' &&
      this.validOptions(this.profileForm.value.poll.en.options);
    const esValidity = this.isSpanish
      ? this.profileForm.value.poll.es.question.trim() !== '' &&
        this.validOptions(this.profileForm.value.poll.es.options)
      : true;
    return enValidity && esValidity;
  }

  saveForm(published: boolean) {
    if (this.isPollEnabled && !this.isValidPollData()) {
      Swal.fire({
        title: this.postsModule?.pollError?.title,
        icon: this.postsModule.pollError.icon as SweetAlertIcon
      });
    } else {
      this.submitForm(published);
    }
  }

  submitForm(published: boolean) {
    let payload: NewPost | ExistingPosts;
    let postId: string;

    payload = {
      communities: [this.profileForm.value.community],
      content: {
        en: {
          // English
          title: this.profileForm.controls.en.value.title,
          body: this.profileForm.controls.en.value.body,
          deepLink:
            this.profileForm.value.deepLink.url !== ''
              ? this.profileForm.value.deepLink
              : null,
          poll:
            this.profileForm.value.poll.en.question !== ''
              ? this.profileForm.value.poll.en
              : null
        },
        es: {
          // Spanish
          title: this.profileForm.controls.es.value.title,
          body: this.profileForm.controls.es.value.body,
          deepLink:
            this.profileForm.value.deepLink_es?.url !== ''
              ? this.profileForm.value.deepLink_es
              : null,
          poll:
            this.profileForm.value.poll.es.question !== ''
              ? this.profileForm.value.poll.es
              : null
        },
        image: this.profileForm.value.image
      },
      published: published,
      isNotify: this.profileForm.value.isNotify
    };

    if (this.isScheduledPostEnabled) {
      payload = {
        ...payload,
        publishOn: this.profileForm.value.sendOn
      };
    }
    // Adding id for Existing Draft
    if (this.draftId) {
      let pair = { id: this.draftId };
      payload = { ...payload, ...pair };
    }

    if (this.selectedPersona && this.isPersonaEnabled()) {
      payload = { ...payload, author: { id: this.selectedPersona.id } };
    }

    if (
      this.profileForm.controls.isNotify.value &&
      this.pnTitle &&
      this.pnBody
    ) {
      payload = {
        ...payload,
        content: {
          ...payload.content,
          pnDetails: {
            title: this.pnTitle.value,
            body: this.pnBody.value?.trim()
          }
        }
      };
    }

    if (this.isLinkEnabled && this.linkData) {
      if (this.linkData?.isImageUploaded) {
        delete this.linkData.imageLink;
      } else {
        delete this.linkData.imageBase64;
      }
      payload.content.link = this.linkData;
    }
    this.cleanContent(payload);

    this._draftContentService.createAdminPost(payload).subscribe(
      (postResponse: any): void => {
        if (postResponse?.data?.isSuccess) {
          postId = postResponse?.data?.value?.id;
          published
            ? this._toastrService.success(postsModule.publishedText)
            : this.isScheduledPostEnabled
            ? this._toastrService.success(postsModule.scheduledSuccess)
            : this._toastrService.success(postsModule.savedAsDraft);
          this.clearImage();
          this.resetForm();
          this.callGetAllCommunities();
          this.isPublishedAlready = false;
          if (postId) {
            this._router.navigate(['/ui/pages/engage/search', postId], {
              queryParams: { published }
            });
          } else {
            this.onPressDraft.emit();
          }
        } else {
          this._toastrService.error(generic.errorMessage);
        }
      },
      (_error: any): void => {
        if (_error?.error?.data?.errors[0]?.errorCode == 400) {
          this.showBadWordContentError(
            postsModule.en.contentError,
            _error?.error?.data?.errors[0]?.title,
            postsModule.en.error as SweetAlertIcon,
            JSON.parse(_error?.error?.data?.errors[0]?.detail)
          );
        }
        if (_error?.error?.data?.errors[0]?.errorCode == 477) {
          this.showKeyWordContentWarning(
            _error?.error?.data?.errors[0]?.title,
            postsModule.en.warning as SweetAlertIcon,
            payload as NewPost,
            JSON.parse(_error?.error?.data?.errors[0]?.detail)
          );
        }
      }
    );
  }

  onCancelEditPost() {
    this.clearImage();
    this.resetForm();
    this.onPressCancel.emit();
  }

  resetForm(): void {
    this.profileForm.reset();
    this.isScheduledPostEnabled = false;
    this.profileForm.controls.sendOn.reset();

    this.mainHeader = postsModule.en.newPost;

    // Clear Post Settings
    this.isImageEnabled = false;
    this.isLinkEnabled = false;
    this.isDeepLinkEnabled = false;
    this.isPollEnabled = false;
  }

  setDataToEditDraft(data: ExistingPosts | any) {
    this.setEnglishContent(data);
    this.setSpanishContent(data);

    if (data?.content?.image) {
      this.isImageEnabled = true;
      this.profileForm.controls.image.setValue(data.content.image);
      this.imagePath = data.content.image;
    }
    if (data?.content?.pnDetails) {
      this.profileForm.controls.pnDetails.setValue({
        pnTitle: data?.content?.pnDetails.title,
        pnBody: data?.content?.pnDetails.body
      });
    }
    //Deeplink Data
    if (
      !!data?.content?.en?.deepLink &&
      data?.content?.en?.deepLink?.label !== ''
    ) {
      this.isDeepLinkEnabled = true;
      this.deeplinkLabel = {
        en: data?.content?.en?.deepLink?.label ?? '',
        es: data?.content?.es?.deepLink?.label ?? '',
        spanishRequired: this.isSpanish
      };
    } else {
      this.isDeepLinkEnabled = false;
    }

    if (!!data?.content?.en?.poll) {
      this.isPollEnabled = true;
      this.pollData = {
        en: data?.content?.en?.poll,
        es: data?.content?.es?.poll,
        isEdit: true,
        isEditAllowed: !(data.published || data.editedAfterPublish)
      };
      this.setPollData(this.pollData);
    } else {
      this.isPollEnabled = false;
      this.pollData = null;
    }

    this.isLinkEnabled = this.checkIfLink(data);
    if (this.isLinkEnabled) {
      this.linkData = data?.content?.link;
    }

    this.profileForm.controls.community.setValue(
      data?.communities[0]?.id || ''
    );
    this.profileForm.controls.isNotify.setValue(data?.isNotify);

    if (data?.status === PostStatus.scheduled && !!data.publishOn) {
      this.isScheduledPostEnabled = true;
      this.profileForm.controls.sendOn.setValue(data.publishOn);
    }

    this.draftId = data?.id ?? '';
    this.mainHeader = data?.id
      ? postsModule.en.editPost
      : postsModule.en.newPost;
    this.isPublishedAlready = data?.published || false;
  }

  setEnglishContent(data: ExistingPosts | any) {
    this.profileForm.controls.en.setValue({
      title: data?.content?.en?.title ?? '',
      body: data?.content?.en?.body ?? ''
    });
    this.profileForm.controls.link.setValue(data?.content?.en?.link ?? '');
    this.profileForm.controls.deepLink.setValue({
      url: data?.content?.en?.deepLink?.url ?? '',
      label: data?.content?.en?.deepLink?.label ?? '',
      copyright: data?.content.en?.deepLink?.copyright ?? '',
      iconType: data?.content.en?.deepLink?.iconType ?? '',
      brandLogo: data?.content.en?.deepLink?.brandLogo ?? ''
    });
  }

  setSpanishContent(data: ExistingPosts | any) {
    if (data?.content?.es?.title && data?.content?.es?.title !== '') {
      this.isSpanish = true;
      this.profileForm.controls.es.setValue({
        title: data?.content?.es?.title ?? '',
        body: data?.content?.es?.body ?? ''
      });
      this.profileForm.controls.link_es.setValue(data?.content?.es?.link ?? '');
      if (data.content.es?.deepLink) {
        this.profileForm.controls.deepLink_es.setValue({
          url: data?.content?.es?.deepLink?.url ?? '',
          label: data?.content?.es?.deepLink?.label ?? '',
          copyright: data?.content.es?.deepLink?.copyright ?? '',
          iconType: data?.content.en?.deepLink?.iconType ?? '',
          brandLogo: data?.content.en?.deepLink?.brandLogo ?? ''
        });
      }
      this.updateLabelsAndFormData();
    }
  }

  checkIfLink(data: ExistingPosts | any): boolean {
    if (data?.content?.link) {
      return true;
    } else return false;
  }

  callGetAllCommunities() {
    this._draftContentService
      .getAllCommunities(true, false)
      .subscribe((data: any) => {
        this.communityList = data?.data?.value ?? [];
        if (this.communityList?.length) {
          if (this.isAdvocate) {
            this.communityList = this.communityList.filter(
              (item: { id: string }) => this.myCommunities?.includes(item.id)
            );
          }
          this.communityList.forEach((item: any) => {
            this.allCommunitiesId.push(item.id);
          });
        }
      });
  }

  callGetPersonaDetails = async () => {
    this._draftContentService.getPersonaDetails().subscribe((response) => {
      this.callGetAllCommunities();
      if (response?.data?.value) {
        this.personaDetails = response?.data?.value;
        let alreadyDraftedData = this._viewDraftService.getDraftData();
        if (alreadyDraftedData) {
          const existedPersona = this.personaDetails?.find(
            (item: PersonaDetails) => alreadyDraftedData?.author?.id === item.id
          );
          if (existedPersona) {
            this.selectedPersona = existedPersona;
            this.profileForm.controls.persona.setValue(existedPersona.id);
          }
        }
      }
    });
  };

  ngOnInit() {
    this.initForm();
    this.date = moment();
    this.minDate = moment().toISOString();
    this.deeplinkLabel = {
      en: '',
      spanishRequired: this.isSpanish
    };
    this.callGetPersonaDetails();
    let alreadyDraftedData = this._viewDraftService.getDraftData();
    if (alreadyDraftedData) {
      this.setDataToEditDraft(alreadyDraftedData);
    }
  }

  showBadWordContentError(
    title: string,
    message: string,
    icon: SweetAlertIcon,
    errorFields: []
  ) {
    this.titleIsInvalId = errorFields.includes('title' as never);
    this.bodyIsInvalId = errorFields.includes('body' as never);
    this.pnBodyIsInvalId = errorFields.includes('pnBody' as never);
    this.pnTitleIsInvalId = errorFields.includes('pnTitle' as never);
    return Swal.fire({
      title: title,
      text: message,
      icon: icon
    });
  }

  showKeyWordContentWarning(
    title: string,
    icon: SweetAlertIcon,
    payload: NewPost,
    errorFields: []
  ) {
    Swal.fire({
      title: title,
      icon: icon,
      showDenyButton: true,
      denyButtonText: `Back`,
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        // Save the Post
        payload.isProfane = true;
        this._draftContentService
          .createAdminPost(payload)
          .subscribe((postResponse: any): void => {
            if (postResponse?.data?.isSuccess) {
              const postId = postResponse?.data?.value?.id;
              if (postId) {
                this.clearImage();
                this.resetForm();
                this.titleIsInvalId =
                  this.bodyIsInvalId =
                  this.pnBodyIsInvalId =
                  this.pnTitleIsInvalId =
                    false;
                if (payload.published) {
                  this._router.navigate(['/ui/pages/engage/search', postId]);
                  this._toastrService.success(postsModule.publishedText);
                } else {
                  this._toastrService.success(postsModule.savedAsDraft);
                }
              } else {
                this.onPressDraft.emit();
              }
            } else {
              this._toastrService.error(generic.errorMessage);
            }
          });
      } else if (result.isDenied) {
        this.titleIsInvalId = errorFields.includes('title' as never);
        this.bodyIsInvalId = errorFields.includes('body' as never);
        this.pnBodyIsInvalId = errorFields.includes('pnBody' as never);
        this.pnTitleIsInvalId = errorFields.includes('pnTitle' as never);
        Swal.fire(postsModule.en.postError, '', 'info');
      }
    });
  }

  isPersonaEnabled = () => {
    return (
      localStorage.getItem('role') === roles[0].role ||
      localStorage.getItem('role') === roles[2].role
    );
  };

  getUserRoleTitle = () => {
    return localStorage.getItem('role') === roles[0].role
      ? roles[0].name
      : roles[2].name;
  };

  ngOnDestroy() {
    // Cleanup Data set by Edit Draft
    this._viewDraftService.setDraftData(undefined);
  }

  // Language Change Event
  onToggleLanguage(event: any) {
    this.isSpanish = event.checked;
    this.updateLabelsAndFormData();
  }

  onToggleImage(event: any) {
    this.isImageEnabled = event.checked;
    if (!this.isImageEnabled) {
      this.clearImage();
    }
  }

  onToggleLink(event: any) {
    this.isLinkEnabled = event.checked;
    if (!this.isLinkEnabled) {
      this.profileForm.controls['link'].reset();
      this.profileForm.controls['link_es'].reset();
    }
  }

  onToggleDeepLink(event: any) {
    this.isDeepLinkEnabled = event.checked;
    if (!this.isDeepLinkEnabled) {
      this.profileForm.controls['deepLink'].setValue({
        url: '',
        label: '',
        copyright: '',
        iconType: '',
        brandLogo: ''
      });
      this.profileForm.controls['deepLink_es'].setValue({
        url: '',
        label: '',
        copyright: '',
        iconType: '',
        brandLogo: ''
      });
    }
  }

  onToggleAddPoll(event: MatSlideToggleChange) {
    this.isPollEnabled = event.checked;
    if (!this.isPollEnabled) {
      this.pollData = null;
      while (this.enOptions.length !== 0) {
        this.enOptions.removeAt(0);
        this.esOptions.removeAt(0);
      }

      this.profileForm.controls['poll'].setValue({
        en: {
          question: '',
          endsOn: 0,
          options: []
        },
        es: {
          question: '',
          endsOn: 0,
          options: []
        }
      });
    }
  }

  onToggleScheduledPost(event: any) {
    this.isScheduledPostEnabled = event.checked;
    if (!this.isScheduledPostEnabled) {
      this.sendOn.reset();
    }
  }

  onDateSelect(_type: string, event: any) {
    this.selectedDateAndTime = getISOTime(event?.value);
    this.profileForm.controls['sendOn'].setValue(this.selectedDateAndTime);
  }

  onBlurDatePicker(event: any) {
    this.showDatePickerErr = event?.target?.value ? false : true;
  }

  // Update Form Labels
  updateLabelsAndFormData() {
    if (this.isSpanish) {
      this.profileForm.controls['deepLink'].value?.label &&
      this.profileForm.controls['deepLink'].value?.url
        ? this.profileForm.controls.deepLink_es.setValue({
            label:
              this.selectedDeeplink?.es ??
              this.profileForm.controls['deepLink_es'].value?.label,
            url: this.profileForm.controls['deepLink'].value?.url,
            copyright: this.profileForm.controls['deepLink'].value.copyright,
            iconType: this.profileForm.controls['deepLink'].value.iconType,
            brandLogo: this.profileForm.controls['deepLink'].value.brandLogo
          })
        : this.profileForm.controls.deepLink_es.reset();
    } else {
      this.profileForm.controls['title_es'].reset();
      this.profileForm.controls['body_es'].reset();
      this.profileForm.controls['link_es'].reset();
      this.profileForm.controls['deepLink_es'].reset();
    }
  }

  // Check if Form Not Valid
  checkIfNotValid() {
    if (
      !(
        this.profileForm.controls.en.value.title &&
        this.profileForm.controls.en.value.body &&
        this.profileForm.controls.community.value
      )
    ) {
      return true;
    }

    const isSpanishValid = this.isSpanish
      ? !!this.profileForm.controls.es.value.title &&
        !!this.profileForm.controls.es.value.body
      : true;

    if (!isSpanishValid) {
      return true;
    }

    const isPnValid = this.profileForm.controls.isNotify.value
      ? !!this.pnTitle?.value && !!this.pnBody?.value
      : true;

    if (!isPnValid) {
      return true;
    }

    if (this.isLinkEnabled) {
      if (!this.linkData) {
        return true;
      }

      const isImageAdded = this.linkData.isImageUploaded
        ? this.linkData?.imageBase64 != undefined
        : this.linkData?.imageLink != undefined;
      if (
        this.linkData.en.title == '' ||
        this.linkData.en.url == '' ||
        !isImageAdded
      ) {
        return true;
      }
    }

    return false;
  }

  checkIfScheduleNotEnabled() {
    if (this.checkIfNotValid()) {
      return true;
    }

    return (
      !this.isScheduledPostEnabled || !this.profileForm?.controls?.sendOn?.value
    );
  }

  // Disable Publish based on Form Value Changes
  onFormChange() {
    return !(
      this.profileForm.controls.en.value.title.dirty ||
      this.profileForm.controls.en.value.body.dirty ||
      this.profileForm.controls.link.dirty ||
      this.profileForm.controls.es.value.title.dirty ||
      this.profileForm.controls.es.value.body.dirty ||
      this.profileForm.controls.link_es.dirty ||
      this.imageTouched ||
      this.deepLinkChanged
    );
  }

  getLinkData(event: LinkEvent) {
    this.linkData = event;
  }

  setPollData(data: PollData | null) {
    if (data) {
      this._toastrService.info('Poll Added to Post! Successfully!');
      // create form value for options
      if (data.en.options.length > this.enOptions.length) {
        const counter = data.en.options.length - this.enOptions.length;
        Array(counter)
          .fill(null)
          .forEach(() => this.addOption());
      }
      if(data.en.options?.length > 0 && data.en.options[0].hasOwnProperty('result')) {
        data.en.options.forEach((opt) => delete opt['result']);
        data.es.options.forEach(opt => delete opt['result']);
      }
      this.profileForm.controls['poll'].setValue({
        en: { ...data.en },
        es: { ...data.es }
      });
    }
  }

  addOption() {
    this.enOptions?.push(
      this._formBuilder.group({
        id: [''],
        text: ['']
      })
    );
    this.esOptions?.push(
      this._formBuilder.group({
        id: [''],
        text: ['']
      })
    );
  }

  cleanContent(payload: NewPost) {
    const newLine = /&#160;|&nbsp;|&#10;/gi;
    payload.content.en.body = payload?.content?.en?.body?.replaceAll(
      newLine,
      ' '
    );
    payload.content.es.body = payload?.content?.es?.body?.replaceAll(
      newLine,
      ' '
    );
  }
}
