import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { adminModule } from 'src/app/core/defines';
import { Community, DeepLinkData } from 'src/app/core/models';
import { Templates } from 'src/app/core/models/notification';
import { DraftContentService } from '../../draft-content/draft-content.service';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.scss']
})
export class TemplateFormComponent implements OnInit {
  template!: Templates;
  public communityList: Array<Community> = [];
  public deeplinkLabel!: DeepLinkData;
  public isSpanish: boolean = false;
  public adminModule = adminModule;
  public isInvlidInput: boolean = false;
  public pnTitleLimit = 40;
  public pnBodyLimit = 140;

  @Output() cancelTemplate = new EventEmitter();
  @Output() saveTemplate = new EventEmitter<Templates>();
  @Input() editData: Templates | undefined;

  constructor(private _draftContentService: DraftContentService) {}

  ngOnInit(): void {
    this.initData();
    this.getAllCommunities();
    this.deeplinkLabel = {
      en: '',
      spanishRequired: this.isSpanish
    };
  }

  ngOnChanges() {
    this.initData();
    this.isInvlidInput = this.isInvalid(this.template);
  }

  initData() {
    if (this.editData) {
      this.template = this.editData;
    }
  }

  onSave() {
    this.saveTemplate.emit(this.template);
    this.initData();
  }

  onCancel() {
    this.cancelTemplate.emit();
  }

  getAllCommunities() {
    this._draftContentService.getAllCommunities().subscribe((data: any) => {
      this.communityList = data?.data?.value ?? [];
    });
  }

  isInvalid(tempData: Templates) {
    return !tempData.body && !tempData.title && !tempData.activityText
      ? true
      : false;
  }

  // DeepLink Item Select
  onDeepLinkItemSelect(event: any) {
    if (event?.url) {
      this.template.deepLink = {
        label: event.label,
        url: event.url,
        copyright: event?.copyright ?? '',
        iconType: event?.iconType ?? '',
        brandLogo: event?.brandLogo ?? ''
      };
    }
  }
}
