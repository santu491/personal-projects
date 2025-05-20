import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { generic } from 'src/app/core/constants';
import { searchUsersModule } from 'src/app/core/defines';
import { DeleteUserPayload } from 'src/app/core/models';
import { ExportStoryData } from 'src/app/core/models/story';
import { DownloadPrintService } from 'src/app/core/services/download-print.service';
import { ProfileService } from '../profile/profile.service';
import { SearchUserService } from './search-user.service';

@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  styleUrls: ['./search-user.component.scss'],
})
export class SearchUserComponent {
  public userProfile: any;
  public searchText: string = '';
  public isError: boolean = false;
  public isUser: boolean = false;
  public noSearchLine1 = searchUsersModule.defaultLine1;
  public noUserFoundLine1 = searchUsersModule.noUserFoundLine1;
  public noUserFoundLine2 = searchUsersModule.noUserFoundLine2;
  public userFoundLine1 = searchUsersModule.userFoundLine1;

  //export data
  modalDisplay = 'none';
  firstName!: string;
  lastName!: string;
  nickName: undefined | string;
  profileImageExists: boolean = false;
  publishedStories: ExportStoryData[] = [];
  unpublishedStories: ExportStoryData[] = [];

  constructor(
    private _profileService: ProfileService,
    private _searchUserService: SearchUserService,
    private _toastrService: ToastrService,
    private _downloadPrintService: DownloadPrintService
  ) {}

  onSearch() {
    if (this.searchText.trim().length > 0) {
      this._profileService.getAppUser(this.searchText.trim()).subscribe(
        (data: any) => {
          this.isError = false;
          this.isUser = true;
          this.userProfile = data.data.isSuccess ? data.data.value : {};
        },
        (error: any) => {
          this.isUser = false;
          this.isError = true;
          let errMessage = error?.error?.data?.errors[0]?.detail;
          this._toastrService.error(errMessage || generic.errorMessage);
        }
      );
    } else {
      this.searchText = '';
      this.isError = this.isUser = false;
    }
  }

  onChangeSearchText(searchText: string) {
    if (searchText.length == 0) {
      this.isError = this.isUser = false;
    }
  }

  onToggle(value: any) {
    this._searchUserService
      .updateMinor(this.userProfile?.id, value?.checked)
      .subscribe(
        (res: any) => {
          if (res?.data.isSuccess) {
            this._toastrService.success(
              value?.checked
                ? searchUsersModule.optInMinor
                : searchUsersModule.optOutMinor
            );
          }
        },
        (error: any) => {
          console.log(error?.message);
          this._toastrService.error(generic.errorMessage);
        }
      );
  }

  deleteUser() {
    if (confirm(searchUsersModule.confirmDelete)) {
      const payload: DeleteUserPayload = {
        userId: this.userProfile?.id,
        username: this.userProfile?.username,
      };
      this._searchUserService.deleteUser(payload).subscribe(
        (res: any) => {
          if (res?.data.isSuccess) {
            this.isError = this.isUser = false;
            this.searchText = '';
            this._toastrService.success(searchUsersModule.removeUserSuccess);
          }
        },
        (error: any) => {
          console.log(error?.message);
          this._toastrService.error(generic.errorMessage);
        }
      );
    }
  }

  exportUser() {
    this._searchUserService.fetchExportData(this.userProfile.id).subscribe(
      (res: any) => {
        if (res.data.isSuccess) {
          const userData = res.data?.value;
          this.firstName = userData.firstName;
          this.lastName = userData.lastName;
          this.nickName = userData?.displayName;
          this.profileImageExists = userData.profileImageExists;
          this.publishedStories = userData?.publishedStories ?? [];
          this.unpublishedStories = userData?.unpublishedStories ?? [];
          this.modalDisplay = 'block';
        }
      },
      (error: any) => {
        this._toastrService.error(generic.errorMessage);
      }
    );
  }

  onCloseModal() {
    this.modalDisplay = 'none';
  }

  downloadPdf() {
    this._downloadPrintService.downloadPDF('export-data', `${this.userProfile.username.substring(1)} - Data`, true);
    this.onCloseModal();
  }
}
