import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { roles } from 'src/app/core/constants';
import { Community } from 'src/app/core/models';
import { SharedService } from 'src/app/core/services/shared.service';
import { DraftContentService } from '../../draft-content/draft-content.service';
import { ProfileService } from '../../profile/profile.service';

@Component({
  selector: 'app-admin-content',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.scss']
})
export class AdminContentComponent implements OnInit {
  @Input('adminUserId') adminUserId: string = '';

  private eventSubscription: Subscription;
  public isAdvocate: boolean = false;
  public myCommunityList: Array<Community> = [];
  public communityList: Array<Community> = [];
  public myCommunityName: string = "";
  public allCommunitiesId: any = [];
  public communities: Array<Community> = [];
  public profileInitials: string = '';
  public error: string = '';
  public adminUserDetails: any = {};
  public myProfileImage: any = {};

  constructor(
    private _profileService: ProfileService,
    private _sharedService: SharedService,
    private _draftContentService: DraftContentService
  ) {
    this.eventSubscription = this._sharedService.getEvent().subscribe(() => {
      this.getAdminUser(this.adminUserId);
    });
  }

  ngOnInit(): void {
    this.getAllCommunities();
  }

  ngOnChanges(): void {
    if (this.adminUserId !== '') {
      this.getAdminUser(this.adminUserId);
    }
  }

  getAdminUser(id: string) {
    this._profileService.getAnyProfile(id).subscribe(
      (data: any) => {
        this.adminUserDetails = data?.data?.value ?? null;
        this.myProfileImage = this.adminUserDetails.profileImage;
        this.isAdvocate = this.adminUserDetails.role === roles[1].role ? true : false;
        this.profileInitials = (
          this.adminUserDetails?.displayName || this.adminUserDetails?.firstName
        )?.charAt(0);
        this.communities = this.communityList.filter((item: { id: string; }) =>
          this.adminUserDetails?.communities?.includes(item.id)
        );

        if (this.isAdvocate) {
          this.myCommunityName = (this.communityList.length === this.communities.length) ? 'All Communities' : this.communities.filter(res => res.title).map(ele => ele.title).join(', ');
        }
      },
      (_error: any) => {
        this.adminUserDetails = null;
        console.log(_error);
        this.error = _error.error?.data?.errors?.detail;
      }
    );
  }

  // Get Community List
  getAllCommunities() {
    this._draftContentService.getAllCommunities().subscribe((data: any) => {
      this.communityList = data?.data?.value ?? [];
      if (data?.data?.value) {
        this.communityList.forEach((item: any) => {
          this.allCommunitiesId.push(item.id);
        });
      }
    });
  }

}
