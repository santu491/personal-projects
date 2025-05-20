import { Component, OnInit } from '@angular/core';
import { ContentService } from '../content/content.service';
import { CONTENT_TYPE, Language, generic, messages, roles } from 'src/app/core/constants';
import { TrainingLink } from 'src/app/core/models';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
  public showCreateSectionForm = false;
  linkSections: TrainingLink[] = [];
  public isAdmin: boolean = localStorage.getItem('role') === roles[0].role;

  constructor(private _contentSvc: ContentService, private _toastrSvc: ToastrService) { }

  ngOnInit(): void {
    this.getLinkData();
  }

  getLinkData() {
    this._contentSvc.getContentByType(Language.ENGLISH, CONTENT_TYPE.trainingLinks).subscribe(
      (result: any) => {
        this.linkSections = result.data.value?.data?.sections ?? [];
      },
      () => {
        this._toastrSvc.error(generic.somethingWentWrong)
      }
    );
  }

  toggleCreateSection() {
    this.showCreateSectionForm = !this.showCreateSectionForm;
  }

  onSectionCreate() {
    this.getLinkData();
    setTimeout(() => {
      this.toggleCreateSection();
    }, 3000);
  }
}
